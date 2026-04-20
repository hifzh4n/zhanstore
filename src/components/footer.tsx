import Link from 'next/link'
import { HeadphonesIcon, Globe, MessageCircle, Share2, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-primary">ZHAN STORE</h3>
            <p className="text-sm text-muted-foreground">
              Your global digital goods ecosystem. Top up mobile games, buy gift cards, and more with instant delivery.
            </p>
            <div className="flex space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-primary" aria-label="Homepage"><Globe className="h-5 w-5" /></Link>
              <Link href="/help-center" className="text-muted-foreground hover:text-primary" aria-label="Help Center"><MessageCircle className="h-5 w-5" /></Link>
              <Link href="/deals" className="text-muted-foreground hover:text-primary" aria-label="Promotions"><Share2 className="h-5 w-5" /></Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary" aria-label="Contact"><Mail className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/account" className="hover:text-foreground">Account</Link></li>
              <li><Link href="/partnership" className="hover:text-foreground">Partnership</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services/mobile-game-top-up" className="hover:text-foreground">Mobile Game Top-Up</Link></li>
              <li><Link href="/services/gift-cards" className="hover:text-foreground">Gift Cards</Link></li>
              <li><Link href="/services/game-console" className="hover:text-foreground">Game Console</Link></li>
              <li><Link href="/services/mobile-recharge" className="hover:text-foreground">Mobile Recharge</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help-center" className="hover:text-foreground">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li>
                 <div className="flex items-center space-x-2 mt-4 text-primary font-medium">
                   <HeadphonesIcon className="h-5 w-5" />
                   <span>24/7 Live Support</span>
                 </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Zhan Store. All rights reserved.</p>
           <div className="flex space-x-4 mt-4 md:mt-0">
             <span>Protected by reCAPTCHA</span>
             <span>SSL Secured</span>
           </div>
        </div>
      </div>
    </footer>
  )
}
