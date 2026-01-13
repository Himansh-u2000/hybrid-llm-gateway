import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ message, isUser, provider }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-[85%] rounded-2xl md:px-5 md:py-4 px-2 py-1 ${isUser
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : 'glass-panel-strong'
                    }`}
            >
                {/* Provider Badge for Assistant */}
                {!isUser && provider && (
                    <div className={`flex items-center gap-2 mb-3 text-xs ${provider === 'ollama' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${provider === 'ollama' ? 'bg-emerald-500' : 'bg-blue-500'
                            } animate-pulse`} />
                        {provider === 'ollama' ? 'Local (Ollama)' : 'Cloud (DigitalOcean)'}
                    </div>
                )}

                {/* Message Content with Markdown */}
                <div className={`markdown-content text-sm leading-relaxed ${isUser ? '' : 'text-[var(--text-primary)]'}`}>
                    {isUser ? (
                        message.content
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Headings
                                h1: ({ children }) => <h1 className="md:text-xl text-lg font-bold mb-3 mt-4 text-[var(--text-primary)]">{children}</h1>,
                                h2: ({ children }) => <h2 className="md:text-lg text-sm font-semibold mb-2 mt-3 text-[var(--text-primary)]">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm md:text-base font-semibold mb-2 mt-2 text-[var(--text-primary)]">{children}</h3>,

                                // Paragraphs
                                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-xs">{children}</p>,

                                // Bold and emphasis
                                strong: ({ children }) => <strong className="font-semibold text-[var(--accent-cyan)]">{children}</strong>,
                                em: ({ children }) => <em className="italic text-[var(--text-secondary)]">{children}</em>,

                                // Lists
                                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>,
                                li: ({ children }) => <li className="text-[var(--text-primary)]">{children}</li>,

                                // Code
                                code: ({ inline, children }) =>
                                    inline ? (
                                        <code className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--accent-purple)] font-mono text-xs">{children}</code>
                                    ) : (
                                        <code className="block p-3 bg-[var(--bg-primary)] rounded-lg font-mono text-xs overflow-x-auto mb-3">{children}</code>
                                    ),
                                pre: ({ children }) => <pre className="mb-3">{children}</pre>,

                                // Tables
                                table: ({ children }) => (
                                    <div className="overflow-x-auto mb-4 rounded-lg border border-[var(--border-primary)]">
                                        <table className="w-full text-sm">{children}</table>
                                    </div>
                                ),
                                thead: ({ children }) => <thead className="bg-[var(--bg-tertiary)]">{children}</thead>,
                                tbody: ({ children }) => <tbody className="divide-y divide-[var(--border-primary)]">{children}</tbody>,
                                tr: ({ children }) => <tr className="hover:bg-[var(--bg-tertiary)] transition-colors">{children}</tr>,
                                th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-[var(--accent-cyan)] border-b border-[var(--border-secondary)]">{children}</th>,
                                td: ({ children }) => <td className="px-4 py-3 text-[var(--text-primary)]">{children}</td>,

                                // Links
                                a: ({ href, children }) => <a href={href} className="text-[var(--accent-purple)] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,

                                // Blockquotes
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-3 border-[var(--accent-purple)] pl-4 py-1 my-3 bg-[var(--bg-tertiary)] rounded-r-lg italic">
                                        {children}
                                    </blockquote>
                                ),

                                // Horizontal rule
                                hr: () => <hr className="my-4 border-[var(--border-primary)]" />,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start mb-4"
        >
            <div className="glass-panel-strong rounded-2xl px-5 py-4">
                <div className="flex items-center gap-1.5">
                    <span className="typing-dot w-2 h-2 bg-[var(--accent-purple)] rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-[var(--accent-cyan)] rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-[var(--accent-local)] rounded-full" />
                </div>
            </div>
        </motion.div>
    );
}
