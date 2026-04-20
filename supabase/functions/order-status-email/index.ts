import "jsr:@supabase/functions-js/edge-runtime.d.ts"

type OrderEmailPayload = {
  to?: string;
  customerName?: string;
  externalId?: string;
  status?: 'Paid' | 'Failed';
  amount?: string;
  paidAt?: string | null;
}

function buildEmailHtml(payload: Required<Pick<OrderEmailPayload, 'customerName' | 'externalId' | 'status' | 'amount'>> & Pick<OrderEmailPayload, 'paidAt'>) {
  if (payload.status === 'Paid') {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Payment Confirmed</h2>
        <p>Hi ${payload.customerName},</p>
        <p>Your payment has been received successfully.</p>
        <ul>
          <li><strong>Order ID:</strong> ${payload.externalId}</li>
          <li><strong>Amount:</strong> ${payload.amount}</li>
          <li><strong>Paid at:</strong> ${payload.paidAt ?? 'Recently confirmed'}</li>
        </ul>
        <p>Thank you for shopping at Zhan Store.</p>
      </div>
    `
  }

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>Payment Not Completed</h2>
      <p>Hi ${payload.customerName},</p>
      <p>Your payment was not completed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${payload.externalId}</li>
        <li><strong>Amount:</strong> ${payload.amount}</li>
      </ul>
      <p>You can return to checkout and try again anytime.</p>
    </div>
  `
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405 })
  }

  const expectedToken = Deno.env.get('SUPABASE_ORDER_EMAIL_TOKEN')
  const callbackToken = req.headers.get('x-order-email-token')

  if (!expectedToken || callbackToken !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401 })
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const fromEmail = Deno.env.get('ORDER_FROM_EMAIL')

  if (!resendApiKey || !fromEmail) {
    return new Response(JSON.stringify({ error: 'Missing email provider configuration.' }), { status: 500 })
  }

  const payload = (await req.json()) as OrderEmailPayload

  if (!payload.to || !payload.customerName || !payload.externalId || !payload.status || !payload.amount) {
    return new Response(JSON.stringify({ error: 'Missing payload fields.' }), { status: 400 })
  }

  const subject = payload.status === 'Paid'
    ? `Payment confirmed - ${payload.externalId}`
    : `Payment failed - ${payload.externalId}`

  const html = buildEmailHtml({
    customerName: payload.customerName,
    externalId: payload.externalId,
    status: payload.status,
    amount: payload.amount,
    paidAt: payload.paidAt ?? null,
  })

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [payload.to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    return new Response(JSON.stringify({ error: errText || 'Failed to send email.' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
