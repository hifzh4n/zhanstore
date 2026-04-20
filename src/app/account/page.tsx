'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/currency'
import { supabase } from '@/lib/supabase/client'
import type { OrderRecord } from '@/lib/store'

export default function AccountPage() {
  const { user, isAuthLoading, orders, currency } = useStore()
  const [remoteOrders, setRemoteOrders] = useState<OrderRecord[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setRemoteOrders([])
        return
      }

      setIsOrdersLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setIsOrdersLoading(false)

      if (error || !data) {
        return
      }

      setRemoteOrders(
        data.map((order) => ({
          id: order.id,
          createdAt: order.created_at,
          userId: order.user_id,
          items: order.items as OrderRecord['items'],
          total: Number(order.total),
          currency: order.currency,
          email: order.email,
          customerName: order.customer_name,
          externalId: order.external_id,
          invoiceUrl: order.invoice_url ?? undefined,
          source: order.source,
          status: order.status,
        }))
      )
    }

    loadOrders()
  }, [user?.id])

  const scopedLocalOrders = user?.id
    ? orders.filter((order) => order.userId === user.id || order.email === user.email)
    : []

  const mergedOrders = [...remoteOrders, ...scopedLocalOrders]
  const uniqueOrders = new Map<string, OrderRecord>()

  for (const order of mergedOrders) {
    uniqueOrders.set(order.externalId, order)
  }

  const visibleOrders = Array.from(uniqueOrders.values()).sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })

  const orderCount = visibleOrders.length
  const totalSpent = visibleOrders.filter((order) => order.status === 'Paid').reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Account</h1>
              <p className="mt-2 text-muted-foreground">View your orders and manage your store profile.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/search">
                <Button variant="outline">Browse Catalog</Button>
              </Link>
              <Link href="/deals">
                <Button>View Deals</Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Signed In As</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {isAuthLoading ? (
                  <div className="h-16 animate-pulse rounded-md bg-muted" />
                ) : user ? (
                  <>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">You are not signed in.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-primary">{orderCount}</p>
                <p className="text-sm text-muted-foreground">Saved orders in your history</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-primary">{formatPrice(totalSpent, currency)}</p>
                <p className="text-sm text-muted-foreground">Across completed orders</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthLoading || isOrdersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : !user ? (
                <div className="rounded-xl border bg-background p-8 text-center">
                  <p className="text-muted-foreground">Sign in to see your saved order history.</p>
                </div>
              ) : visibleOrders.length === 0 ? (
                <div className="rounded-xl border bg-background p-8 text-center">
                  <p className="text-muted-foreground">No orders yet. Complete a checkout to start building your history.</p>
                  <Link href="/search">
                    <Button className="mt-4">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border bg-background p-5 shadow-sm">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">Order {order.id.slice(-6).toUpperCase()}</h3>
                            <Badge variant={order.status === 'Paid' ? 'secondary' : order.status === 'Failed' ? 'destructive' : 'outline'}>{order.status}</Badge>
                            <Badge variant="outline">{order.source === 'buy-now' ? 'Buy Now' : 'Cart Checkout'}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                          {order.invoiceUrl && (
                            <p className="mt-1 text-sm text-muted-foreground break-all">
                              Invoice: <a href={order.invoiceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open Xendit checkout</a>
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary">{formatPrice(order.total, order.currency)}</p>
                      </div>

                      <div className="mt-4 space-y-2">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.id}`} className="flex items-center justify-between border-t pt-2 text-sm">
                            <div>
                              <p className="font-medium">{item.itemName}</p>
                              <p className="text-muted-foreground">{item.gameName} x{item.quantity}</p>
                            </div>
                            <p className="font-semibold">{formatPrice(item.price * item.quantity, order.currency)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}