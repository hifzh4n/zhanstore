'use client'

import { useParams, notFound, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Info, Zap } from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { gamesData } from '@/lib/data'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/currency'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const game = gamesData.find(g => g.slug === slug)
  
  if (!game) {
    notFound()
  }

  const { addToCart, setCartOpen, setBuyNowItem, currency } = useStore()
  const [playerId, setPlayerId] = useState('')
  const [serverId, setServerId] = useState('')
  const [selectedItem, setSelectedItem] = useState(game.items[0])
  const [validationError, setValidationError] = useState('')

  const hasValidAccountInfo = () => {
    if (!playerId.trim()) {
      setValidationError('Please enter Player ID.')
      return false
    }

    if (game.slug === 'mobile-legends' && !serverId.trim()) {
      setValidationError('Please enter Zone ID.')
      return false
    }

    setValidationError('')
    return true
  }

  const addSelectedItemToCart = () => {
    addToCart({
      id: selectedItem.id,
      gameSlug: game.slug,
      gameName: game.name,
      itemName: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
    })
  }

  const handleAddToCart = () => {
    if (!hasValidAccountInfo()) return
    addSelectedItemToCart()
  }

  const handleBuyNow = () => {
    if (!hasValidAccountInfo()) return
    setBuyNowItem({
      id: selectedItem.id,
      gameSlug: game.slug,
      gameName: game.name,
      itemName: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
    })
    setCartOpen(false)
    router.push('/checkout')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <Image src={game.banner} alt={game.name} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:w-1/3 space-y-6"
            >
              <Card className="shadow-lg border-none overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Image src={game.icon} alt={game.name} width={80} height={80} className="w-20 h-20 rounded-2xl shadow-md object-cover" />
                    <div>
                      <h1 className="text-2xl font-bold">{game.name}</h1>
                      <p className="text-muted-foreground text-sm">{game.publisher}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                     <Badge variant="secondary" className="bg-primary/10 text-primary">{game.region}</Badge>
                     <Badge variant="outline"><Zap className="w-3 h-3 mr-1"/> Instant Delivery</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{game.description}</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none bg-accent/30 hidden lg:block">
                <CardContent className="p-6 text-sm">
                   <h3 className="flex items-center font-semibold mb-3"><Info className="w-4 h-4 mr-2 text-primary"/> How to Find Player ID</h3>
                   <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-1">
                     {game.playerIdTutorial.map((step, index) => (
                      <li key={`${game.slug}-tutorial-${index}`}>{step}</li>
                     ))}
                   </ol>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:w-2/3 space-y-8"
            >
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-2 border-transparent hover:border-primary/20 transition-all">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-semibold inline-block -mt-4 ml-6 shadow-md text-sm">
                    1. Account Information
                  </div>
                  <CardContent className="p-6 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="player-id" className="text-sm font-medium">Player ID <span className="text-destructive">*</span></label>
                        <Input id="player-id" placeholder="Enter Player ID" value={playerId} onChange={e => { setPlayerId(e.target.value); setValidationError('') }} />
                      </div>
                      {game.slug === 'mobile-legends' && (
                        <div className="space-y-2">
                          <label htmlFor="zone-id" className="text-sm font-medium">Zone ID <span className="text-destructive">*</span></label>
                          <Input id="zone-id" placeholder="(1234)" value={serverId} onChange={e => { setServerId(e.target.value); setValidationError('') }} />
                        </div>
                      )}
                    </div>
                    {validationError && <p className="text-sm text-destructive">{validationError}</p>}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-2 border-transparent transition-all">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-semibold inline-block -mt-4 ml-6 shadow-md text-sm">
                    2. Select Recharge Amount
                  </div>
                  <CardContent className="p-6 pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {game.items.map((item) => (
                        <button
                          type="button"
                          key={item.id} 
                          onClick={() => setSelectedItem(item)}
                          className={`relative cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center transition-all ${
                            selectedItem.id === item.id 
                            ? 'border-primary bg-primary/5 shadow-md scale-105' 
                            : 'border-border bg-background hover:border-primary/50 hover:bg-accent'
                          }`}
                          aria-pressed={selectedItem.id === item.id}
                        >
                          {item.popular && (
                            <Badge variant="destructive" className="absolute -top-3 transform font-bold shadow-sm">Popular</Badge>
                          )}
                          <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                          <p className="text-muted-foreground font-medium">{formatPrice(item.price, currency)}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="sticky bottom-4 z-40">
                <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div>
                       <p className="text-sm text-muted-foreground">Total Payment</p>
                       <p className="text-3xl font-extrabold text-primary">{formatPrice(selectedItem.price, currency)}</p>
                     </div>
                     <div className="flex gap-4 w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="flex-1 sm:flex-none cursor-pointer" onClick={handleAddToCart}>
                           Add to Cart
                        </Button>
                      <Button size="lg" className="flex-1 sm:flex-none shadow-lg shadow-primary/30 cursor-pointer" onClick={handleBuyNow}>
                           Buy Now
                        </Button>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
