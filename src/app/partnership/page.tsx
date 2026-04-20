import Link from 'next/link'
import { Building2, Handshake, Rocket } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PartnershipPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-background via-primary/5 to-background py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Partner With Zhan Store</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground text-lg">
              Collaborate with our platform to expand your digital product reach and grow revenue.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle>For Publishers</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Launch offers, manage campaigns, and reach active gaming communities.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Handshake className="h-6 w-6 text-primary" />
                <CardTitle>For Resellers</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Access product catalogs and promotional tools tailored for reseller growth.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Rocket className="h-6 w-6 text-primary" />
                <CardTitle>For Affiliates</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Promote products and earn commission through trackable referral channels.</CardContent>
            </Card>
          </div>
          <div className="container mx-auto px-4 md:px-6 mt-8">
            <Link href="/contact">
              <Button className="cursor-pointer">Get In Touch</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
