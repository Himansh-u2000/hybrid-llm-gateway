import { motion } from 'framer-motion';
import { useState } from 'react';
import ChatPlayground from './components/ChatPlayground';
import Header from './components/Header';
import MetadataPanel from './components/MetadataPanel';
import RoutingPanel from './components/RoutingPanel';
import { useChat } from './hooks/useChat';

function App() {
  // API Key state
  const [apiKey, setApiKey] = useState('dev-key-123');
  const isValidKey = apiKey.length > 0;

  // Settings state
  const [settings, setSettings] = useState({
    routingMode: 'auto',
    maxLocalTokens: 500,
    temperature: 0.7,
  });

  // Chat state via custom hook
  const { messages, isLoading, lastRouting, metadata, sendMessage, clearMessages } = useChat(apiKey, settings);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <Header apiKey={apiKey} setApiKey={setApiKey} isValidKey={isValidKey} />

      {/* Main Content */}
      <main className="flex-1 md:p-6 p-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]"
          >
            {/* Left: Chat Playground */}
            <div className="lg:col-span-3 h-full min-h-0">
              <ChatPlayground
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>

            {/* Right: Panels */}
            <div className="space-y-4 overflow-y-auto lg:col-span-1 md:block hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RoutingPanel lastRouting={lastRouting} />
              </motion.div>


              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MetadataPanel metadata={metadata} />
              </motion.div>

              {/* Clear Chat Button */}
              {messages.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearMessages}
                  className="w-full py-3 px-4 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Conversation
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <div className="flex items-center gap-4">
            <span>Hybrid LLM Gateway</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-secondary)]" />
            <span>AI Infrastructure Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local: Ollama
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Cloud: DigitalOcean
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
