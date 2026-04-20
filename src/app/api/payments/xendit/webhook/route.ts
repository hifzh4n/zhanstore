import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { sendOrderStatusEmail } from '@/lib/order-email'

type XenditWebhookPayload = {
  external_id?: string;
  externalId?: string;
  status?: string;
  paid_at?: string;
  paidAt?: string;
  payment_id?: string;
  paymentId?: string;
  id?: string;
}

export async function POST(request: Request) {
  try {
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN
    if (!expectedToken) {
      return NextResponse.json({ error: 'Missing XENDIT_WEBHOOK_TOKEN.' }, { status: 500 })
    }

    const callbackToken = request.headers.get('x-callback-token') ?? request.headers.get('x-xendit-callback-token')
    if (callbackToken !== expectedToken) {
      return NextResponse.json({ error: 'Invalid webhook token.' }, { status: 401 })
    }

    const payload = (await request.json()) as XenditWebhookPayload
    const externalId = payload.external_id ?? payload.externalId

    if (!externalId) {
      return NextResponse.json({ error: 'Missing external_id.' }, { status: 400 })
    }

    const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY ? getSupabaseAdminClient() : null

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const nextStatus = (payload.status ?? '').toUpperCase() === 'PAID' ? 'Paid' : (payload.status ?? '').toUpperCase() === 'EXPIRED' ? 'Failed' : 'Pending'

    const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
      .from('orders')
      .select('status,email,customer_name,external_id,total,currency,paid_at')
      .eq('external_id', externalId)
      .maybeSingle()

    if (existingOrderError) {
      return NextResponse.json({ error: existingOrderError.message }, { status: 500 })
    }

    const { error, data: updatedOrder } = await supabaseAdmin
      .from('orders')
      .update({
        status: nextStatus,
        paid_at: nextStatus === 'Paid' ? (payload.paid_at ?? payload.paidAt ?? new Date().toISOString()) : null,
        xendit_payment_id: payload.payment_id ?? payload.paymentId ?? payload.id ?? null,
      })
      .eq('external_id', externalId)
      .select('status,email,customer_name,external_id,total,currency,paid_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const isFinalStatus = nextStatus === 'Paid' || nextStatus === 'Failed'
    const statusChanged = existingOrder?.status !== nextStatus

    if (isFinalStatus && statusChanged && updatedOrder?.email && updatedOrder?.customer_name) {
      await sendOrderStatusEmail({
        email: updatedOrder.email,
        customerName: updatedOrder.customer_name,
        externalId: updatedOrder.external_id,
        status: nextStatus,
        currency: updatedOrder.currency,
        totalUsd: Number(updatedOrder.total ?? 0),
        paidAt: updatedOrder.paid_at,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}