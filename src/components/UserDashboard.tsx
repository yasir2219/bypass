"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast, Toaster } from 'sonner'
import { 
  Shield, Users, Key, Download, Video, Settings, Gamepad2, Plus, ExternalLink, 
  Calendar, Activity, CheckCircle, Clock, AlertCircle 
} from 'lucide-react'

interface UserLicense {
  id: string
  gameUID: string
  licenseKey: string
  expireDate: string
  status: string
  licenseType: string
  activatedAt: string
  remainingDays?: number
}

interface DownloadItem {
  id: string
  fileName: string
  description: string
  version: string
  fileSize: string
  downloadLink: string
}

interface Tutorial {
  id: string
  title: string
  description: string
  youtubeLink: string
  thumbnail: string
}

export default function UserDashboard() {
  const [licenses, setLicenses] = useState<UserLicense[]>([])
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [discordLink, setDiscordLink] = useState('')
  
  // Form states for UID activation
  const [activationForm, setActivationForm] = useState({
    gameUID: '',
    licenseKey: ''
  })

  // State to track the last activated UID
  const [lastActivatedUID, setLastActivatedUID] = useState<string>('')

  useEffect(() => {
    fetchCommonData()
    
    // Listen for tab changes from parent
    const handleUserTabChange = (event: any) => {
      setActiveTab(event.detail)
    }
    
    window.addEventListener('userTabChange', handleUserTabChange)
    
    return () => {
      window.removeEventListener('userTabChange', handleUserTabChange)
    }
  }, [])

  const fetchCommonData = async () => {
    try {
      // Fetch downloads
      const downloadsResponse = await fetch('/api/downloads')
      if (downloadsResponse.ok) {
        const downloadsData = await downloadsResponse.json()
        if (downloadsData.success && downloadsData.downloads) {
          setDownloads(downloadsData.downloads)
        }
      }

      // Fetch tutorials
      const tutorialsResponse = await fetch('/api/tutorials')
      if (tutorialsResponse.ok) {
        const tutorialsData = await tutorialsResponse.json()
        if (tutorialsData.success && tutorialsData.tutorials) {
          setTutorials(tutorialsData.tutorials)
        }
      }

      // Fetch settings for Discord link
      const settingsResponse = await fetch('/api/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        if (settingsData.success && settingsData.settings && settingsData.settings.discordServerLink) {
          setDiscordLink(settingsData.settings.discordServerLink)
        }
      }
    } catch (error) {
      console.error('Error fetching common data:', error)
      toast.error('Failed to load data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUIDDetails = async (gameUID: string) => {
    try {
      const response = await fetch(`/api/users/activate-uid?gameUID=${encodeURIComponent(gameUID)}`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.uids) {
          setLicenses(data.uids)
          return data.uids
        }
      }
      
      return []
    } catch (error) {
      console.error('Error fetching UID details:', error)
      toast.error('Failed to fetch UID details')
      return []
    }
  }

  const handleActivateUID = async () => {
    if (!activationForm.gameUID || !activationForm.licenseKey) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const response = await fetch('/api/users/activate-uid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activationForm),
      })

      const data = await response.json()

      if (data.success) {
        const isLifetime = activationForm.licenseKey.startsWith('LIFETIME-')
        
        if (isLifetime) {
          toast.success('Lifetime UID activated successfully! Unlimited access granted.')
        } else {
          toast.success('UID activated successfully!')
        }
        
        // Store the activated UID
        setLastActivatedUID(activationForm.gameUID)
        
        // Clear the form
        setActivationForm({ gameUID: '', licenseKey: '' })
        
        // Fetch the updated UID details
        await fetchUIDDetails(activationForm.gameUID)
      } else {
        toast.error(data.error || 'Failed to activate UID')
      }
    } catch (error) {
      console.error('Error activating UID:', error)
      toast.error('Failed to activate UID. Please try again.')
    }
  }

  const handleCheckUID = async () => {
    if (!activationForm.gameUID) {
      toast.error('Please enter your Game UID')
      return
    }

    await fetchUIDDetails(activationForm.gameUID)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400'
      case 'BANNED': return 'text-red-400'
      case 'PAUSED': return 'text-yellow-400'
      case 'EXPIRED': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />
      case 'PAUSED': return <Clock className="w-4 h-4" />
      case 'EXPIRED': return <AlertCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div data-user-dashboard className="flex-1 p-8">
      {/* Add the Toaster component to render toast notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        expand={false}
        duration={5000}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          User Dashboard
        </h2>
        <p className="text-gray-400">Activate and manage your UID bypass licenses</p>
      </motion.div>

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-purple-500/30">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="licenses" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Licenses
          </TabsTrigger>
          <TabsTrigger value="downloads" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Downloads
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Tutorials
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UID Activation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Activate New UID</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-400 mb-2">Game UID</label>
                  <Input
                    type="text"
                    placeholder="Enter your Game UID"
                    value={activationForm.gameUID}
                    onChange={(e) => setActivationForm({ ...activationForm, gameUID: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-400 mb-2">License Key</label>
                  <Input
                    type="text"
                    placeholder="Enter your license key"
                    value={activationForm.licenseKey}
                    onChange={(e) => setActivationForm({ ...activationForm, licenseKey: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleActivateUID}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Activate UID
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCheckUID}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Check UID
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Active UIDs Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Your Active UIDs</h3>
              {licenses.length > 0 ? (
                <div className="space-y-3">
                  {licenses.map((license) => (
                    <div key={license.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-purple-400 font-semibold">{license.gameUID}</p>
                          <p className="text-gray-400 text-sm font-mono">{license.licenseKey}</p>
                        </div>
                        <Badge className={getStatusColor(license.status)}>
                          {license.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">
                          {license.licenseType === 'LIFETIME' ? 'Lifetime' : `Expires: ${license.expireDate ? new Date(license.expireDate).toLocaleDateString() : 'N/A'}`}
                        </span>
                        <span className="text-gray-500">
                          Activated: {license.activatedAt ? new Date(license.activatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Key className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No active UIDs found. Activate a UID to get started.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[
              { label: 'Active Licenses', value: licenses.filter(l => l.status === 'ACTIVE').length.toString(), icon: Key, color: 'text-purple-400' },
              { label: 'Lifetime Licenses', value: licenses.filter(l => l.licenseType === 'LIFETIME').length.toString(), icon: Shield, color: 'text-green-400' },
              { label: 'Remaining Days', value: licenses.find(l => l.licenseType !== 'LIFETIME' && l.status === 'ACTIVE')?.remainingDays?.toString() || '0', icon: Calendar, color: 'text-yellow-400' },
              { label: 'Total UIDs', value: licenses.length.toString(), icon: Gamepad2, color: 'text-pink-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                    Active
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Discord Server */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 mt-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Join Our Community</h3>
            <p className="text-gray-400 mb-4">
              Get support, updates, and connect with other users in our Discord server.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold"
              onClick={() => {
                if (discordLink) {
                  window.open(discordLink, '_blank')
                  toast.success('Opening Discord server')
                } else {
                  toast.error('Discord link not available')
                }
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Join Discord Server
            </Button>
          </motion.div>
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses">
          <Card className="bg-gray-900 border-purple-500/30">
            <CardContent className="p-0">
              {licenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-purple-400">Game UID</TableHead>
                      <TableHead className="text-purple-400">License Key</TableHead>
                      <TableHead className="text-purple-400">Activated On</TableHead>
                      <TableHead className="text-purple-400">Expire Date</TableHead>
                      <TableHead className="text-purple-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenses.map((license) => (
                      <TableRow key={license.id} className="border-gray-700">
                        <TableCell className="font-mono">{license.gameUID}</TableCell>
                        <TableCell className="font-mono text-sm">{license.licenseKey}</TableCell>
                        <TableCell>
                          {license.activatedAt ? new Date(license.activatedAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {license.expireDate ? new Date(license.expireDate).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={getStatusColor(license.status)}>
                              {getStatusIcon(license.status)}
                            </div>
                            <Badge className={getStatusColor(license.status)}>
                              {license.status}
                            </Badge>
                            <Badge className={license.licenseType === 'LIFETIME' ? 'text-green-400' : 'text-blue-400'}>
                              {license.licenseType}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Key className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No licenses found. Activate a UID to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads">
          <div className="space-y-4">
            {downloads.length > 0 ? downloads.map((download) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">{download.fileName}</h3>
                    <p className="text-gray-400 mb-2">{download.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Version: {download.version}</span>
                      <span>Size: {download.fileSize}</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    onClick={() => {
                      if (download.downloadLink) {
                        window.open(download.downloadLink, '_blank')
                        toast.success(`Downloading ${download.fileName}`)
                      } else {
                        toast.error('Download link not available')
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                <Download className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p>No downloads available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.length > 0 ? tutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 border border-purple-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  {tutorial.thumbnail ? (
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video className="w-12 h-12 text-purple-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-purple-400 mb-2">{tutorial.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tutorial.description}</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    onClick={() => {
                      if (tutorial.youtubeLink) {
                        window.open(tutorial.youtubeLink, '_blank')
                        toast.success(`Opening tutorial: ${tutorial.title}`)
                      } else {
                        toast.error('Tutorial link not available')
                      }
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p>No tutorials available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}