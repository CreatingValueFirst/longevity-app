'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Activity, Plus, Brain, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Track', href: '/dashboard/protocols', icon: Activity },
  { name: 'Add', href: '/dashboard/add', icon: Plus, isAction: true },
  { name: 'Insights', href: '/dashboard/insights', icon: Brain },
  { name: 'Profile', href: '/dashboard/settings', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-[70px] px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          if (item.isAction) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="touch-manipulation tap-highlight-none"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="flex items-center justify-center w-14 h-14 -mt-5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:shadow-md"
                >
                  <item.icon className="h-7 w-7" strokeWidth={2.5} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="touch-manipulation tap-highlight-none"
            >
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[64px] min-h-[56px] justify-center transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-foreground active:bg-muted/50'
                )}
              >
                {/* Active background indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                <item.icon className={cn(
                  'h-6 w-6 relative z-10 transition-transform duration-200',
                  isActive && 'scale-110'
                )} strokeWidth={isActive ? 2.5 : 2} />

                <span className={cn(
                  'text-[11px] font-medium relative z-10 transition-all duration-200',
                  isActive && 'font-semibold'
                )}>
                  {item.name}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
