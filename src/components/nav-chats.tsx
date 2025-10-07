'use client';

import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
}

const aiChats: Chat[] = [
  {
    id: '1',
    title: 'CS Study Helper',
    lastMessage: 'Can you explain recursion?',
    time: '2m ago',
  },
  {
    id: '2',
    title: 'Math Tutor',
    lastMessage: 'Show me integration steps',
    time: '15m ago',
  },
  {
    id: '3',
    title: 'Essay Writer',
    lastMessage: 'Review my thesis statement',
    time: '1h ago',
  },
  {
    id: '4',
    title: 'Science Lab Assistant',
    lastMessage: 'Chemistry formulas help',
    time: '3h ago',
  },
  {
    id: '5',
    title: 'Language Practice',
    lastMessage: 'Practice Spanish conversation',
    time: '1d ago',
  },
];

export function NavChats() {
  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulate loading chats
    const timer = setTimeout(() => {
      setChats(aiChats);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>AI Chats</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Since this is static data
            <SidebarMenuItem key={i}>
              <div className="flex items-center gap-3 p-2">
                <div className="size-4 rounded bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>AI Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild className="relative">
              <a href={`/chat/${chat.id}`}>
                <span className="text-sm font-medium">{chat.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <span>View Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Share Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="/chat/new">
              <Plus />
              <span>New Chat</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
