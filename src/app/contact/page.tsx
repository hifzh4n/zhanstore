import { Mail, MapPin, Phone } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const channels = [
  {
    title: 'Email',
    detail: 'support@zhanstore.com',
    icon: Mail,
  },
  {
    title: 'Phone',
    detail: '+1 (800) 555-0147',
    icon: Phone,
  },
  {
    title: 'Office',
    detail: 'Digital Commerce District, Global Hub',
    icon: MapPin,
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-background to-primary/10">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground text-lg">Need help with an order or partnership request? Our team is available 24/7.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {channels.map((channel) => (
              <Card key={channel.title}>
                <CardHeader>
                  <channel.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{channel.detail}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
