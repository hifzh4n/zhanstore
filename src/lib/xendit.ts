import type { CartItem, CurrencyCode } from './store'

export type CreateXenditInvoicePayload = {
  externalId: string;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  currency: CurrencyCode;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}

export async function createXenditInvoice(payload: CreateXenditInvoicePayload) {
  const secretKey = process.env.XENDIT_SECRET_KEY

  if (!secretKey) {
    throw new Error('Missing XENDIT_SECRET_KEY environment variable.')
  }

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_id: payload.externalId,
      amount: Number(payload.amount.toFixed(2)),
      currency: payload.currency,
      description: payload.description,
      success_redirect_url: payload.successRedirectUrl,
      failure_redirect_url: payload.failureRedirectUrl,
      customer: {
        given_names: payload.customerName,
        email: payload.customerEmail,
      },
      items: payload.items.map((item) => ({
        name: item.itemName,
        quantity: item.quantity,
        price: Number(item.price.toFixed(2)),
        category: item.gameName,
      })),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Failed to create Xendit invoice.'
    throw new Error(message)
  }

  return data as {
    id: string;
    external_id: string;
    invoice_url: string;
    status: string;
  }
}