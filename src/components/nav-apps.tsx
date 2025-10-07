"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface App {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

export function NavApps({
  apps,
}: {
  apps: App[]
}) {
  return (
    <>
      {/* Expanded view - show section header and full list */}
      <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
        <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
          Platform
        </div>
        <SidebarMenu>
          {apps.map((app) => (
            <SidebarMenuItem key={app.title}>
              <SidebarMenuButton
                asChild
                className="h-8 px-2 hover:bg-accent/50 rounded-md transition-colors"
              >
                <Link href={app.url} className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-4 text-sidebar-foreground">
                    <app.icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-sidebar-foreground">
                    {app.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>

      {/* Collapsed view - show just icons */}
      <div className="px-2 py-2 group-data-[collapsible=icon]:flex hidden">
        <SidebarMenu>
          {apps.map((app) => (
            <SidebarMenuItem key={app.title}>
              <SidebarMenuButton
                asChild
                tooltip={app.title}
                className="h-8 w-8 p-0 hover:bg-accent/50 rounded-md transition-colors"
              >
                <Link href={app.url} className="flex items-center justify-center">
                  <div className="flex items-center justify-center size-4 text-sidebar-foreground">
                    <app.icon className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </>
  )
}