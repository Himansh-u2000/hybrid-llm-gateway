import { motion } from 'framer-motion';

export default function Header({ apiKey, setApiKey, isValidKey }) {
    return (
        <header className="w-full px-6 py-4 border-b border-(--border-primary) bg-(--bg-secondary)">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex md:items-center gap-4  flex-col md:flex-row">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 via-cyan-500 to-emerald-500 flex items-center justify-center"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </motion.div>

                    <div>
                        <motion.h1
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:text-xl text-base font-semibold gradient-title"
                        >
                            Hybrid LLM Gateway
                        </motion.h1>
                        <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-sm text-(--text-secondary) md:block hidden"
                        >
                            Intelligent Routing Between Local & Cloud LLMs
                        </motion.p>
                    </div>
                </div>

                {/* API Key Input */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter API Key"
                            className="w-48 px-4 py-2 pr-10 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] focus-ring placeholder:text-[var(--text-tertiary)]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isValidKey ? (
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                        </div>
                    </div>

                    <div className={`badge ${isValidKey ? 'badge-success' : 'badge-warning'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isValidKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {isValidKey ? 'Valid' : 'Enter Key'}
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
