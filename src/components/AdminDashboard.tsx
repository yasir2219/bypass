"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Shield,
  Users,
  Key,
  Download,
  Video,
  Settings,
  Gamepad2,
  Plus,
  Trash2,
  Edit,
  Ban,
  Pause,
  Play,
  ExternalLink,
  Calendar,
  Activity,
  Save,
  Upload,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalLicenses: number;
  activeLicenses: number;
  expiredLicenses: number;
  bannedUids: number;
  pausedUids: number;
}

interface License {
  id: string;
  licenseKey: string;
  expireDate: string;
  maxUsage: number;
  usedCount: number;
  status: string;
  licenseType?: string;
  maxUsers?: number;
}

interface User {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
  role: string;
  createdAt: string;
  uids: any[];
}

interface Uid {
  id: string;
  userId: string;
  gameUID: string;
  licenseKey: string;
  expireDate: string;
  status: string;
  user: User;
  license: License;
}

interface DownloadItem {
  id: string;
  fileName: string;
  description: string;
  version: string;
  fileSize: string;
  downloadLink: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail: string;
}

interface SettingsData {
  discordServerLink: string;
  adminPassword?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLicenses: 0,
    activeLicenses: 0,
    expiredLicenses: 0,
    bannedUids: 0,
    pausedUids: 0,
  });
  const [licenses, setLicenses] = useState<License[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [uids, setUids] = useState<Uid[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    discordServerLink: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form states
  const [licenseForm, setLicenseForm] = useState({
    expireDate: "",
    maxUsage: "",
    licenseType: "STANDARD",
    maxUsers: "5",
  });

  const [downloadForm, setDownloadForm] = useState({
    fileName: "",
    description: "",
    version: "",
    fileSize: "",
    downloadLink: "",
  });

  const [tutorialForm, setTutorialForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    thumbnail: "",
  });

  const [settingsForm, setSettingsForm] = useState({
    discordServerLink: "",
    adminPassword: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/dashboard");
      const statsData = await statsResponse.json();
      if (statsData.stats) {
        setStats(statsData.stats);
      }

      // Fetch licenses
      const licensesResponse = await fetch("/api/licenses");
      const licensesData = await licensesResponse.json();
      if (licensesData.licenses) {
        setLicenses(licensesData.licenses);
      }

      // Fetch users
      const usersResponse = await fetch("/api/users");
      const usersData = await usersResponse.json();
      if (usersData.users) {
        setUsers(usersData.users);
      }

      // Fetch UIDs
      const uidsResponse = await fetch("/api/uids");
      const uidsData = await uidsResponse.json();
      if (uidsData.uids) {
        setUids(uidsData.uids);
      }

      // Fetch downloads
      const downloadsResponse = await fetch("/api/downloads");
      const downloadsData = await downloadsResponse.json();
      if (downloadsData.downloads) {
        setDownloads(downloadsData.downloads);
      }

      // Fetch tutorials
      const tutorialsResponse = await fetch("/api/tutorials");
      const tutorialsData = await tutorialsResponse.json();
      if (tutorialsData.tutorials) {
        setTutorials(tutorialsData.tutorials);
      }

      // Fetch settings
      const settingsResponse = await fetch("/api/settings");
      const settingsData = await settingsResponse.json();
      if (settingsData.settings) {
        setSettings(settingsData.settings);
        setSettingsForm({
          discordServerLink: settingsData.settings.discordServerLink || "",
          adminPassword: "",
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLicense = async () => {
    if (!licenseForm.expireDate || !licenseForm.maxUsage) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(licenseForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "License created successfully!");
        setLicenseForm({
          expireDate: "",
          maxUsage: "",
          licenseType: "STANDARD",
          maxUsers: "5",
        });
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to create license");
      }
    } catch (error) {
      console.error("Error creating license:", error);
      toast.error("Failed to create license");
    }
  };

  const generateLicenseKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments: string[] = [];
    for (let i = 0; i < 5; i++) {
      let segment: string = "";
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join("-");
  };

  const handleAddDownload = async () => {
    if (!downloadForm.fileName || !downloadForm.downloadLink) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(downloadForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Download added successfully!");
        setDownloadForm({
          fileName: "",
          description: "",
          version: "",
          fileSize: "",
          downloadLink: "",
        });
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to add download");
      }
    } catch (error) {
      console.error("Error adding download:", error);
      toast.error("Failed to add download");
    }
  };

  const handleAddTutorial = async () => {
    if (!tutorialForm.title || !tutorialForm.youtubeLink) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tutorialForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Tutorial added successfully!");
        setTutorialForm({
          title: "",
          description: "",
          youtubeLink: "",
          thumbnail: "",
        });
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to add tutorial");
      }
    } catch (error) {
      console.error("Error adding tutorial:", error);
      toast.error("Failed to add tutorial");
    }
  };

  const handleUpdateSettings = async () => {
    try {
      // Update Discord link
      if (settingsForm.discordServerLink) {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discordServerLink: settingsForm.discordServerLink,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Discord server link updated!");
          setSettings((prev) => ({
            ...prev,
            discordServerLink: settingsForm.discordServerLink,
          }));
        } else {
          toast.error(data.error || "Failed to update Discord link");
        }
      }

      // Update password
      if (settingsForm.currentPassword && settingsForm.newPassword) {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: settingsForm.currentPassword,
            newPassword: settingsForm.newPassword,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Admin password updated successfully!");
          setSettingsForm((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
          }));
        } else {
          toast.error(data.error || "Failed to update password");
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const handleUpdateUidStatus = async (uidId: string, status: string) => {
    try {
      const response = await fetch("/api/uids", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uidId, status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`UID ${status.toLowerCase()} successfully!`);
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to update UID");
      }
    } catch (error) {
      console.error("Error updating UID:", error);
      toast.error("Failed to update UID");
    }
  };

  const handleDeleteUid = async (uidId: string) => {
    try {
      const response = await fetch(`/api/uids?uidId=${uidId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("UID deleted successfully!");
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to delete UID");
      }
    } catch (error) {
      console.error("Error deleting UID:", error);
      toast.error("Failed to delete UID");
    }
  };

  const handleUpdateLicenseStatus = async (
    licenseId: string,
    status: string
  ) => {
    try {
      const response = await fetch("/api/licenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId, status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`License ${status.toLowerCase()} successfully!`);
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to update license");
      }
    } catch (error) {
      console.error("Error updating license:", error);
      toast.error("Failed to update license");
    }
  };

  const handleDeleteLicense = async (licenseId: string) => {
    try {
      const response = await fetch(`/api/licenses?licenseId=${licenseId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("License deleted successfully!");
        fetchDashboardData();
      } else {
        toast.error(data.error || "Failed to delete license");
      }
    } catch (error) {
      console.error("Error deleting license:", error);
      toast.error("Failed to delete license");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400";
      case "BANNED":
        return "text-red-400";
      case "PAUSED":
        return "text-yellow-400";
      case "EXPIRED":
        return "text-gray-400";
      case "USED_UP":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          console.log("Tab changed to:", value);
          setActiveTab(value);
        }}
        className="space-y-6"
      >
                {/* --- সমস্যা সমাধান করা হরাইজন্টাল স্ক্রল --- */}
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList 
            className="
              flex 
              items-center 
              flex-nowrap              // ট্যাবগুলোকে নতুন লাইনে যেতে বাধা দেয়
              gap-2                     // ট্যাবগুলোর মধ্যে ফাঁকা জায়গা
              bg-gray-900 
              border border-cyan-500/30 
              p-2                       // এখন এই প্যাডিং সমস্যা তৈরি করবে না
              min-w-max                // গুরুত্বপূর্ণ: ট্যাবগুলোর মোট প্রস্থ নিশ্চিত করে
            "
          >
            <TabsTrigger
              value="dashboard"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="licenses"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Licenses
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="downloads"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Downloads
            </TabsTrigger>
            <TabsTrigger
              value="tutorials"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Tutorials
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="whitespace-nowrap data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex-shrink-0"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>
        {/* --- স্ক্রল শেষ --- */}

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-gray-400">Manage your UID BYPASS system</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers.toString(),
                icon: Users,
                color: "text-cyan-400",
              },
              {
                label: "Total Licenses",
                value: stats.totalLicenses.toString(),
                icon: Key,
                color: "text-purple-400",
              },
              {
                label: "Active Licenses",
                value: stats.activeLicenses.toString(),
                icon: Shield,
                color: "text-green-400",
              },
              {
                label: "Banned UID",
                value: stats.bannedUids.toString(),
                icon: Users,
                color: "text-red-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={`stat-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <Badge
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-400"
                  >
                    Live
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {uids.length > 0 ? (
                uids.slice(0, 5).map((uid) => (
                  <div
                    key={`activity-${uid.id}`}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">
                        {uid.user?.username || "Unknown User"} registered UID{" "}
                        {uid.gameUID}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">2 min ago</span>
                  </div>
                ))
              ) : (
                <div
                  key="no-activity"
                  className="text-center text-gray-400 py-4"
                >
                  No recent activity
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-cyan-400">
                License Management
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create License
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-cyan-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400">
                      Create New License
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Generate a new license key with expiration and usage
                      limits.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="licenseType" className="text-cyan-400">
                        License Type
                      </Label>
                      <Select
                        value={licenseForm.licenseType}
                        onValueChange={(value) =>
                          setLicenseForm({ ...licenseForm, licenseType: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STANDARD">Standard</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                          <SelectItem value="LIFETIME">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expireDate" className="text-cyan-400">
                        Expire Date
                      </Label>
                      <Input
                        id="expireDate"
                        type="date"
                        value={licenseForm.expireDate}
                        onChange={(e) =>
                          setLicenseForm({
                            ...licenseForm,
                            expireDate: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxUsage" className="text-cyan-400">
                        Max Usage Count
                      </Label>
                      <Input
                        id="maxUsage"
                        type="number"
                        placeholder="100"
                        value={licenseForm.maxUsage}
                        onChange={(e) =>
                          setLicenseForm({
                            ...licenseForm,
                            maxUsage: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxUsers" className="text-cyan-400">
                        Max Users
                      </Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        placeholder="5"
                        value={licenseForm.maxUsers}
                        onChange={(e) =>
                          setLicenseForm({
                            ...licenseForm,
                            maxUsers: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <Button onClick={handleCreateLicense} className="w-full">
                      Generate License
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-900 border-cyan-500/30">
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-900 z-10 border-b border-gray-700">
                      <TableRow>
                        <TableHead className="text-cyan-400">
                          License Key
                        </TableHead>
                        <TableHead className="text-cyan-400">Type</TableHead>
                        <TableHead className="text-cyan-400">
                          Expire Date
                        </TableHead>
                        <TableHead className="text-cyan-400">Usage</TableHead>
                        <TableHead className="text-cyan-400">Status</TableHead>
                        <TableHead className="text-cyan-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licenses.length > 0 ? (
                        licenses.map((license) => (
                          <TableRow key={license.id} className="border-gray-700">
                            <TableCell className="font-mono text-sm">
                              {license.licenseKey}
                            </TableCell>
                            <TableCell>
                              {license.licenseType || "STANDARD"}
                            </TableCell>
                            <TableCell>
                              {new Date(license.expireDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {license.usedCount}/{license.maxUsage}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(license.status)}>
                                {license.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {license.status === "ACTIVE" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateLicenseStatus(
                                        license.id,
                                        "PAUSED"
                                      )
                                    }
                                    className="border-yellow-500 text-yellow-400 hover:border-yellow-400"
                                  >
                                    <Pause className="w-3 h-3" />
                                  </Button>
                                )}
                                {license.status === "PAUSED" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateLicenseStatus(
                                        license.id,
                                        "ACTIVE"
                                      )
                                    }
                                    className="border-green-500 text-green-400 hover:border-green-400"
                                  >
                                    <Play className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteLicense(license.id)}
                                  className="border-red-500 text-red-400 hover:border-red-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow key="no-licenses">
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-400 py-4"
                          >
                            No licenses found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-gray-900 border-cyan-500/30">
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-900 z-10 border-b border-gray-700">
                    <TableRow>
                      <TableHead className="text-cyan-400">Username</TableHead>
                      <TableHead className="text-cyan-400">Discord ID</TableHead>
                      <TableHead className="text-cyan-400">Game UID</TableHead>
                      <TableHead className="text-cyan-400">License</TableHead>
                      <TableHead className="text-cyan-400">Status</TableHead>
                      <TableHead className="text-cyan-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uids.length > 0 ? (
                      uids.map((uid) => (
                        <TableRow key={uid.id} className="border-gray-700">
                          <TableCell>{uid.user?.username || "N/A"}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {uid.user?.discordId || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono">
                            {uid.gameUID}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {uid.licenseKey}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(uid.status)}>
                              {uid.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {uid.status === "ACTIVE" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateUidStatus(uid.id, "PAUSED")
                                  }
                                  className="border-yellow-500 text-yellow-400 hover:border-yellow-400"
                                >
                                  <Pause className="w-3 h-3" />
                                </Button>
                              )}
                              {uid.status === "PAUSED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateUidStatus(uid.id, "ACTIVE")
                                  }
                                  className="border-green-500 text-green-400 hover:border-green-400"
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateUidStatus(uid.id, "BANNED")
                                }
                                className="border-red-500 text-red-400 hover:border-red-400"
                              >
                                <Ban className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUid(uid.id)}
                                className="border-gray-500 text-gray-400 hover:border-gray-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key="no-users">
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-400 py-4"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-cyan-400">
                Download Management
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Download
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-cyan-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400">
                      Add Download Item
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a new downloadable file for users.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fileName" className="text-cyan-400">
                        File Name
                      </Label>
                      <Input
                        id="fileName"
                        placeholder="UID_Bypass_v2.1.rar"
                        value={downloadForm.fileName}
                        onChange={(e) =>
                          setDownloadForm({
                            ...downloadForm,
                            fileName: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-cyan-400">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Latest version with enhanced features"
                        value={downloadForm.description}
                        onChange={(e) =>
                          setDownloadForm({
                            ...downloadForm,
                            description: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="version" className="text-cyan-400">
                        Version
                      </Label>
                      <Input
                        id="version"
                        placeholder="2.1"
                        value={downloadForm.version}
                        onChange={(e) =>
                          setDownloadForm({
                            ...downloadForm,
                            version: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileSize" className="text-cyan-400">
                        File Size
                      </Label>
                      <Input
                        id="fileSize"
                        placeholder="15.2 MB"
                        value={downloadForm.fileSize}
                        onChange={(e) =>
                          setDownloadForm({
                            ...downloadForm,
                            fileSize: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="downloadLink" className="text-cyan-400">
                        Download Link
                      </Label>
                      <Input
                        id="downloadLink"
                        placeholder="https://example.com/download/file.rar"
                        value={downloadForm.downloadLink}
                        onChange={(e) =>
                          setDownloadForm({
                            ...downloadForm,
                            downloadLink: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <Button onClick={handleAddDownload} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Add Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {downloads.length > 0 ? (
                downloads.map((download) => (
                  <motion.div
                    key={download.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                          {download.fileName}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {download.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Version: {download.version}</span>
                          <span>Size: {download.fileSize}</span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  key="no-downloads"
                  className="text-center text-gray-400 py-8"
                >
                  <Download className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No downloads available</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-cyan-400">
                Tutorial Management
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tutorial
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-cyan-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400">
                      Add YouTube Tutorial
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a new YouTube video tutorial for users.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-cyan-400">
                        Video Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="How to Activate UID Bypass"
                        value={tutorialForm.title}
                        onChange={(e) =>
                          setTutorialForm({
                            ...tutorialForm,
                            title: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-cyan-400">
                        Video Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Complete step by step guide for UID activation"
                        value={tutorialForm.description}
                        onChange={(e) =>
                          setTutorialForm({
                            ...tutorialForm,
                            description: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtubeLink" className="text-cyan-400">
                        YouTube Link
                      </Label>
                      <Input
                        id="youtubeLink"
                        placeholder="https://youtube.com/watch?v=example"
                        value={tutorialForm.youtubeLink}
                        onChange={(e) =>
                          setTutorialForm({
                            ...tutorialForm,
                            youtubeLink: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thumbnail" className="text-cyan-400">
                        Thumbnail URL
                      </Label>
                      <Input
                        id="thumbnail"
                        placeholder="/thumbnail.jpg"
                        value={tutorialForm.thumbnail}
                        onChange={(e) =>
                          setTutorialForm({
                            ...tutorialForm,
                            thumbnail: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-cyan-500/30 text-white"
                      />
                    </div>
                    <Button onClick={handleAddTutorial} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Add Tutorial
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.length > 0 ? (
                tutorials.map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      {tutorial.thumbnail ? (
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Video className="w-12 h-12 text-cyan-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-cyan-400 mb-2">
                        {tutorial.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {tutorial.description}
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                        onClick={() =>
                          window.open(tutorial.youtubeLink, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch Tutorial
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  key="no-tutorials"
                  className="col-span-full text-center text-gray-400 py-8"
                >
                  <Video className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No tutorials available</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-cyan-400">
              System Settings
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Discord Server Settings */}
              <Card className="bg-gray-900 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">
                    Discord Server
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your Discord server invite link
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="discordLink" className="text-cyan-400">
                      Discord Server Link
                    </Label>
                    <Input
                      id="discordLink"
                      placeholder="https://discord.gg/uidbypass"
                      value={settingsForm.discordServerLink}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          discordServerLink: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-cyan-500/30 text-white"
                    />
                  </div>
                  <Button onClick={handleUpdateSettings} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Update Discord Link
                  </Button>
                </CardContent>
              </Card>

              {/* Admin Password Settings */}
              <Card className="bg-gray-900 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">
                    Admin Password
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Change your admin account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-cyan-400">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      value={settingsForm.currentPassword}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-cyan-400">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={settingsForm.newPassword}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-cyan-500/30 text-white"
                    />
                  </div>
                  <Button onClick={handleUpdateSettings} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Settings Display */}
            <Card className="bg-gray-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">
                  Current Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    key="discord-setting"
                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
                  >
                    <span className="text-gray-400">Discord Server Link:</span>
                    <span className="text-cyan-400">
                      {settings.discordServerLink || "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}