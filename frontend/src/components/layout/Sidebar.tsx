'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Moon,
  Activity,
  TestTube,
  ClipboardList,
  Settings,
  ChevronLeft,
  Timer,
  Brain,
  PlusCircle,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sleep', href: '/dashboard/sleep', icon: Moon },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Fasting', href: '/dashboard/fasting', icon: Timer },
  { name: 'Biomarkers', href: '/dashboard/biomarkers', icon: TestTube },
  { name: 'Protocols', href: '/dashboard/protocols', icon: ClipboardList },
  { name: 'Insights', href: '/dashboard/insights', icon: Brain },
];

const secondaryNav = [
  { name: 'Add Data', href: '/dashboard/add', icon: PlusCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 h-16">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <Heart className="h-6 w-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-lg"
          >
            Longevity
          </motion.span>
        )}
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                {!isCollapsed && (
                  <span className={isActive ? 'font-medium' : ''}>{item.name}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Secondary Navigation */}
      <div className="p-3 space-y-1">
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              isCollapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>
    </aside>
  );
}
