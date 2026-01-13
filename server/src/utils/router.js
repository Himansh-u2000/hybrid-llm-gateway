import { countMessageTokens } from './tokenCounter.js';
import { isHeavyIntent } from './intentDetector.js';

import { chatWithOllama } from '../services/ollama.js';
import { chatWithDOAgent } from '../services/doAgent.js';
import { streamWithOllama } from '../services/ollamaStream.js';

export async function routeChat({ messages, modelPreference, stream = false }) {
  // 1️⃣ Compute routing signals
  const inputTokens = countMessageTokens(messages);
  const maxLocal = Number(process.env.LOCAL_MAX_TOKENS || 500);
  const useDO = process.env.USE_DO_AGENT === 'true';

  const heavyIntent = isHeavyIntent(messages);

  // 2️⃣ Log routing decision (very important for debugging)
  console.log('🧠 Routing decision');
  console.log({
    inputTokens,
    maxLocal,
    heavyIntent,
    useDO,
    modelPreference,
    stream
  });

  // 3️⃣ Explicit override → DO Agent
  if (modelPreference === 'large' && useDO) {
    console.log('➡️ Routed to DO Agent (explicit override)');
    try {
      return {
        ...(await chatWithDOAgent(messages)),
        routedTo: 'do-agent'
      };
    } catch (err) {
      console.error('❌ DO Agent failed (override), falling back to Ollama:', err.message);
    }
  }

  // 4️⃣ Token OR intent based routing → DO Agent
  if ((inputTokens > maxLocal || heavyIntent) && useDO) {
    console.log('➡️ Routed to DO Agent (tokens or intent)');
    try {
      return {
        ...(await chatWithDOAgent(messages)),
        routedTo: 'do-agent'
      };
    } catch (err) {
      console.error('❌ DO Agent failed (auto), falling back to Ollama:', err.message);
    }
  }

  // 5️⃣ Streaming support (local only for now)
  if (stream === true) {
    console.log('➡️ Streaming with Ollama');
    return {
      stream: streamWithOllama(messages),
      routedTo: 'ollama'
    };
  }

  // 6️⃣ Default → Ollama
  console.log('➡️ Routed to Ollama (local)');
  return {
    ...(await chatWithOllama(messages)),
    routedTo: 'ollama'
  };
}
