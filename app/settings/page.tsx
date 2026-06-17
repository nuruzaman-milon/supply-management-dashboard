'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Settings, Building2, Mail, Bell, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [companyName, setCompanyName] = useState('TechVision Solutions')
  const [companyAddress, setCompanyAddress] = useState('123 Business Street, Tech City, TC 12345')
  const [companyPhone, setCompanyPhone] = useState('+880 1234567890')
  const [companyEmail, setCompanyEmail] = useState('info@techvisionsolutions.com')
  const [companyCurrency, setCompanyCurrency] = useState('BDT')
  const [companyTaxId, setCompanyTaxId] = useState('123456789')

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [invoiceNotifications, setInvoiceNotifications] = useState(true)
  const [dueAlerts, setDueAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  const [changePassword, setChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSave = (section) => {
    alert(`${section} settings saved successfully!`)
  }

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure system settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="size-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="size-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="size-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                General Settings
              </h3>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      System Language
                    </label>
                    <Select defaultValue="english">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Timezone
                    </label>
                    <Select defaultValue="bdt">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bdt">
                          Bangladesh Time (BDT)
                        </SelectItem>
                        <SelectItem value="ist">
                          Indian Standard Time (IST)
                        </SelectItem>
                        <SelectItem value="utc">
                          Coordinated Universal Time (UTC)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Date Format
                    </label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">
                          DD-MM-YYYY
                        </SelectItem>
                        <SelectItem value="mm-dd-yyyy">
                          MM-DD-YYYY
                        </SelectItem>
                        <SelectItem value="yyyy-mm-dd">
                          YYYY-MM-DD
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Time Format
                    </label>
                    <Select defaultValue="24h">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Hour</SelectItem>
                        <SelectItem value="12h">12 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave('General')}
                  className="mt-6"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Company Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Email
                  </label>
                  <Input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="Enter company email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <Input
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Address
                  </label>
                  <Textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Enter company address"
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Currency
                    </label>
                    <Select value={companyCurrency} onValueChange={setCompanyCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDT">Bangladeshi Taka</SelectItem>
                        <SelectItem value="USD">US Dollar</SelectItem>
                        <SelectItem value="INR">Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Tax ID
                    </label>
                    <Input
                      value={companyTaxId}
                      onChange={(e) => setCompanyTaxId(e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSave('Company')}
                  className="mt-6"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Email Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Invoice Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when invoices are created
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={invoiceNotifications}
                    onChange={(e) =>
                      setInvoiceNotifications(e.target.checked)
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Due Alerts
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Alert for upcoming and overdue dues
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dueAlerts}
                    onChange={(e) => setDueAlerts(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Weekly Reports
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <Button
                  onClick={() => handleSave('Notifications')}
                  className="mt-6"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Security Settings
              </h3>

              <div className="space-y-4">
                {!changePassword && (
                  <Button
                    variant="outline"
                    onClick={() => setChangePassword(true)}
                    className="w-full"
                  >
                    Change Password
                  </Button>
                )}

                {changePassword && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Confirm Password
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button
                        onClick={() => {
                          handleSave('Password')
                          setChangePassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                        }}
                      >
                        Update Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setChangePassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}

                <div className="border-t border-border pt-6 mt-6">
                  <h4 className="font-semibold text-foreground mb-4">
                    Active Sessions
                  </h4>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-foreground mb-2">
                      Current Session
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Chrome on Windows · Last active: just now
                    </p>
                    <Button variant="outline" size="sm">
                      Sign Out Other Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
