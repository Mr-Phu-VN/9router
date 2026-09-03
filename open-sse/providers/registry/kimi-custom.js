import { CLAUDE_API_HEADERS } from "../shared.js";

// Kimi Customize — global Kimi Open Platform (platform.kimi.ai / api.moonshot.ai).
// API-key only (Bearer). Pay-as-you-go; no OAuth / Kimi Code subscription.
export default {
  id: "kimi-custom",
  priority: 171,
  alias: "kimi-custom",
  display: {
    name: "Kimi Customize",
    icon: "psychology",
    color: "#1E3A8A",
    textIcon: "KC",
    website: "https://platform.kimi.ai",
    notice: {
      apiKeyUrl: "https://platform.kimi.ai/console/api-keys",
      signupUrl: "https://platform.kimi.ai",
    },
  },
  category: "apikey",
  authModes: ["apikey"],
  transport: {
    baseUrl: "https://api.moonshot.ai/v1/chat/completions",
    format: "openai",
    auth: {
      combined: true,
      header: "Authorization",
      scheme: "bearer",
    },
  },
  // Multi-endpoint: pick the transport matching client sourceFormat to skip translation.
  transports: [
    {
      format: "openai",
      baseUrl: "https://api.moonshot.ai/v1/chat/completions",
      auth: { combined: true, header: "Authorization", scheme: "bearer" },
    },
    {
      format: "claude",
      baseUrl: "https://api.moonshot.ai/anthropic/v1/messages",
      headers: { ...CLAUDE_API_HEADERS },
      auth: { combined: true, header: "Authorization", scheme: "bearer" },
    },
  ],
  models: [
    { id: "kimi-k3", name: "Kimi K3" },
    { id: "kimi-k2.7-code", name: "Kimi K2.7 Code" },
    { id: "kimi-k2.7-code-highspeed", name: "Kimi K2.7 Code Highspeed" },
    { id: "kimi-k2.6", name: "Kimi K2.6" },
    { id: "kimi-k2.5", name: "Kimi K2.5" },
  ],
  serviceKinds: ["llm", "webSearch"],
  searchViaChat: {
    defaultModel: "kimi-k3",
    endpoint: "https://api.moonshot.ai/v1/chat/completions",
    pricingUrl: "https://platform.kimi.ai/docs/pricing/chat",
  },
  features: {
    usage: true,
    usageApikey: true,
  },
};
