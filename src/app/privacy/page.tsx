import { Lock, Shield, UserCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const privacyItems = [
  {
    title: 'Data Collection',
    icon: UserCheck,
    text: 'We collect essential order and account information required to process top-ups and provide customer support.',
  },
  {
    title: 'Data Protection',
    icon: Shield,
    text: 'Security controls are applied to protect personal information and payment-related metadata.',
  },
  {
    title: 'User Control',
    icon: Lock,
    text: 'You can request account data updates and contact support for privacy-related concerns.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">This page explains how Zhan Store handles personal information and protects user data.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {privacyItems.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <item.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">{item.text}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
