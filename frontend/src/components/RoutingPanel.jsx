import { motion } from 'framer-motion';

export default function RoutingPanel({ lastRouting }) {
    const { provider, reason, isActive } = lastRouting || {
        provider: null,
        reason: null,
        isActive: false
    };

    const isLocal = provider === 'ollama';
    const isCloud = provider === 'do-agent';

    return (
        <div className="glass-panel p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Routing Decision</h3>
                {isActive && (
                    <span className="badge badge-info">
                        Active
                    </span>
                )}
            </div>

            {/* Routing Visualization */}
            <div className="flex items-center justify-between gap-2 mb-3">
                {/* Local Provider */}
                <motion.div
                    animate={{
                        scale: isLocal ? 1 : 0.95,
                        opacity: isLocal ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex-1 p-2 rounded-lg border ${isLocal
                        ? 'border-emerald-500/50 bg-emerald-500/10 glow-local'
                        : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLocal ? 'bg-emerald-500' : 'bg-[var(--bg-elevated)]'
                            }`}>
                            <svg className={`w-4 h-4 ${isLocal ? 'text-white' : 'text-[var(--text-tertiary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-[var(--text-primary)]">Local</div>
                            <div className="text-xs text-[var(--text-tertiary)]">Ollama</div>
                        </div>
                    </div>
                    {isLocal && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-xs text-emerald-400 flex items-center gap-1"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Processing
                        </motion.div>
                    )}
                </motion.div>

                {/* Connection */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-blue-500 rounded" />
                    <motion.div
                        animate={{ x: isCloud ? 10 : isLocal ? -10 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-2 h-2 rounded-full bg-purple-500 my-1"
                    />
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-blue-500 rounded" />
                </div>

                {/* Cloud Provider */}
                <motion.div
                    animate={{
                        scale: isCloud ? 1 : 0.95,
                        opacity: isCloud ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex-1 p-2 rounded-lg border ${isCloud
                        ? 'border-blue-500/50 bg-blue-500/10 glow-cloud'
                        : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCloud ? 'bg-blue-500' : 'bg-[var(--bg-elevated)]'
                            }`}>
                            <svg className={`w-4 h-4 ${isCloud ? 'text-white' : 'text-[var(--text-tertiary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-[var(--text-primary)]">Cloud</div>
                            <div className="text-xs text-[var(--text-tertiary)]">DigitalOcean</div>
                        </div>
                    </div>
                    {isCloud && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-xs text-blue-400 flex items-center gap-1"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Processing
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Routing Reason */}
            <div className="border-t border-[var(--border-primary)] pt-3">
                <div className="text-xs text-[var(--text-tertiary)] mb-2">Routing Reason</div>
                {reason ? (
                    <motion.div
                        key={reason}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-[var(--text-primary)] flex items-center gap-2"
                    >
                        <span className={`w-2 h-2 rounded-full ${isLocal ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        {reason}
                    </motion.div>
                ) : (
                    <div className="text-sm text-[var(--text-tertiary)] italic">
                        Send a message to see routing decision
                    </div>
                )}
            </div>
        </div>
    );
}
