'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/use-app-store';
import { useAuthStore } from '@/store/use-auth-store';
import { mockChatHistory, mockChatResponses, delay } from '@/data/mock-data';
import type { ChatMessage } from '@/types';

export default function AIChatAssistant() {
  const { setChatOpen } = useAppStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getResponse = (msg: string): string => {
    const lower = msg.toLowerCase().trim();
    for (const [key, resp] of Object.entries(mockChatResponses)) {
      if (key !== 'default' && lower.includes(key)) return resp;
    }
    return mockChatResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await delay(1200);
    const response = getResponse(userMsg.content);
    const botMsg: ChatMessage = {
      id: `m-${Date.now() + 1}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const quickPrompts = ['What should I grow?', 'Irrigation needed?', 'Why leaves yellow?', 'Market prices today'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className='fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96'
    >
      <div className='bg-card border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]'>
        {/* Header */}
        <div className='gradient-green p-4 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='size-9 rounded-full bg-white/20 flex items-center justify-center'>
              <Bot className='size-5 text-white' />
            </div>
            <div>
              <h3 className='text-white font-semibold text-sm'>KisanSetu Assistant</h3>
              <p className='text-white/70 text-xs'>Online · Ask about farming</p>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className='text-white/70 hover:text-white transition-colors'>
            <X className='size-5' />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin'>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className='size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                  <Bot className='size-3.5 text-primary' />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted rounded-bl-md'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className='size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                  <User className='size-3.5 text-primary' />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className='flex gap-2 items-center'>
              <div className='size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                <Bot className='size-3.5 text-primary' />
              </div>
              <div className='bg-muted rounded-2xl rounded-bl-md px-4 py-3'>
                <div className='flex gap-1'>
                  <span className='size-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '0ms' }} />
                  <span className='size-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '150ms' }} />
                  <span className='size-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className='px-4 pb-2 flex gap-2 flex-wrap'>
            {quickPrompts.map(p => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                className='text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors'
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className='p-3 border-t shrink-0'>
          <div className='flex gap-2'>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`Ask about your farm, ${user?.name?.split(' ')[0] || 'farmer'}...`}
              className='flex-1 rounded-xl'
            />
            <Button size='icon' className='rounded-xl shrink-0' onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className='size-4' />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
