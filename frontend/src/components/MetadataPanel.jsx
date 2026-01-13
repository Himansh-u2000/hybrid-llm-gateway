import { motion } from 'framer-motion';

export default function MetadataPanel({ metadata }) {
    const {
        promptTokens = 0,
        completionTokens = 0,
        totalTokens = 0,
        provider = null,
        latency = null,
        rateLimitRemaining = null,
        requestCount = 0
    } = metadata || {};

    const isLocal = provider === 'ollama';
    const isCloud = provider === 'do-agent';

    return (
        <div className="glass-panel p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Observability</h3>
                <div className="text-xs text-[var(--text-tertiary)] font-mono">
                    {requestCount} requests
                </div>
            </div>

            {/* Token Usage */}
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-xs text-[var(--text-tertiary)]">Token Usage</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <motion.div
                        key={`prompt-${promptTokens}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-[var(--bg-tertiary)] rounded-lg p-2 text-center"
                    >
                        <div className="stat-value text-purple-400">{promptTokens}</div>
                        <div className="stat-label mt-1">Prompt</div>
                    </motion.div>
                    <motion.div
                        key={`completion-${completionTokens}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-[var(--bg-tertiary)] rounded-lg p-2 text-center"
                    >
                        <div className="stat-value text-cyan-400">{completionTokens}</div>
                        <div className="stat-label mt-1">Completion</div>
                    </motion.div>
                    <motion.div
                        key={`total-${totalTokens}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-[var(--bg-tertiary)] rounded-lg p-2 text-center"
                    >
                        <div className="stat-value text-emerald-400">{totalTokens}</div>
                        <div className="stat-label mt-1">Total</div>
                    </motion.div>
                </div>
            </div>

            {/* Provider & Latency */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                        <span className="stat-label">Provider</span>
                    </div>
                    {provider ? (
                        <span className={`badge ${isLocal ? 'badge-success' : 'badge-info'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isLocal ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            {isLocal ? 'Local' : 'Cloud'}
                        </span>
                    ) : (
                        <span className="text-sm text-[var(--text-tertiary)]">—</span>
                    )}
                </div>

                <div className="bg-[var(--bg-tertiary)] rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="stat-label">Latency</span>
                    </div>
                    {latency !== null ? (
                        <span className="font-mono text-sm text-[var(--text-primary)]">
                            {latency.toFixed(0)}ms
                        </span>
                    ) : (
                        <span className="text-sm text-[var(--text-tertiary)]">—</span>
                    )}
                </div>
            </div>

            {/* Rate Limit Status */}
            <div className="border-t border-[var(--border-primary)] pt-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-[var(--text-tertiary)]">API Status</span>
                    </div>
                    <span className="badge badge-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Healthy
                    </span>
                </div>
            </div>
        </div>
    );
}
