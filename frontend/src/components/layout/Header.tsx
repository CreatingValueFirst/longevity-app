'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun, User, LogOut, Settings, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const profile = useUserStore((state) => state.profile);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationCount] = useState(3);

  // Handle hydration mismatch - only show theme icon after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const initials = profile?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80',
        className
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Mobile Menu */}
      <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="touch-manipulation" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] safe-area-left">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search metrics, protocols..."
            className="pl-10 h-10 bg-muted/30 border-muted/50 focus:bg-background focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Mobile search button */}
      <div className="flex-1 md:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="md:hidden touch-manipulation" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative overflow-hidden group touch-manipulation"
          aria-label="Toggle theme"
        >
          <div className="transition-transform duration-300 group-hover:rotate-12">
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )
            ) : (
              <div className="h-5 w-5" /> // Placeholder to prevent layout shift
            )}
          </div>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative touch-manipulation" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              variant="destructive"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 touch-manipulation" aria-label="User menu">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                <AvatarImage src="" alt={profile?.fullName || 'User'} />
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-w-[calc(100vw-1rem)]" sideOffset={8}>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium truncate">{profile?.fullName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-3 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearProfile} className="text-destructive py-3 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
