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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  User,
  Lock,
  Users,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  getMyProfile,
  updateProfile,
  changePassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  type ProfileDTO,
} from '@/app/actions/account.actions'

const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] as const

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
}

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

  // Team members
  const [users, setUsers] = useState<ProfileDTO[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [formUsername, setFormUsername] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<string>('MANAGER')
  const [formStatus, setFormStatus] = useState<string>('ACTIVE')
  const [savingUser, setSavingUser] = useState(false)
  const [userFormFeedback, setUserFormFeedback] = useState<Feedback>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [teamFeedback, setTeamFeedback] = useState<Feedback>(null)

  useEffect(() => {
    let active = true
    Promise.all([getMyProfile(), listUsers().catch(() => [])])
      .then(([data, allUsers]) => {
        if (!active) return
        setProfile(data)
        setUsername(data.username)
        setEmail(data.email)
        setAvatar(data.avatar)
        setUsers(allUsers)
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

  // Super admins and admins can manage users.
  const isSuperAdmin = profile?.role === 'SUPER_ADMIN'
  const canManageUsers = isSuperAdmin || profile?.role === 'ADMIN'
  // Admins can't create/assign the super admin role — only super admins can.
  const assignableRoles = isSuperAdmin
    ? USER_ROLES
    : USER_ROLES.filter((r) => r !== 'SUPER_ADMIN')

  const closeUserForm = () => {
    setShowUserForm(false)
    setEditingUserId(null)
    setFormUsername('')
    setFormEmail('')
    setFormPassword('')
    setFormRole('MANAGER')
    setFormStatus('ACTIVE')
    setUserFormFeedback(null)
  }

  const openAddUser = () => {
    closeUserForm()
    setShowUserForm(true)
    setTeamFeedback(null)
  }

  const openEditUser = (u: ProfileDTO) => {
    setEditingUserId(u.id)
    setFormUsername(u.username)
    setFormEmail(u.email)
    setFormPassword('')
    setFormRole(u.role)
    setFormStatus(u.status)
    setUserFormFeedback(null)
    setTeamFeedback(null)
    setShowUserForm(true)
  }

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingUser(true)
    setUserFormFeedback(null)
    try {
      if (editingUserId) {
        const updated = await updateUser({
          id: editingUserId,
          username: formUsername,
          email: formEmail,
          role: formRole,
          status: formStatus,
          password: formPassword || undefined,
        })
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        )
        setTeamFeedback({ type: 'success', message: 'User updated' })
      } else {
        const created = await createUser({
          username: formUsername,
          email: formEmail,
          password: formPassword,
          role: formRole,
          status: formStatus,
        })
        setUsers((prev) => [created, ...prev])
        setTeamFeedback({ type: 'success', message: 'User created' })
      }
      closeUserForm()
    } catch (error) {
      setUserFormFeedback({
        type: 'error',
        message: (error as Error).message || 'Failed to save user',
      })
    } finally {
      setSavingUser(false)
    }
  }

  const handleDeleteUser = async (u: ProfileDTO) => {
    if (
      !window.confirm(
        `Delete user "${u.username}"? This action cannot be undone.`
      )
    )
      return
    setDeletingUserId(u.id)
    setTeamFeedback(null)
    try {
      await deleteUser(u.id)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
      setTeamFeedback({ type: 'success', message: 'User deleted' })
    } catch (error) {
      setTeamFeedback({
        type: 'error',
        message: (error as Error).message || 'Failed to delete user',
      })
    } finally {
      setDeletingUserId(null)
    }
  }

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

              {/* Team Members */}
              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Team Members
                    </h3>
                    <Badge variant="secondary">{users.length}</Badge>
                  </div>
                  {canManageUsers && !showUserForm && (
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={openAddUser}
                    >
                      <Plus className="size-4" />
                      Add User
                    </Button>
                  )}
                </div>

                {teamFeedback && (
                  <div className="mb-4">
                    <FeedbackBanner feedback={teamFeedback} />
                  </div>
                )}

                {/* Create / edit user form */}
                {canManageUsers && showUserForm && (
                  <form
                    onSubmit={handleSubmitUser}
                    className="mb-6 space-y-4 rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {editingUserId ? 'Edit User' : 'Add New User'}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="form-username">Username</Label>
                        <Input
                          id="form-username"
                          value={formUsername}
                          onChange={(e) => setFormUsername(e.target.value)}
                          placeholder="username"
                          required
                          className="h-10 bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-email">Email</Label>
                        <Input
                          id="form-email"
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="user@example.com"
                          required
                          className="h-10 bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-password">
                          Password
                          {editingUserId && (
                            <span className="ml-1 font-normal text-muted-foreground">
                              (leave blank to keep)
                            </span>
                          )}
                        </Label>
                        <Input
                          id="form-password"
                          type="password"
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          autoComplete="new-password"
                          required={!editingUserId}
                          className="h-10 bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-role">Role</Label>
                        <Select value={formRole} onValueChange={setFormRole}>
                          <SelectTrigger id="form-role" className="h-10 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {assignableRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role] ?? role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-status">Status</Label>
                        <Select value={formStatus} onValueChange={setFormStatus}>
                          <SelectTrigger id="form-status" className="h-10 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FeedbackBanner feedback={userFormFeedback} />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeUserForm}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={savingUser} className="min-w-[120px]">
                        {savingUser
                          ? 'Saving...'
                          : editingUserId
                          ? 'Save Changes'
                          : 'Create User'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Users list */}
                <div className="overflow-hidden rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        {canManageUsers && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                                  {u.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={u.avatar}
                                      alt=""
                                      className="size-full object-cover"
                                      onError={(e) => {
                                        ;(e.currentTarget as HTMLImageElement).style.display =
                                          'none'
                                      }}
                                    />
                                  ) : (
                                    u.username.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span>{u.username}</span>
                                {u.id === profile?.id && (
                                  <Badge variant="outline">You</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {u.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {ROLE_LABELS[u.role] ?? u.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={u.status === 'ACTIVE' ? 'default' : 'outline'}
                              >
                                {u.status}
                              </Badge>
                            </TableCell>
                            {canManageUsers && (
                              <TableCell className="text-right">
                                {/* Admins can't manage super admins — only super admins can. */}
                                {u.role === 'SUPER_ADMIN' && !isSuperAdmin ? (
                                  <span className="text-xs text-muted-foreground">
                                    —
                                  </span>
                                ) : (
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      aria-label="Edit user"
                                      onClick={() => openEditUser(u)}
                                    >
                                      <Pencil className="size-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      aria-label="Delete user"
                                      className="text-destructive hover:text-destructive"
                                      disabled={
                                        deletingUserId === u.id || u.id === profile?.id
                                      }
                                      onClick={() => handleDeleteUser(u)}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={canManageUsers ? 5 : 4}
                            className="py-8 text-center"
                          >
                            <p className="text-muted-foreground">No users found</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
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
