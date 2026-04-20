type OrderEmailStatus = 'Paid' | 'Failed'

type SendOrderStatusEmailParams = {
  email: string;
  customerName: string;
  externalId: string;
  status: OrderEmailStatus;
  currency: 'USD' | 'MYR';
  totalUsd: number;
  paidAt?: string | null;
}

const CURRENCY_RATES: Record<'USD' | 'MYR', number> = {
  USD: 1,
  MYR: 4.7,
}

const CURRENCY_LOCALES: Record<'USD' | 'MYR', string> = {
  USD: 'en-US',
  MYR: 'ms-MY',
}

function formatOrderAmount(totalUsd: number, currency: 'USD' | 'MYR') {
  const converted = totalUsd * CURRENCY_RATES[currency]

  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)
}

export async function sendOrderStatusEmail(params: SendOrderStatusEmailParams) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const emailToken = process.env.SUPABASE_ORDER_EMAIL_TOKEN

  if (!supabaseUrl || !emailToken) {
    return { sent: false, reason: 'missing_config' as const }
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/order-status-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-order-email-token': emailToken,
    },
    body: JSON.stringify({
      to: params.email,
      customerName: params.customerName,
      externalId: params.externalId,
      status: params.status,
      amount: formatOrderAmount(params.totalUsd, params.currency),
      paidAt: params.paidAt ?? null,
    }),
  })

  if (!response.ok) {
    return { sent: false, reason: 'edge_function_error' as const }
  }

  return { sent: true as const }
}
