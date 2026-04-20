'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!password || password !== confirmPassword) {
      setErrorMessage('Passwords must match.')
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      toast.error(error.message)
      return
    }

    setSuccessMessage('Password updated successfully. Redirecting to the homepage.')
    toast.success('Password updated successfully.')
    setTimeout(() => router.push('/'), 1200)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleUpdatePassword}>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                  <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-new-password" className="text-sm font-medium">Confirm Password</label>
                  <Input id="confirm-new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                </div>
                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                {successMessage && <p className="text-sm text-primary">{successMessage}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
                <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
