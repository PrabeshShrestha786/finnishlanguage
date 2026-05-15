'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, Plus, RefreshCw, Copy, ThumbsUp } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user' | 'assistant'; content: string; id: string; }

const SUGGESTIONS = [
  '🔤 Explain the partitive case',
  '✏️ Correct my Finnish sentence',
  '🗣️ Teach me to say "I want coffee"',
  '📝 Give me 5 vocabulary exercises',
  '🔊 How do you pronounce "Hyvää"?',
  '📚 What are Finnish verb types?',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-2 h-2 bg-aurora-purple/70 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fi-FI';
    window.speechSynthesis.speak(u);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-aurora-purple to-finn-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-1 shadow-glow-purple">
          F
        </div>
      )}
      <div className={`max-w-[95%] sm:max-w-[78%] group relative`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-finn-600/40 border border-finn-500/30 text-white rounded-tr-sm'
            : 'glass-light border border-white/10 text-slate-200 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-white prose-code:text-aurora-green prose-code:bg-white/10 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!'); }}
              className="text-slate-600 hover:text-slate-400 transition-colors">
              <Copy className="w-3 h-3" />
            </button>
            <button onClick={() => speak(msg.content)} className="text-slate-600 hover:text-aurora-green transition-colors">
              <Volume2 className="w-3 h-3" />
            </button>
            <button className="text-slate-600 hover:text-aurora-yellow transition-colors">
              <ThumbsUp className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AiTutorPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hei! 👋 I'm **FinnMate**, your personal Finnish tutor!\n\nI can help you with:\n- 📝 **Grammar** — Finnish cases, verb conjugation, word order\n- 🗣️ **Vocabulary** — words, phrases, example sentences\n- ✏️ **Corrections** — paste Finnish text for instant feedback\n- 🎯 **Exercises** — I'll create custom quizzes for you\n\nMitä haluaisit oppia tänään? *(What would you like to learn today?)*`,
      id: '0',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (msg: string) =>
      api.post('/ai/chat', {
        message: msg,
        history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      }).then((r) => r.data.data),
  });

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;
    setInput('');

    const userMsg: Message = { role: 'user', content, id: Date.now().toString() };
    setMessages((m) => [...m, userMsg]);
    setIsTyping(true);

    try {
      const res = await mutation.mutateAsync(content);
      setMessages((m) => [...m, { role: 'assistant', content: res.message, id: (Date.now() + 1).toString() }]);
    } catch {
      setMessages((m) => [...m, {
        role: 'assistant',
        content: 'Anteeksi! (Sorry!) I\'m having trouble connecting. Please try again.',
        id: (Date.now() + 1).toString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'audio.webm');
        try {
          const res = await api.post('/ai/stt', fd);
          if (res.data.data?.text) setInput(res.data.data.text);
        } catch { toast.error('Speech recognition failed'); }
      };
      mediaRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch { toast.error('Microphone access denied'); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const speakFinnish = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fi-FI'; u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-4 mb-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurora-purple to-finn-500 flex items-center justify-center text-white font-black text-xl shadow-glow-purple">
          F
        </div>
        <div className="flex-1">
          <div className="text-white font-black">FinnMate AI Tutor</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-aurora-green rounded-full animate-pulse" />
            <span className="text-aurora-green text-xs font-medium">Online · Powered by Groq Llama 3.3</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMessages([{
            role: 'assistant', content: 'Hei uudelleen! 👋 New conversation started. Mitä harjoitellaan?', id: Date.now().toString(),
          }])} className="btn-secondary px-3 py-2 text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> New Chat
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card rounded-3xl p-6 mb-4 bg-ai-tutor">
        {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-aurora-purple to-finn-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">F</div>
            <div className="glass-light border border-white/10 rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => sendMessage(s.replace(/^[^ ]+ /, ''))}
            className="flex-shrink-0 glass-light border border-white/10 hover:border-finn-500/40 text-slate-400 hover:text-white text-xs px-3 py-2 rounded-xl transition-all whitespace-nowrap">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="glass-card rounded-3xl p-3 flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask FinnMate anything... or write in Finnish for corrections 🇫🇮"
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 resize-none focus:outline-none py-2 px-2 max-h-32"
          style={{ overflowY: 'auto' }}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleRecording}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'glass-light border border-white/10 text-slate-400 hover:text-aurora-green hover:border-aurora-green/30'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-finn-500 to-aurora-purple flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
