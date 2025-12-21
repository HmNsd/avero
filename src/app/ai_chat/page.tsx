'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Copy, RotateCcw, Bot, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const AI_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel
        })
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessageId(assistantMessage.id);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'text-delta' && data.delta) {
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: msg.content + data.delta, isStreaming: true }
                    : msg
                ));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      // Mark message as no longer streaming
      setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="w-full py-4 md:py-6 px-4 md:px-6 backdrop-blur-md bg-stone-100/80 dark:bg-white/10 border-b border-stone-300/50 dark:border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-2 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-white/10 rounded-lg transition-all duration-300 text-sm md:text-base font-medium"
          >
            <span className="text-lg">←</span>
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1.5 bg-stone-100 dark:bg-gray-800 border border-stone-300 dark:border-gray-600 rounded-lg text-xs md:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <div className="text-xs md:text-sm text-stone-600 dark:text-gray-400">
              Powered by Google
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          {/* Chat Messages */}
          <div className="flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-stone-300/50 dark:border-gray-800/50 shadow-xl overflow-hidden">
            <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 md:py-16">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-white mb-2 md:mb-4">
                    Welcome to AI Chat Support
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                    Ask me anything! I'm here to help you with questions, provide information, or just have a conversation.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`p-3 md:p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-orange-600 text-white ml-auto'
                          : 'bg-stone-100 dark:bg-gray-800 text-stone-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse" />
                        )}
                      </p>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1.5 hover:bg-stone-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-4 h-4 text-stone-600 dark:text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-stone-600 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages.length > 0 && !streamingMessageId && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-stone-100 to-stone-50 dark:from-gray-800 dark:to-gray-900 p-4 md:p-5 rounded-2xl shadow-md border border-stone-200 dark:border-gray-700 min-w-[120px]">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <motion.span 
                        className="text-xs md:text-sm text-stone-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Thinking...
                      </motion.span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 md:mt-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-stone-300/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-3 md:p-4">
              <div className="flex gap-2 md:gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="w-full min-h-[50px] md:min-h-[60px] max-h-32 resize-none bg-stone-50/50 dark:bg-gray-900/50 border border-stone-200 dark:border-gray-600 rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm md:text-base text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-gray-400 transition-all duration-200"
                    disabled={isLoading}
                    rows={1}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="relative overflow-hidden flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl disabled:shadow-sm group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  {isLoading ? (
                    <div className="relative z-10 w-5 h-5 border-2 border-white/70 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="relative z-10 w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-stone-500 dark:text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}