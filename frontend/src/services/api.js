const API_BASE = '/v1';

/**
 * Send a chat completion request to the Hybrid LLM Gateway
 * @param {Object} options - Request options
 * @param {Array} options.messages - Chat messages
 * @param {string} options.apiKey - API key for authentication
 * @param {string} options.routingMode - 'auto' | 'local' | 'cloud'
 * @returns {Promise<Object>} - API response with metadata
 */
export async function sendChatCompletion({ messages, apiKey, routingMode = 'auto' }) {
    const startTime = performance.now();

    // Determine model preference based on routing mode
    let model = undefined;
    if (routingMode === 'cloud') {
        model = 'gpt-oss-120b'; // Triggers large model routing
    } else if (routingMode === 'local') {
        model = 'local'; // Default to local
    }
    // 'auto' mode leaves model undefined for intelligent routing

    try {
        const response = await fetch(`${API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                messages,
                model,
            }),
        });

        const endTime = performance.now();
        const latency = endTime - startTime;

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            content: data.choices?.[0]?.message?.content || '',
            provider: data.provider || 'unknown',
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
            latency,
            raw: data,
        };
    } catch (error) {
        const endTime = performance.now();
        return {
            success: false,
            error: error.message,
            latency: endTime - startTime,
        };
    }
}

/**
 * Determine the routing reason based on the response
 * @param {Object} response - API response
 * @param {string} routingMode - Current routing mode
 * @param {number} maxLocalTokens - Token threshold
 * @returns {string} - Human-readable routing reason
 */
export function getRoutingReason(response, routingMode, maxLocalTokens) {
    if (routingMode === 'local') {
        return 'User override: Force Local';
    }
    if (routingMode === 'cloud') {
        return 'User override: Force Cloud';
    }

    // Auto mode
    const provider = response.provider;
    const promptTokens = response.usage?.promptTokens || 0;

    if (provider === 'do-agent') {
        if (promptTokens > maxLocalTokens) {
            return `Token limit exceeded (${promptTokens} > ${maxLocalTokens})`;
        }
        return 'Complex intent detected';
    }

    return 'Default local routing (efficient for simple queries)';
}
