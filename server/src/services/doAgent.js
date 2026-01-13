import axios from "axios";

export async function chatWithDOAgent(messages) {
  const endpoint = process.env.DO_AGENT_ENDPOINT;
  const apiKey = process.env.DO_AGENT_ACCESS_KEY;

  console.log("DO_AGENT_ENDPOINT =", endpoint);
  console.log("DO_AGENT_ACCESS_KEY =", apiKey ? "SET" : "MISSING");

  if (!endpoint || !apiKey) {
    throw new Error("DO Agent endpoint not configured");
  }


  const response = await axios.post(
    `${endpoint}/api/v1/chat/completions`,
    {
      messages,
      stream: false
    },
    {
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  );

  const data = response.data;
  console.log(data)

  return {
    content: data?.choices?.[0]?.message?.content ?? "no content from api",
    tokens: {
      input: data?.usage?.prompt_tokens ?? 0,
      output: data?.usage?.completion_tokens ?? 0,
      total: data?.usage?.total_tokens ?? 0
    }
  };
}
