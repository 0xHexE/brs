'use client';

import { ChevronRight, MessageCircle } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChatContent } from '@/features/chat/components/chat-content';
import { cn } from '@/lib/utils';

export function ChatSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="border-l border-border/40">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-12 w-12 rounded-l-lg transition-all duration-200',
            isOpen && 'bg-muted',
          )}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Toggle chat</span>
        </Button>
      </div>

      <div
        className={cn(
          'transition-all duration-300 ease-in-out border-l border-chatbar-border/40 bg-chatbar backdrop-blur-sm',
          isOpen
            ? 'w-[400px] md:w-[400px] lg:w-[600px] opacity-100'
            : 'w-0 opacity-0 overflow-hidden',
        )}
      >
        <div className="relative h-screen">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 h-8 w-8 hover:bg-muted/50"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
          <ChatContent />
        </div>
      </div>
    </div>
  );
}
