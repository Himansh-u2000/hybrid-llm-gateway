export function stripThinking(text = '') {
  // Remove <think>...</think> blocks ONLY if both tags exist
  if (text.includes('<think>') && text.includes('</think>')) {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }

  // If malformed, just return original text
  return text.trim();
}
