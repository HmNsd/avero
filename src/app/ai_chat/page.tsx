'use client';

import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { CopyIcon, GlobeIcon, RefreshCcwIcon, ArrowLeftIcon, CheckIcon } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import { Loader } from '@/components/ai-elements/loader';
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSelectContent,
  PromptInputSelectItem,
} from '@/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';

const models = [
  { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp' },
  { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
];

export default function ChatBotDemo() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { messages, sendMessage, status, regenerate, stop } = useChat();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = (message: { text: string; files?: any }) => {
    if (!message.text) return;

    sendMessage(
      { text: message.text },
      { body: { webSearch, model } },
    );
    setInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 relative h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <ThemeToggle />

      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <h1 className="text-xl font-semibold">AI Chat</h1>
        </div>

        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {/* Sources */}
                {message.parts.some((p) => p.type === 'source-url') && (
                  <Sources>
                    <SourcesTrigger
                      count={message.parts.filter((p) => p.type === 'source-url').length}
                    />
                    {message.parts
                      .filter((p) => p.type === 'source-url')
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source href={part.url} title={part.url} />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}

                {/* Message parts */}
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <MessageResponse className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
                              {part.text}
                            </MessageResponse>
                          </MessageContent>
                        </Message>
                        <MessageActions className="justify-end">
                          {message.role === 'user' ? (
                            <MessageAction
                              onClick={() => handleCopy(part.text, `${message.id}-${i}`)}
                              label="Copy"
                              tooltip={copiedId === `${message.id}-${i}` ? 'Copied!' : 'Copy'}
                            >
                              {copiedId === `${message.id}-${i}` ? (
                                <CheckIcon className="size-3" />
                              ) : (
                                <CopyIcon className="size-3" />
                              )}
                            </MessageAction>
                          ) : (
                            <>
                              <MessageAction onClick={() => regenerate()} label="Retry">
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() => handleCopy(part.text, `${message.id}-${i}`)}
                                label="Copy"
                                tooltip={copiedId === `${message.id}-${i}` ? 'Copied!' : 'Copy'}
                              >
                                {copiedId === `${message.id}-${i}` ? (
                                  <CheckIcon className="size-3" />
                                ) : (
                                  <CopyIcon className="size-3" />
                                )}
                              </MessageAction>
                            </>
                          )}
                        </MessageActions>
                      </Fragment>
                    );
                  }

                  if (part.type === 'reasoning') {
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
                  }

                  return null;
                })}
              </div>
            ))}

            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} className="mt-3 sm:mt-4" globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton
                variant={webSearch ? 'default' : 'ghost'}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>

              <PromptInputSelect onValueChange={setModel} value={model}>
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((m) => (
                    <PromptInputSelectItem key={m.value} value={m.value}>
                      {m.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>

            <PromptInputSubmit
              disabled={!input && !status}
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
