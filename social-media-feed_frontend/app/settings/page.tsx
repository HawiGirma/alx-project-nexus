"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedFeedHeader } from "@/components/animated-feed-header";
import { AnimatedMobileNavigation } from "@/components/animated-mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Shield,
  Palette,
  Globe,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    username: user?.username || "johndoe",
    email: user?.email || "john@example.com",
    bio: "Software developer passionate about creating amazing user experiences.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    allowMentions: true,
    allowTags: true,
  });


  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    language: "en",
    fontSize: "medium",
    compactMode: false,
    showTimestamps: true,
    showAvatars: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved.",
    });
  };


  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description:
        "We've sent you an email with instructions to delete your account.",
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "We'll email you when your data is ready for download.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Sign in to access settings
            </h2>
            <p className="text-muted-foreground">
              You need to be signed in to manage your account settings.
            </p>
          </motion.div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <AnimatedFeedHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            website: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Security Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleChangePassword} variant="outline">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Who can see your profile
                        </p>
                      </div>
                      <Badge
                        variant={
                          privacySettings.profileVisibility === "public"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {privacySettings.profileVisibility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your email on your profile
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.showEmail}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showEmail: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Location</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your location on your profile
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.showLocation}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showLocation: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Direct Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Let other users send you messages
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.allowMessages}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            allowMessages: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Mentions</Label>
                        <p className="text-sm text-muted-foreground">
                          Let other users mention you in posts
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.allowMentions}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            allowMentions: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Tags</Label>
                        <p className="text-sm text-muted-foreground">
                          Let other users tag you in photos
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.allowTags}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            allowTags: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSavePrivacy}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </p>
                      </div>
                      <Badge variant="outline">
                        {appearanceSettings.theme}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">
                          Interface language
                        </p>
                      </div>
                      <Badge variant="outline">
                        {appearanceSettings.language}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Font Size</Label>
                        <p className="text-sm text-muted-foreground">
                          Text size preference
                        </p>
                      </div>
                      <Badge variant="outline">
                        {appearanceSettings.fontSize}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use less space for content
                        </p>
                      </div>
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            compactMode: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Timestamps</Label>
                        <p className="text-sm text-muted-foreground">
                          Display relative timestamps
                        </p>
                      </div>
                      <Switch
                        checked={appearanceSettings.showTimestamps}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            showTimestamps: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Avatars</Label>
                        <p className="text-sm text-muted-foreground">
                          Display user profile pictures
                        </p>
                      </div>
                      <Switch
                        checked={appearanceSettings.showAvatars}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            showAvatars: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveAppearance}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Appearance Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your data
                  </p>
                </div>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <AnimatedMobileNavigation />
    </div>
  );
}





