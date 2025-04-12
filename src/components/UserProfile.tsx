
import React, { useState } from 'react';
import { User, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UserProfileProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  username = '学习者', 
  email = 'learner@example.com',
  avatarUrl = '' 
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // 实际应用中这里会更改全局主题
    toast({
      title: `已切换到${isDarkMode ? '浅色' : '深色'}主题`,
      description: "主题设置已更新",
      variant: "default",
    });
  };

  const handleLogout = () => {
    toast({
      title: "已登出",
      description: "您已成功退出登录",
      variant: "default",
    });
  };

  return (
    <>
      <Card className="border shadow-md">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-2 text-learning-primary" />
            个人资料
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{username}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-blue-500" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                <Label htmlFor="theme-toggle">
                  {isDarkMode ? '深色模式' : '浅色模式'}
                </Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>用户设置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <input
                id="username"
                className="w-full p-2 border rounded"
                defaultValue={username}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded"
                defaultValue={email}
              />
            </div>
            <div className="space-y-2">
              <Label>主题设置</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="theme-toggle-dialog"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
                <span>{isDarkMode ? '深色模式' : '浅色模式'}</span>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => {
                  toast({
                    title: "设置已保存",
                    description: "您的个人设置已更新",
                    variant: "default",
                  });
                  setIsDialogOpen(false);
                }}
                className="bg-learning-primary hover:bg-learning-secondary"
              >
                保存设置
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
