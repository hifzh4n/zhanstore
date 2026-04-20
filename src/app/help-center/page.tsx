import Link from 'next/link'
import { CircleHelp, CreditCard, Gamepad2, MessageSquare } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const faqs = [
  {
    title: 'How long does delivery take?',
    answer: 'Most top-up orders are delivered instantly after successful payment.',
    icon: Gamepad2,
  },
  {
    title: 'What payment methods are supported?',
    answer: 'Cards and available local channels are supported depending on your region.',
    icon: CreditCard,
  },
  {
    title: 'Where can I report an order issue?',
    answer: 'Use our contact page and include your order reference for faster support.',
    icon: MessageSquare,
  },
]

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-3">
              <CircleHelp className="h-6 w-6 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Help Center</h1>
            </div>
            <p className="max-w-2xl text-muted-foreground text-lg">Find quick answers to common questions about orders, payments, and account support.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 space-y-5">
            {faqs.map((faq) => (
              <Card key={faq.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <faq.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{faq.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">{faq.answer}</CardContent>
              </Card>
            ))}
            <div className="pt-4">
              <Link href="/contact">
                <Button className="cursor-pointer">Contact Support Team</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
