import { revalidatePath } from 'next/cache'
import { AdminCurrencySwitcher } from '@/components/admin/currency-switcher'
import { AdminSetupNotice } from '@/components/admin/setup-notice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAdminAmount, getAdminAccounts, getAdminConfigState, parseAdminCurrency } from '@/lib/admin-dashboard'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminAccountsPageProps = {
  searchParams?: Promise<{ currency?: string }>;
}

async function deleteUserAction(formData: FormData) {
  'use server'

  const userId = String(formData.get('userId') ?? '').trim()
  if (!userId) {
    throw new Error('Missing user id.')
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/accounts')
  revalidatePath('/admin')
}

export default async function AdminAccountsPage({ searchParams }: AdminAccountsPageProps) {
  const params = await searchParams
  const currency = parseAdminCurrency(params?.currency)
  const config = getAdminConfigState()
  if (!config.ready) {
    return <AdminSetupNotice missingVars={config.missingVars} />
  }

  const accounts = await getAdminAccounts()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Supabase Auth users with transaction activity summary.</p>
        </div>
        <AdminCurrencySwitcher currency={currency} />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2">Last Sign In</th>
                <th className="px-2 py-2">Total Orders</th>
                <th className="px-2 py-2">Paid Orders</th>
                <th className="px-2 py-2">Spent ({currency})</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2 font-medium">{account.name}</td>
                  <td className="px-2 py-2">{account.email}</td>
                  <td className="px-2 py-2">{new Date(account.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2">{account.lastSignInAt ? new Date(account.lastSignInAt).toLocaleString() : '-'}</td>
                  <td className="px-2 py-2">{account.orders.totalOrders}</td>
                  <td className="px-2 py-2">{account.orders.paidOrders}</td>
                  <td className="px-2 py-2">{formatAdminAmount(account.orders.spentUsd, currency)}</td>
                  <td className="px-2 py-2">
                    <form action={deleteUserAction}>
                      <input type="hidden" name="userId" value={account.id} />
                      <button
                        type="submit"
                        className="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                      >
                        Delete User
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
