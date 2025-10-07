'use client';

import { OrganizationSwitcher, UserButton } from '@daveyplate/better-auth-ui';
import {
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  GraduationCap,
  Library,
} from 'lucide-react';
import type * as React from 'react';
import { NavApps } from '@/components/nav-apps';
import { NavChats } from '@/components/nav-chats';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthUser } from '@/hooks/use-auth-user';

// Student Management System data
const data = {
  teams: [
    {
      name: 'Student Portal',
      logo: GraduationCap,
      plan: 'Active',
    },
  ],
  apps: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Award,
      color: 'text-indigo-500',
      description: 'Student dashboard with academic overview',
    },
    {
      title: 'Courses',
      url: '/courses',
      icon: BookOpen,
      color: 'text-blue-500',
      description: 'View enrolled courses and course materials',
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: Calendar,
      color: 'text-green-500',
      description: 'Academic calendar and class schedules',
    },
    {
      title: 'Grades',
      url: '/grades',
      icon: Award,
      color: 'text-purple-500',
      description: 'Track grades and academic performance',
    },
    {
      title: 'Assignments',
      url: '/assignments',
      icon: FileText,
      color: 'text-orange-500',
      description: 'Submit assignments and view deadlines',
    },
    {
      title: 'Attendance',
      url: '/attendance',
      icon: CheckSquare,
      color: 'text-red-500',
      description: 'Track class attendance records',
    },
    {
      title: 'Library',
      url: '/library',
      icon: Library,
      color: 'text-cyan-500',
      description: 'Access digital library resources',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <OrganizationSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavApps apps={data.apps} />
          <NavChats />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <OrganizationSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavApps apps={data.apps} />
          <NavChats />
        </SidebarContent>
        <SidebarFooter>
          <div className="text-muted-foreground text-sm p-2">Not logged in</div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          classNames={{
            trigger: {
              base: 'bg-transparent hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground',
            },
          }}
          hidePersonal
        />
      </SidebarHeader>
      <SidebarContent>
        <NavApps apps={data.apps} />
        <NavChats />
      </SidebarContent>
      <SidebarFooter>
        <UserButton
          side="right"
          classNames={{
            trigger: {
              base: 'bg-transparent hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground',
            },
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
