import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminAccounts } from '@/lib/admin-dashboard'

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default async function AdminAccountsPage() {
  const accounts = await getAdminAccounts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Supabase Auth users with transaction activity summary.</p>
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
                <th className="px-2 py-2">Spent (USD)</th>
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
                  <td className="px-2 py-2">{formatUsd(account.orders.spentUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
