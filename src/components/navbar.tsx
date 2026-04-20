'use client'

import Link from 'next/link'
import { useDeferredValue, useState, type KeyboardEvent, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Menu, Search, ShoppingCart, X, Trash2, User, ChevronDown, LayoutDashboard, Settings2, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/currency'
import { gamesData } from '@/lib/data'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { filterAndRankGames, normalizeSearchQuery } from '@/lib/search'

type AuthMode = 'sign-in' | 'sign-up' | 'forgot-password'

export function Navbar() {
  const router = useRouter()
  const {
    cart,
    isCartOpen,
    setCartOpen,
    isAuthOpen,
    setAuthOpen,
    user,
    isAuthLoading,
    removeFromCart,
    signOutLocal,
    currency,
    setCurrency,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const normalizedQuery = normalizeSearchQuery(deferredSearchQuery)
  const filteredGames = filterAndRankGames(gamesData, normalizedQuery).slice(0, 6)
  const showSearchOverlay = normalizedQuery.length > 0

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setIsProfileMenuOpen(false)
    setAuthOpen(true)
  }

  const closeAuth = () => {
    setAuthOpen(false)
  }

  const openChangePassword = () => {
    setIsProfileMenuOpen(false)
    setIsChangePasswordOpen(true)
  }

  const closeChangePassword = () => {
    setIsChangePasswordOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const handleSearchSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = searchQuery.trim()
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredGames.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSearchIndex((current) => (current + 1) % filteredGames.length)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSearchIndex((current) => (current - 1 + filteredGames.length) % filteredGames.length)
      return
    }

    if (e.key === 'Enter' && activeSearchIndex >= 0) {
      e.preventDefault()
      const selectedGame = filteredGames[activeSearchIndex]
      if (selectedGame) {
        setSearchQuery('')
        router.push(`/games/${selectedGame.slug}`)
      }
      return
    }

    if (e.key === 'Escape') {
      setSearchQuery('')
    }
  }

  const handleSignIn = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSigningIn(true)

    if (!email || !password) {
      setIsSigningIn(false)
      toast.error('Enter both email and password.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setIsSigningIn(false)
      toast.error(error.message)
      return
    }

    setPassword('')
    setIsSigningIn(false)
    closeAuth()
    toast.success('Signed in successfully.')
  }

  const handleSignUp = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSigningUp(true)

    if (!firstName || !lastName || !email || !password) {
      setIsSigningUp(false)
      toast.error('Complete all fields to create your account.')
      return
    }

    if (password !== confirmPassword) {
      setIsSigningUp(false)
      toast.error('Password and confirm password must match.')
      return
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        },
      },
    })

    if (error) {
      setIsSigningUp(false)
      toast.error(error.message)
      return
    }

    setFirstName('')
    setLastName('')
    setPassword('')
    setConfirmPassword('')

    if (data.session) {
      setIsSigningUp(false)
      closeAuth()
      toast.success('Account created and signed in.')
      return
    }

    setAuthMode('sign-in')
    setIsSigningUp(false)
    closeAuth()
    toast.success('Account created. Check your email if confirmation is required, then sign in.')
  }

  const handleForgotPassword = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSendingReset(true)

    if (!email) {
      setIsSendingReset(false)
      toast.error('Enter your email address.')
      return
    }

    const redirectTo = `${globalThis.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      setIsSendingReset(false)
      toast.error(error.message)
      return
    }

    setIsSendingReset(false)
    closeAuth()
    toast.success('Reset link sent. Please check your inbox.')
  }

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      setIsLoggingOut(false)
      toast.error(error.message)
      return
    }

    signOutLocal()
    setIsProfileMenuOpen(false)
    setIsLogoutConfirmOpen(false)
    setIsLoggingOut(false)
    toast.success('Logged out successfully.')
  }

  const openLogoutConfirm = () => {
    setIsProfileMenuOpen(false)
    setIsLogoutConfirmOpen(true)
  }

  const handleChangePassword = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsChangingPassword(true)

    if (!user?.email) {
      setIsChangingPassword(false)
      toast.error('Sign in first to change your password.')
      closeChangePassword()
      return
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setIsChangingPassword(false)
      toast.error('Fill in your current password and the new password fields.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setIsChangingPassword(false)
      toast.error('New passwords must match.')
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      setIsChangingPassword(false)
      toast.error('Current password is incorrect.')
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    if (updateError) {
      setIsChangingPassword(false)
      toast.error(updateError.message)
      return
    }

    closeChangePassword()
    signOutLocal()
    await supabase.auth.signOut()
    setIsChangingPassword(false)
    toast.success('Password changed successfully. Please sign in again.')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-primary">ZHAN STORE</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2 border-r pr-2">
              <span className="text-xl font-bold tracking-tight text-primary">ZHAN STORE</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-2 cursor-pointer" onClick={() => router.push('/search')} aria-label="Search products">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden flex-1 md:flex px-4 max-w-xl mx-auto">
            <form className="relative w-full" onSubmit={handleSearchSubmit}>
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search games, gift cards, consoles..."
                value={searchQuery}
                  onChange={(e) => {
                    const nextValue = e.target.value
                    setSearchQuery(nextValue)
                    setActiveSearchIndex(nextValue.trim() ? 0 : -1)
                  }}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-accent text-accent-foreground pl-9 rounded-full border-none focus-visible:ring-primary h-10"
              />

              {showSearchOverlay && (
                <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border bg-background shadow-xl">
                  {filteredGames.length > 0 ? (
                    <div className="max-h-80 overflow-auto p-2">
                      {filteredGames.map((game, index) => {
                        const isActive = index === activeSearchIndex

                        return (
                          <button
                            key={game.slug}
                            type="button"
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}
                            onClick={() => {
                              setSearchQuery('')
                              setActiveSearchIndex(-1)
                              router.push(`/games/${game.slug}`)
                            }}
                            onMouseEnter={() => setActiveSearchIndex(index)}
                          >
                            <Image src={game.icon} alt={game.name} width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{game.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{game.publisher}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">No matching results found.</div>
                  )}

                  <div className="border-t p-2">
                    <button
                      type="submit"
                      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-primary hover:bg-accent"
                    >
                      View full search results
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center justify-end space-x-2 sm:space-x-4 ml-auto">
            <div className="hidden lg:flex items-center space-x-4 mr-2">
              <div className="flex items-center rounded-md border bg-background p-1">
                <Button
                  variant={currency === 'USD' ? 'secondary' : 'ghost'}
                  className="text-sm font-medium h-7 px-3 cursor-pointer"
                  onClick={() => setCurrency('USD')}
                >
                  USD
                </Button>
                <Button
                  variant={currency === 'MYR' ? 'secondary' : 'ghost'}
                  className="text-sm font-medium h-7 px-3 cursor-pointer"
                  onClick={() => setCurrency('MYR')}
                >
                  MYR
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="lg:hidden h-8 px-2 text-xs font-semibold cursor-pointer"
              onClick={() => setCurrency(currency === 'USD' ? 'MYR' : 'USD')}
            >
              {currency}
            </Button>

            <Button variant="ghost" size="icon" className="relative cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-white font-bold"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Button>

            <div className="hidden md:flex ml-2 items-center space-x-2">
              {isAuthLoading ? (
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              ) : user ? (
                <div className="relative">
                  <Button variant="outline" className="h-9 cursor-pointer" onClick={() => setIsProfileMenuOpen((current) => !current)} aria-expanded={isProfileMenuOpen}>
                    <User className="mr-2 h-4 w-4" /> {user.name} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border bg-background p-2 shadow-xl"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            openChangePassword()
                          }}
                        >
                          <Settings2 className="mr-2 h-4 w-4" /> Change Password
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsProfileMenuOpen(false)
                            router.push('/account')
                          }}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Account
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={openLogoutConfirm}>
                          Log Out
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="h-9 cursor-pointer" onClick={() => openAuth('sign-in')}>Sign In</Button>
                  <Button className="h-9 cursor-pointer" onClick={() => openAuth('sign-up')}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t bg-secondary/20 md:hidden">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col gap-2 text-sm font-medium">
                <Link href="/" className="rounded-md px-2 py-1.5 hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/games/pubg-mobile" className="rounded-md px-2 py-1.5 hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>PUBG Mobile</Link>
                <Link href="/games/mobile-legends" className="rounded-md px-2 py-1.5 hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>Mobile Legends</Link>
                <Link href="/games/valorant" className="rounded-md px-2 py-1.5 hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>Valorant</Link>
                <Link href="/deals" className="rounded-md px-2 py-1.5 hover:bg-accent" onClick={() => setIsMobileMenuOpen(false)}>Special Deals</Link>
              </nav>
              {isAuthLoading ? (
                <div className="mt-3 flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              ) : user ? (
                <div className="mt-3 rounded-md border bg-background px-3 py-2 text-sm">
                  <button type="button" className="flex w-full items-center justify-between text-left font-medium" onClick={() => setIsProfileMenuOpen((current) => !current)} aria-expanded={isProfileMenuOpen}>
                    <span>Signed in as {user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-3 space-y-2 border-t pt-3"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            openChangePassword()
                          }}
                        >
                          <Settings2 className="mr-2 h-4 w-4" /> Change Password
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => { setIsMobileMenuOpen(false); setIsProfileMenuOpen(false); router.push('/account') }}>
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Account
                        </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={openLogoutConfirm}>
                            {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />} Log Out
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsMobileMenuOpen(false); openAuth('sign-in') }}>Sign In</Button>
                  <Button className="flex-1" onClick={() => { setIsMobileMenuOpen(false); openAuth('sign-up') }}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="hidden lg:flex border-t bg-secondary/20">
          <div className="container mx-auto flex h-12 items-center px-4 md:px-6">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-primary">Home</Link>
              <Link href="/games/pubg-mobile" className="transition-colors hover:text-primary">PUBG Mobile</Link>
              <Link href="/games/mobile-legends" className="transition-colors hover:text-primary">Mobile Legends</Link>
              <Link href="/games/valorant" className="transition-colors hover:text-primary">Valorant</Link>
              <Link href="/deals" className="transition-colors hover:text-primary text-primary">Special Deals</Link>
            </nav>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-background border-l shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold flex items-center"><ShoppingCart className="mr-2" /> Shopping Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} className="cursor-pointer" aria-label="Close cart">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                    <Button className="mt-4 cursor-pointer" onClick={() => setCartOpen(false)}>Continue Shopping</Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 items-center">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase">{item.gameName}</p>
                        <h4 className="font-semibold">{item.itemName}</h4>
                        <p className="font-bold text-primary mt-1">{formatPrice(item.price, currency)} <span className="text-sm font-normal text-muted-foreground">x{item.quantity}</span></p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.itemName}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-secondary/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-semibold text-muted-foreground">Subtotal</span>
                    <span className="text-2xl font-bold">{formatPrice(cartTotal, currency)}</span>
                  </div>
                  <Button className="w-full h-12 text-lg shadow-lg cursor-pointer" onClick={() => router.push('/checkout')}>Checkout Now</Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {authMode === 'sign-in' && 'Welcome Back'}
                    {authMode === 'sign-up' && 'Create Your Account'}
                    {authMode === 'forgot-password' && 'Reset Password'}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={closeAuth} className="-mt-4 -mr-4 cursor-pointer" aria-label="Close auth modal">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {authMode === 'sign-in' && (
                  <>
                    <p className="text-muted-foreground mb-6">Sign in to your Zhan Store account to continue.</p>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="signin-email" className="text-sm font-medium">Email Address</label>
                        <Input
                          id="signin-email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label htmlFor="signin-password" className="text-sm font-medium">Password</label>
                          <button type="button" className="text-sm text-primary hover:underline" onClick={() => openAuth('forgot-password')}>
                            Forgot password?
                          </button>
                        </div>
                        <Input
                          id="signin-password"
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2 shadow-md cursor-pointer" disabled={isSigningIn}>
                        {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign In
                      </Button>
                    </form>
                  </>
                )}

                {authMode === 'sign-up' && (
                  <>
                    <p className="text-muted-foreground mb-6">Create a Zhan Store account to track orders and checkout faster.</p>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="signup-first-name" className="text-sm font-medium">First Name</label>
                          <Input
                            id="signup-first-name"
                            type="text"
                            required
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="signup-last-name" className="text-sm font-medium">Last Name</label>
                          <Input
                            id="signup-last-name"
                            type="text"
                            required
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="signup-email" className="text-sm font-medium">Email Address</label>
                        <Input
                          id="signup-email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                        <Input
                          id="signup-password"
                          type="password"
                          required
                          placeholder="Create password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm Password</label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          required
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2 shadow-md cursor-pointer" disabled={isSigningUp}>
                        {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Account
                      </Button>
                    </form>
                  </>
                )}

                {authMode === 'forgot-password' && (
                  <>
                    <p className="text-muted-foreground mb-6">Enter your email and we will send you a reset link.</p>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="forgot-email" className="text-sm font-medium">Email Address</label>
                        <Input
                          id="forgot-email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2 shadow-md cursor-pointer" disabled={isSendingReset}>
                        {isSendingReset ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Send Reset Link
                      </Button>
                    </form>
                  </>
                )}
              </div>

              <div className="bg-secondary/30 p-6 text-center text-sm border-t">
                {authMode === 'sign-in' && (
                  <>
                    Don&apos;t have an account?{' '}
                    <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setAuthMode('sign-up')}>
                      Sign up for free
                    </button>
                  </>
                )}
                {authMode === 'sign-up' && (
                  <>
                    Already have an account?{' '}
                    <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setAuthMode('sign-in')}>
                      Sign in
                    </button>
                  </>
                )}
                {authMode === 'forgot-password' && (
                  <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setAuthMode('sign-in')}>
                    Back to sign in
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangePasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChangePassword}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-xl"
            >
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Change Password</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Enter your current password before setting a new one.</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeChangePassword} className="-mt-4 -mr-4 cursor-pointer" aria-label="Close password modal">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                    <Input id="current-password" type="password" required placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                    <Input id="new-password" type="password" required placeholder="Create new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-new-password" className="text-sm font-medium">Confirm New Password</label>
                    <Input id="confirm-new-password" type="password" required placeholder="Re-enter new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base mt-2 shadow-md cursor-pointer" disabled={isChangingPassword}>
                    {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update Password
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsLogoutConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold">Log out?</h3>
              <p className="mt-2 text-sm text-muted-foreground">You will need to sign in again to access your profile and orders.</p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsLogoutConfirmOpen(false)} disabled={isLoggingOut}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleSignOut} disabled={isLoggingOut}>
                  {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Log Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
