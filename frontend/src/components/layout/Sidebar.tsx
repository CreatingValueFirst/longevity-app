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
  Newspaper,
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
  { name: 'News', href: '/dashboard/news', icon: Newspaper },
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
        'relative flex flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/50 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 h-16">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-premium-sm">
          <Heart className="h-6 w-6 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-lg gradient-text"
          >
            Longevity
          </motion.span>
        )}
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scroll-momentum">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 min-h-[48px] touch-manipulation',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {!isCollapsed && (
                  <span className={cn('truncate', isActive ? 'font-medium' : '')}>{item.name}</span>
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
                  'w-full justify-start gap-3 min-h-[48px] touch-manipulation',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
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
