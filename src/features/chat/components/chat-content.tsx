'use client';

import { useChat } from '@ai-sdk/react';
import { CopyIcon, GlobeIcon, RefreshCcwIcon, CloudIcon, CalendarIcon, BookOpenIcon } from 'lucide-react';
import { Fragment, useState, ReactElement } from 'react';
import { Action, Actions } from '@/components/ai-elements/actions';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Response } from '@/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { WeatherTool } from '@/components/weather';
import { CourseCalendarTool } from '@/components/course-calendar';
import { CourseListTool } from '@/components/course-list';
import type { ToolUIPart } from 'ai';

const models = [
  {
    name: 'GLM-4.6 Turbo',
    value: 'zai-org/GLM-4.6-turbo',
  },
  {
    name: 'DeepSeek V3.2',
    value: 'deepseek-ai/DeepSeek-V3.2-Exp',
  },
];

const suggestions = [
  'How do I check my course schedule?',
  'What are the prerequisites for CS301?',
  'When is the tuition payment deadline?',
  'How do I apply for financial aid?',
  'Where can I find my academic transcript?',
  'What tutoring services are available?',
];


export function ChatContent() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>('zai-org/GLM-4.6-turbo');
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage: sendAIMessage, status } = useChat();

  const handleSuggestionClick = (suggestion: string) => {
    sendAIMessage({ text: suggestion });
  };

  const handleWeatherClick = () => {
    sendAIMessage({ text: 'Get weather data for San Francisco in fahrenheit' });
  };

  const handleCalendarClick = () => {
    sendAIMessage({ text: 'Get my course calendar for this month' });
  };

  const handleCoursesClick = () => {
    sendAIMessage({ text: 'Show me all available courses' });
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendAIMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      },
    );
    setInput('');
  };

  const regenerate = () => {
    // Placeholder for regenerate functionality
    console.log('Regenerate message');
  };

  return (
    <div className="flex flex-col h-full max-h-full w-full rounded-l-2xl border border-chatbar-border backdrop-blur-sm text-chatbar-foreground relative">
      <div className="flex flex-col flex-1 min-h-0">
        <Conversation className="flex-1 min-h-0">
          <ConversationContent className="h-full">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' &&
                  message.parts.filter((part) => part.type === 'source-url')
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === 'source-url')
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' &&
                            i === message.parts.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </Fragment>
                      );
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === 'streaming' &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    case 'tool-fetch_weather_data': {
                      const toolPart = part as any;
                      return (
                        <WeatherTool
                          key={`${message.id}-${i}`}
                          toolPart={toolPart}
                        />
                      );
                    }
                    case 'tool-get_course_calendar': {
                      const toolPart = part as any;
                      return (
                        <CourseCalendarTool
                          key={`${message.id}-${i}`}
                          toolPart={toolPart}
                        />
                      );
                    }
                    case 'tool-list_courses': {
                      const toolPart = part as any;
                      return (
                        <CourseListTool
                          key={`${message.id}-${i}`}
                          toolPart={toolPart}
                        />
                      );
                    }
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {messages.length === 0 && (
          <div className="flex-shrink-0 p-3 pb-0 max-w-5xl mx-auto">
            <Suggestions className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
          </div>
        )}
      </div>
      <div className="mt-2 mb-4 w-full max-w-2xl mx-auto relative bg-white rounded-lg">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? 'default' : 'ghost'}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputButton
                variant="ghost"
                onClick={handleWeatherClick}
                disabled={status !== 'ready'}
              >
                <CloudIcon size={16} />
                <span>Weather</span>
              </PromptInputButton>
              <PromptInputButton
                variant="ghost"
                onClick={handleCalendarClick}
                disabled={status !== 'ready'}
              >
                <CalendarIcon size={16} />
                <span>Calendar</span>
              </PromptInputButton>
              <PromptInputButton
                variant="ghost"
                onClick={handleCoursesClick}
                disabled={status !== 'ready'}
              >
                <BookOpenIcon size={16} />
                <span>Courses</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
