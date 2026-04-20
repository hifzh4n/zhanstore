import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sections = [
  {
    title: 'Use of Service',
    text: 'By using Zhan Store, you agree to provide accurate account information and comply with all applicable local regulations.',
  },
  {
    title: 'Orders and Delivery',
    text: 'Digital products are processed automatically. Delivery speed may vary based on publisher platform availability.',
  },
  {
    title: 'Refund and Cancellation',
    text: 'Completed digital deliveries are generally non-refundable unless required by law or due to confirmed processing errors.',
  },
  {
    title: 'Account Responsibility',
    text: 'You are responsible for keeping your credentials secure and for activities performed under your account.',
  },
]

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">Please read these terms carefully before placing orders through Zhan Store.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 space-y-5">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">{section.text}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
