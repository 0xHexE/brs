'use client';

import { useParams } from 'next/navigation';
import { ChatContent } from '@/features/chat/components/chat-content';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chat_id as string;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Chat Content */}
      <div className="flex-1 min-h-0 bg-transparent">
        <ChatContent />
      </div>
    </div>
  );
}