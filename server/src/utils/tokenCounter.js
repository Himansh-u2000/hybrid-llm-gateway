export function countTokens(text = '') {
  return Math.ceil(text.length / 4);
}

export function countMessageTokens(messages = []) {
  return messages.reduce((sum, m) => {
    return sum + countTokens(m.content || '');
  }, 0);
}
