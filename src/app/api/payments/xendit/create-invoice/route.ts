import { NextResponse } from 'next/server'
import { createXenditInvoice } from '@/lib/xendit'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY ? getSupabaseAdminClient() : null

    if (supabaseAdmin) {
      const { error: insertError } = await supabaseAdmin.from('orders').insert({
        user_id: body.userId,
        email: body.customerEmail,
        customer_name: body.customerName,
        external_id: body.externalId,
        items: body.items,
        total: body.amountUsd ?? body.amount,
        currency: body.currency,
        source: body.source,
        status: 'Pending',
      })

      if (insertError) {
        throw new Error(insertError.message)
      }
    }

    let result

    try {
      result = await createXenditInvoice({
        externalId: body.externalId,
        amount: body.amount,
        description: body.description,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        items: body.items,
        currency: body.currency,
        successRedirectUrl: body.successRedirectUrl,
        failureRedirectUrl: body.failureRedirectUrl,
      })
    } catch (error) {
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'Failed' })
          .eq('external_id', body.externalId)
      }

      throw error
    }

    if (supabaseAdmin) {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          xendit_invoice_id: result.id,
          invoice_url: result.invoice_url,
        })
        .eq('external_id', body.externalId)

      if (updateError) {
        throw new Error(updateError.message)
      }
    }

    return NextResponse.json({
      invoiceUrl: result.invoice_url,
      xenditInvoiceId: result.id,
      externalId: result.external_id,
      status: result.status,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create payment link.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}