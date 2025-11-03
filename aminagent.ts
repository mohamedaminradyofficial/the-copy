import { MistralPrivate } from "@mistralai/mistralai-private";

const client = new MistralPrivate({
  serverURL: "https://api.mistral.ai/",
  apiKey: process.env.MISTRAL_API_KEY || "",
});

const response = await client.beta.conversations.startStream({
  agentId: "ag_019a48ffb889774b8676975ff23159f9",
  inputs: "Hello there!",
});

for await (const chunk of response) {
  console.log(chunk);
}