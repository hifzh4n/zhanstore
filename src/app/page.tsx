'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Flame, Gamepad2, Gift, PlaySquare } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { gamesData } from '@/lib/data'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-background to-background pt-12 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium text-primary bg-primary/10">🔥 Hottest Deals of the Week</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                  Your Global <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Zhan Store</span>
                </h1>
                <p className="text-lg text-muted-foreground whitespace-pre-line max-w-lg">
                  Top up mobile games, buy gift cards and game keys instantly. 
                  Trusted by millions of gamers worldwide.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <Link href="/search">
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 cursor-pointer">
                      Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/deals">
                    <Button size="lg" variant="outline" className="rounded-full cursor-pointer">
                      View Promos
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 aspect-video group cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000"
                  alt="Hero Banner"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold">End of Season Sale</h3>
                  <p className="text-white/80">Up to 30% off on selected titles</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="border-y bg-muted/40 py-8">
           <div className="container mx-auto px-4 md:px-6">
             <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="grid grid-cols-2 md:grid-cols-4 gap-4"
             >
                <motion.div variants={itemVariants} className="flex items-center space-x-4 bg-background p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <Gamepad2 className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm">Direct Top-Up</h4>
                     <p className="text-xs text-muted-foreground">Mobile & PC Games</p>
                   </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center space-x-4 bg-background p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <Gift className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm">Gift Cards</h4>
                     <p className="text-xs text-muted-foreground">PSN, Steam, iTunes</p>
                   </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center space-x-4 bg-background p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <PlaySquare className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm">Video Streaming</h4>
                     <p className="text-xs text-muted-foreground">Netflix, Spotify</p>
                   </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center space-x-4 bg-background p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                   <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <Flame className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm">Flash Sales</h4>
                     <p className="text-xs text-muted-foreground">Limited time offers</p>
                   </div>
                </motion.div>
             </motion.div>
           </div>
        </section>

        {/* Popular Game Top-Up */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Popular Game Top-Up</h2>
                   <p className="text-muted-foreground">Direct top-up for your favorite mobile and PC games.</p>
                </div>
                <Link href="/search">
                  <Button variant="ghost" className="hidden sm:flex hover:bg-transparent hover:text-primary cursor-pointer">View Catalog <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
             </div>

             <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
             >
                {gamesData.map((game) => (
                   <Link href={`/games/${game.slug}`} key={game.slug}>
                     <motion.div variants={itemVariants}>
                       <Card className="border-none shadow-sm hover:shadow-md transition-all pt-4 px-4 pb-4 flex flex-col items-center text-center cursor-pointer group bg-background/60 hover:bg-background h-full">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 shadow-inner ring-1 ring-border group-hover:ring-primary/50 transition-all">
                            <Image src={game.icon} alt={game.name} width={80} height={80} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-1">{game.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{game.region}</p>
                       </Card>
                     </motion.div>
                   </Link>
                ))}
             </motion.div>
          </div>
        </section>
        
        {/* Support Banner */}
        <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 md:px-6 text-center relative z-10"
          >
             <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help With Your Order?</h2>
             <p className="mb-6 opacity-90 max-w-xl mx-auto">Our customer service team is available 24/7 to assist you with any questions or issues.</p>
             <Button variant="secondary" size="lg" className="rounded-full shadow-lg font-bold cursor-pointer text-primary">
               Contact Support
             </Button>
          </motion.div>
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
