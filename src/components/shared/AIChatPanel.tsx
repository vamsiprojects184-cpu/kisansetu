'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { mockChatResponses, mockChatHistory, delay } from '@/data/mock-data';
import type { ChatMessage } from '@/types';

const suggestions = [
  'What should I grow?',
  'Is irrigation needed today?',
  'Why are my leaves yellow?',
  'Show today\'s market prices',
];

export default function AIChatPanel() {
  const { isChatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  const getResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    for (const [key, val] of Object.entries(mockChatResponses)) {
      if (key !== 'default' && lower.includes(key)) return val;
    }
    return mockChatResponses.default;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await delay(1200 + Math.random() * 800);

    const response = getResponse(text);
    const aiMsg: ChatMessage = {
      id: `m${Date.now() + 1}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        sendMessage('What should I grow next season?');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 z-50 lg:hidden'
            onClick={() => setChatOpen(false)}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] bg-card border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden'
          >
            {/* Header */}
            <div className='gradient-green p-4 flex items-center justify-between shrink-0'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                  <Sparkles className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-white'>Farm AI Assistant</h3>
                  <p className='text-white/80 text-xs'>Online • Ready to help</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className='text-white/80 hover:text-white p-1'>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className='flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4'>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  )}>
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex justify-start'
                >
                  <div className='bg-muted rounded-2xl rounded-bl-md px-4 py-3'>
                    <div className='flex gap-1.5'>
                      <span className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '0ms' }} />
                      <span className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '150ms' }} />
                      <span className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !isTyping && (
              <div className='px-4 pb-2 flex flex-wrap gap-2'>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className='text-xs px-3 py-1.5 rounded-full border hover:bg-accent transition-colors text-muted-foreground'
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className='p-3 border-t flex items-center gap-2 shrink-0'>
              <button
                type='button'
                onClick={handleVoice}
                className={cn(
                  'p-2 rounded-full transition-colors shrink-0',
                  isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-accent text-muted-foreground'
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='Type your question...'
                className='rounded-full border-0 bg-muted'
                disabled={isTyping}
              />
              <Button
                type='submit'
                size='icon'
                className='rounded-full shrink-0'
                disabled={!input.trim() || isTyping}
              >
                <Send size={16} />
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
