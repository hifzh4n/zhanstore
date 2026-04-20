import { revalidatePath } from 'next/cache'
import { AdminCurrencySwitcher } from '@/components/admin/currency-switcher'
import { AdminSetupNotice } from '@/components/admin/setup-notice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAdminAmount, getAdminConfigState, getAdminOrders, parseAdminCurrency } from '@/lib/admin-dashboard'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminTransactionsPageProps = {
  searchParams?: Promise<{ currency?: string }>;
}

async function updateOrderStatusAction(formData: FormData) {
  'use server'

  const orderId = String(formData.get('orderId') ?? '').trim()
  const status = String(formData.get('status') ?? '').trim()

  if (!orderId || !status) {
    throw new Error('Missing order status payload.')
  }

  const supabase = getSupabaseAdminClient()

  const updatePayload: { status: string; paid_at?: string | null } = { status }
  if (status === 'Paid') {
    updatePayload.paid_at = new Date().toISOString()
  }
  if (status !== 'Paid') {
    updatePayload.paid_at = null
  }

  const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/transactions')
  revalidatePath('/admin')
}

export default async function AdminTransactionsPage({ searchParams }: AdminTransactionsPageProps) {
  const params = await searchParams
  const currency = parseAdminCurrency(params?.currency)
  const config = getAdminConfigState()
  if (!config.ready) {
    return <AdminSetupNotice missingVars={config.missingVars} />
  }

  const orders = await getAdminOrders()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review all orders and manually update payment state when needed.</p>
        </div>
        <AdminCurrencySwitcher currency={currency} />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Order Ledger</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">External ID</th>
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Source</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Paid At</th>
                <th className="px-2 py-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2 font-mono text-xs">{order.external_id}</td>
                  <td className="px-2 py-2">{order.customer_name}</td>
                  <td className="px-2 py-2">{order.email}</td>
                  <td className="px-2 py-2 uppercase">{order.source}</td>
                  <td className="px-2 py-2">{formatAdminAmount(Number(order.total), currency)} (Base {order.currency})</td>
                  <td className="px-2 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        order.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.status === 'Failed'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-2">{order.paid_at ? new Date(order.paid_at).toLocaleString() : '-'}</td>
                  <td className="px-2 py-2">
                    <form action={updateOrderStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select name="status" defaultValue={order.status} className="rounded-md border px-2 py-1 text-xs">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                      <button type="submit" className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
