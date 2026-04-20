'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, Loader2, ReceiptText } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/currency'
import { toast } from 'sonner'

function createExternalId() {
  return `xendit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    cart,
    buyNowItem,
    currency,
    clearCart,
    clearBuyNowItem,
    addOrder,
    updateOrderByExternalId,
    user,
  } = useStore()
  const checkoutItems = buyNowItem ? [buyNowItem] : cart
  const total = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const isBuyNowCheckout = Boolean(buyNowItem)
  const [isPaying, setIsPaying] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentStatus = searchParams.get('xendit_status')
    const externalId = searchParams.get('external_id')

    if (!paymentStatus || !externalId) {
      return
    }

    if (paymentStatus === 'paid') {
      updateOrderByExternalId(externalId, { status: 'Paid' })
      clearCart()
      clearBuyNowItem()
      toast.success('Payment confirmed by Xendit.')
      router.replace('/account')
      return
    }

    if (paymentStatus === 'failed') {
      updateOrderByExternalId(externalId, { status: 'Failed' })
      toast.error('Payment was not completed.')
      router.replace('/checkout')
    }
  }, [clearBuyNowItem, clearCart, router, searchParams, updateOrderByExternalId])

  const handleClearCheckout = () => {
    if (isBuyNowCheckout) {
      clearBuyNowItem()
      return
    }

    clearCart()
  }

  const handlePayNow = async () => {
    if (!checkoutItems.length || isPaying) {
      return
    }

    if (!user?.email) {
      toast.error('Sign in first to continue to payment.')
      return
    }

    setIsPaying(true)

    try {
      const externalId = createExternalId()
      const pendingOrder = addOrder({
        items: checkoutItems,
        total,
        currency,
        userId: user.id,
        email: user.email,
        customerName: user.name,
        externalId,
        source: isBuyNowCheckout ? 'buy-now' : 'cart',
        status: 'Pending',
      })

      const response = await fetch('/api/payments/xendit/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          externalId,
          amount: total,
          currency,
          userId: user.id,
          description: `Zhan Store ${isBuyNowCheckout ? 'Buy Now' : 'Cart'} checkout for ${user.name}`,
          customerName: user.name,
          customerEmail: user.email,
          items: checkoutItems,
          successRedirectUrl: `${window.location.origin}/checkout?xendit_status=paid&external_id=${externalId}`,
          failureRedirectUrl: `${window.location.origin}/checkout?xendit_status=failed&external_id=${externalId}`,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        updateOrderByExternalId(pendingOrder.externalId, { status: 'Failed' })
        throw new Error(payload.error ?? 'Unable to start Xendit checkout.')
      }

      if (!payload.invoiceUrl) {
        updateOrderByExternalId(pendingOrder.externalId, { status: 'Failed' })
        throw new Error('Xendit did not return a checkout URL.')
      }

      updateOrderByExternalId(pendingOrder.externalId, {
        externalId: payload.externalId ?? externalId,
        invoiceUrl: payload.invoiceUrl,
      })

      toast.success('Redirecting to Xendit checkout...')
      globalThis.location.assign(payload.invoiceUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start Xendit checkout.'
      setIsPaying(false)
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue shopping
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Checkout</h1>

          {checkoutItems.length === 0 ? (
            <Card className="mt-8">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Your cart is empty. Add an item before checkout.</p>
                <Link href="/search">
                  <Button className="mt-4">Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{isBuyNowCheckout ? 'Buy Now Item' : 'Order Items'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-semibold">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{item.gameName} x{item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity, currency)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-xl font-extrabold text-primary">{formatPrice(total, currency)}</span>
                  </div>
                  <Button className="w-full" onClick={handlePayNow} disabled={isPaying}>
                    {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />} Pay Now
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleClearCheckout}>
                    {isBuyNowCheckout ? 'Remove Item' : 'Clear Cart'}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => router.push('/account')}>
                    <ReceiptText className="mr-2 h-4 w-4" /> View Order History
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
