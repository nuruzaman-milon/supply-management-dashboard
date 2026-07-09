'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { User, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  getMyProfile,
  updateProfile,
  changePassword,
  type ProfileDTO,
} from '@/app/actions/account.actions'

type Feedback = { type: 'success' | 'error'; message: string } | null

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  const isSuccess = feedback.type === 'success'
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
        isSuccess
          ? 'border-green-500/30 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
          : 'border-destructive/30 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="size-4 shrink-0" />
      ) : (
        <AlertCircle className="size-4 shrink-0" />
      )}
      {feedback.message}
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileDTO | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  // Profile form
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null)

  useEffect(() => {
    let active = true
    getMyProfile()
      .then((data) => {
        if (!active) return
        setProfile(data)
        setUsername(data.username)
        setEmail(data.email)
        setAvatar(data.avatar)
      })
      .catch((error) => {
        console.error('Failed to load profile', error)
        alert((error as Error).message || 'Failed to load profile')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileFeedback(null)
    try {
      const updated = await updateProfile({ username, email, avatar })
      setProfile(updated)
      setAvatar(updated.avatar)
      setProfileFeedback({ type: 'success', message: 'Profile updated. Reloading to refresh…' })
      // Session (topbar name/avatar) is refreshed on reload.
      setTimeout(() => window.location.reload(), 900)
    } catch (error) {
      setProfileFeedback({
        type: 'error',
        message: (error as Error).message || 'Failed to update profile',
      })
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordFeedback(null)

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New passwords do not match' })
      return
    }

    setSavingPassword(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setPasswordFeedback({ type: 'success', message: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setPasswordFeedback({
        type: 'error',
        message: (error as Error).message || 'Failed to change password',
      })
    } finally {
      setSavingPassword(false)
    }
  }

  const initial = (username || profile?.username || '?').charAt(0).toUpperCase()

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and security
          </p>
        </div>

        {isFetching ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        ) : (
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="profile" className="gap-2">
                <User className="size-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="size-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-foreground">
                  Profile Information
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar + identity */}
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar}
                          alt="Avatar"
                          className="size-full object-cover"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        initial
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {profile?.username}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary">{profile?.role}</Badge>
                        <Badge
                          variant={profile?.status === 'ACTIVE' ? 'default' : 'outline'}
                        >
                          {profile?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your-username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://… (optional)"
                      />
                    </div>
                  </div>

                  <FeedbackBanner feedback={profileFeedback} />

                  <div className="flex justify-end border-t border-border pt-6">
                    <Button type="submit" disabled={savingProfile} className="min-w-[140px]">
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-foreground">
                  Change Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>

                  <FeedbackBanner feedback={passwordFeedback} />

                  <div className="flex justify-end border-t border-border pt-6">
                    <Button type="submit" disabled={savingPassword} className="min-w-[140px]">
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
