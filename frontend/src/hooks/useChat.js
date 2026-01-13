import { useState, useCallback } from 'react';
import { sendChatCompletion, getRoutingReason } from '../services/api';

export function useChat(apiKey, settings) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastRouting, setLastRouting] = useState(null);
    const [metadata, setMetadata] = useState({
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        provider: null,
        latency: null,
        requestCount: 0,
    });

    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading) return;

        // Add user message
        const userMessage = { role: 'user', content };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        // Prepare messages for API (only role and content)
        const apiMessages = updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
        }));

        try {
            const response = await sendChatCompletion({
                messages: apiMessages,
                apiKey,
                routingMode: settings.routingMode,
            });

            if (response.success) {
                // Add assistant message with provider info
                const assistantMessage = {
                    role: 'assistant',
                    content: response.content,
                    provider: response.provider,
                };
                setMessages(prev => [...prev, assistantMessage]);

                // Update routing info
                const reason = getRoutingReason(response, settings.routingMode, settings.maxLocalTokens);
                setLastRouting({
                    provider: response.provider,
                    reason,
                    isActive: true,
                });

                // Update metadata
                setMetadata(prev => ({
                    promptTokens: response.usage.promptTokens,
                    completionTokens: response.usage.completionTokens,
                    totalTokens: response.usage.totalTokens,
                    provider: response.provider,
                    latency: response.latency,
                    requestCount: prev.requestCount + 1,
                }));
            } else {
                // Handle error
                const errorMessage = {
                    role: 'assistant',
                    content: `Error: ${response.error}. Please check your API key and ensure the backend is running.`,
                    provider: null,
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: `Connection error: ${error.message}`,
                provider: null,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, apiKey, settings]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setLastRouting(null);
        setMetadata({
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            provider: null,
            latency: null,
            requestCount: 0,
        });
    }, []);

    return {
        messages,
        isLoading,
        lastRouting,
        metadata,
        sendMessage,
        clearMessages,
    };
}
