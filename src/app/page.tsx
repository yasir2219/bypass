'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shield, Users, Key, Download, Video, Settings, Gamepad2, MessageCircle, Loader2, LogOut } from 'lucide-react'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000)
    
    // Check for Discord OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const discordUser = urlParams.get('discord_user')
    const error = urlParams.get('error')
    
    if (discordUser) {
      try {
        const user = JSON.parse(decodeURIComponent(discordUser))
        setIsUser(true)
        toast.success(`Welcome, ${user.username}!`)
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('Error parsing Discord user:', error)
        toast.error('Failed to login with Discord')
      }
    } else if (error) {
      toast.error('Discord login failed')
    }
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (data.success) {
        setIsAdmin(true)
        toast.success('Welcome back, Admin!')
        // Store token in localStorage (simplified for demo)
        localStorage.setItem('adminToken', data.token)
      } else {
        // Try fallback login
        console.log('Trying fallback login...')
        const fallbackResponse = await fetch('/api/admin/login-fallback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginForm),
        })

        const fallbackData = await fallbackResponse.json()
        if (fallbackData.success) {
          setIsAdmin(true)
          toast.success('Welcome back, Admin! (Fallback Mode)')
          localStorage.setItem('adminToken', fallbackData.token)
        } else {
          toast.error(data.error || fallbackData.error || 'Invalid credentials')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to demo mode for now
      if (loginForm.username === 'yasir22193150' && loginForm.password === 'TYer2219@#') {
        setIsAdmin(true)
        toast.success('Welcome back, Admin! (Demo Mode)')
      } else {
        toast.error('Invalid credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth
    window.location.href = '/api/auth/discord/callback'
  }

  const handleSeedDatabase = async () => {
    try {
      // Try MongoDB first
      const response = await fetch('/api/seed', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Database seeded successfully!')
        console.log('Admin credentials:', data.admin)
      } else {
        toast.error('Failed to seed MongoDB, trying fallback...')
        // Try fallback
        const fallbackResponse = await fetch('/api/seed-fallback', {
          method: 'POST',
        })
        const fallbackData = await fallbackResponse.json()
        if (fallbackData.success) {
          toast.success('Fallback database seeded successfully!')
          console.log('Admin credentials:', fallbackData.admin)
        } else {
          toast.error('Failed to seed database')
        }
      }
    } catch (error) {
      console.error('Seed error:', error)
      toast.error('Failed to seed database')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setIsUser(false)
    localStorage.removeItem('adminToken')
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-cyan-500 rounded-full border-t-transparent"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent animate-pulse"></div>
        </motion.div>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            className="bg-gray-900 border-cyan-500/30 text-cyan-400"
            onClick={() => document.getElementById('admin-sidebar')?.classList.toggle('translate-x-0')}
          >
            <Shield className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            id="admin-sidebar"
            className="w-64 lg:w-64 bg-gray-900 border-r border-cyan-500/30 min-h-screen p-4 fixed lg:relative -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40"
          >
            <div className="flex items-center gap-2 mb-8">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h1 className="text-xl font-bold text-cyan-400">UID BYPASS</h1>
            </div>
            <nav className="space-y-2 mb-8">
              {[
                { icon: Users, label: 'Dashboard', tab: 'dashboard' },
                { icon: Key, label: 'Licenses', tab: 'licenses' },
                { icon: Users, label: 'Users', tab: 'users' },
                { icon: Download, label: 'Downloads', tab: 'downloads' },
                { icon: Video, label: 'Tutorials', tab: 'tutorials' },
                { icon: Settings, label: 'Settings', tab: 'settings' }
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    // Communicate with AdminDashboard component
                    const event = new CustomEvent('adminTabChange', { detail: item.tab })
                    window.dispatchEvent(event)
                    console.log(`Admin: Dispatched event for ${item.tab} tab`)
                    
                    // Also directly set state for immediate feedback
                    const adminDashboard = document.querySelector('[data-admin-dashboard]')
                    if (adminDashboard) {
                      adminDashboard.setAttribute('data-active-tab', item.tab)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 group"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                  <span className="group-hover:text-cyan-300">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:border-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0 overflow-x-auto">
            <AdminDashboard />
          </div>
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            className="bg-gray-900 border-purple-500/30 text-purple-400"
            onClick={() => document.getElementById('user-sidebar')?.classList.toggle('translate-x-0')}
          >
            <Gamepad2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            id="user-sidebar"
            className="w-64 lg:w-64 bg-gray-900 border-r border-purple-500/30 min-h-screen p-4 fixed lg:relative -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40"
          >
            <div className="flex items-center gap-2 mb-8">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-xl font-bold text-purple-400">UID BYPASS</h1>
            </div>
            <nav className="space-y-2 mb-8">
              {[
                { icon: Users, label: 'Dashboard', tab: 'dashboard' },
                { icon: Key, label: 'Licenses', tab: 'licenses' },
                { icon: Download, label: 'Downloads', tab: 'downloads' },
                { icon: Video, label: 'Tutorials', tab: 'tutorials' }
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    // Communicate with UserDashboard component
                    const event = new CustomEvent('userTabChange', { detail: item.tab })
                    window.dispatchEvent(event)
                    console.log(`User: Dispatched event for ${item.tab} tab`)
                    
                    // Also directly set state for immediate feedback
                    const userDashboard = document.querySelector('[data-user-dashboard]')
                    if (userDashboard) {
                      userDashboard.setAttribute('data-active-tab', item.tab)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500/10 transition-all duration-300 group"
                >
                  <item.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="group-hover:text-purple-300">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:border-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0 overflow-x-auto">
            <UserDashboard />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              UID BYPASS
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Advanced License Management System</p>
        </motion.div>

        {/* Login Tabs */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-cyan-500/30">
              <TabsTrigger value="admin" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Admin Login
              </TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                User Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="mt-6">
              <Card className="bg-gray-900 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Admin Portal</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your admin credentials to access the dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="bg-gray-800 border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="bg-gray-800 border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Login to Admin Panel
                    </Button>
                  </form>
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={handleSeedDatabase}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                    >
                      Initialize Database
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Admin: yasir22193150 | TYer2219@#
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user" className="mt-6">
              <Card className="bg-gray-900 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">User Portal</CardTitle>
                  <CardDescription className="text-gray-400">
                    Login with Discord to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleDiscordLogin}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Login with Discord
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Click to authenticate with your Discord account
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            { icon: Key, title: 'License Management', description: 'Generate and manage licenses' },
            { icon: Users, title: 'User Control', description: 'Monitor and control user access' },
            { icon: Gamepad2, title: 'UID System', description: 'Advanced UID bypass technology' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}