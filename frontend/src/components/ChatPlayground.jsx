import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble, { TypingIndicator } from './MessageBubble';

export default function ChatPlayground({ messages, onSendMessage, isLoading }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex flex-col h-full glass-panel overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border-primary)] md:block hidden">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Chat Playground</h2>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Test the hybrid routing in real-time
                </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-emerald-500/20 border border-[var(--border-primary)] flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                            Start a Conversation
                        </h3>
                        <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
                            Send a message to see how the gateway intelligently routes between local and cloud LLMs.
                        </p>

                        {/* Quick Prompts */}
                        <div className="flex flex-wrap gap-2 mt-6 justify-center">
                            {[
                                'Explain microservices',
                                'Hello!',
                                'Compare SQL vs NoSQL',
                            ].map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setInput(prompt)}
                                    className="px-3 py-1.5 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {messages.map((message, index) => (
                            <MessageBubble
                                key={index}
                                message={message}
                                isUser={message.role === 'user'}
                                provider={message.provider}
                            />
                        ))}
                        {isLoading && <TypingIndicator key="typing" />}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-primary)]">
                <div className="flex gap-3 md:flex-row flex-col">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message... (Shift+Enter for new line)"
                            rows={1}
                            className="w-full text-xs md:text-sm px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] resize-none focus-ring placeholder:text-[var(--text-tertiary)]"
                            disabled={isLoading}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary md:px-5 md:py-3 mx-2 py-1 rounded-xl flex items-center gap-2"
                    >
                        <svg className="md:w-4 w-2 h-2 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Send
                    </motion.button>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 text-center md:block hidden">
                    Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-elevated)] rounded text-[var(--text-secondary)]">Enter</kbd> to send
                </p>
            </form>
        </div>
    );
}
