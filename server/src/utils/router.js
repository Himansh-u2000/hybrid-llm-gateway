import { countMessageTokens } from './tokenCounter.js';
import { isHeavyIntent } from './intentDetector.js';

import { chatWithOllama } from '../services/ollama.js';
import { chatWithDOAgent } from '../services/doAgent.js';
import { streamWithOllama } from '../services/ollamaStream.js';

export async function routeChat({
  messages,
  modelPreference,
  stream = false
}) {
  // 1️⃣ Compute routing signals
  const inputTokens = countMessageTokens(messages);
  const maxLocal = Number(process.env.LOCAL_MAX_TOKENS || 500);
  const useDO = process.env.USE_DO_AGENT === 'true';

  // 🔒 Explicit override is ONE-SHOT only
  const isExplicitOverride = modelPreference === 'force-cloud';

  const heavyIntent = isHeavyIntent(messages);

  // 2️⃣ Log routing decision (critical for prod debugging)
  console.log('🧠 Routing decision', {
    inputTokens,
    maxLocal,
    heavyIntent,
    useDO,
    modelPreference,
    isExplicitOverride,
    stream
  });

  // 3️⃣ Explicit override → DO Agent (NO FALLBACK REUSE)
  if (isExplicitOverride && useDO) {
    console.log('➡️ Routed to DO Agent (explicit one-shot override)');
    try {
      return {
        ...(await chatWithDOAgent(messages)),
        routedTo: 'do-agent',
        routingReason: 'explicit-override'
      };
    } catch (err) {
      console.error(
        '❌ DO Agent failed (explicit override), falling back to Ollama:',
        err.message
      );
      // fallback allowed, but override is NOT remembered
    }
  }

  // 4️⃣ Token OR intent based routing → DO Agent (AUTO)
  if ((inputTokens > maxLocal || heavyIntent) && useDO) {
    console.log('➡️ Routed to DO Agent (tokens or intent)');
    try {
      return {
        ...(await chatWithDOAgent(messages)),
        routedTo: 'do-agent',
        routingReason: inputTokens > maxLocal ? 'token-threshold' : 'heavy-intent'
      };
    } catch (err) {
      console.error(
        '❌ DO Agent failed (auto routing), falling back to Ollama:',
        err.message
      );
    }
  }

  // 5️⃣ Streaming support (local only)
  if (stream === true) {
    console.log('➡️ Streaming with Ollama');
    return {
      stream: streamWithOllama(messages),
      routedTo: 'ollama',
      routingReason: 'local-stream'
    };
  }

  // 6️⃣ Default → Ollama
  console.log('➡️ Routed to Ollama (local)');
  return {
    ...(await chatWithOllama(messages)),
    routedTo: 'ollama',
    routingReason: 'local-default'
  };
}
