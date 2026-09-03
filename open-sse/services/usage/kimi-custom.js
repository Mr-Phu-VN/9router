/**
 * Kimi Customize usage — GET https://api.moonshot.ai/v1/users/me/balance
 * Auth: Bearer <apiKey>. Returns USD balances (available / voucher / cash).
 */

import { proxyAwareFetch } from "../../utils/proxyFetch.js";
import { toFiniteNumber } from "./shared.js";

const BALANCE_URL = "https://api.moonshot.ai/v1/users/me/balance";

/**
 * @param {string|null|undefined} apiKey
 * @param {object|null} proxyOptions
 */
export async function getKimiCustomUsage(apiKey = null, proxyOptions = null) {
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    return { message: "Kimi Customize API key not available. Add a key to view balance." };
  }

  try {
    const response = await proxyAwareFetch(
      BALANCE_URL,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      proxyOptions,
    );

    if (response.status === 401 || response.status === 403) {
      return {
        plan: "Kimi Customize",
        message: "Kimi Customize authentication failed. Check the API key.",
      };
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return {
        plan: "Kimi Customize",
        message: `Kimi Customize balance API error (${response.status})${errText ? `: ${errText.slice(0, 120)}` : ""}`,
      };
    }

    const data = await response.json().catch(() => null);
    if (!data || typeof data !== "object" || data.code !== 0 || !data.data) {
      return { plan: "Kimi Customize", message: "Kimi Customize balance response was not valid." };
    }

    const d = data.data;
    const available = toFiniteNumber(d.available_balance, NaN);
    const voucher = toFiniteNumber(d.voucher_balance, NaN);
    const cash = toFiniteNumber(d.cash_balance, NaN);
    if (!Number.isFinite(available)) {
      return { plan: "Kimi Customize", message: "Kimi Customize connected. No balance data returned." };
    }

    const quotas = {};
    const add = (name, value) => {
      if (!Number.isFinite(value)) return;
      const total = Math.max(0, value);
      quotas[name] = {
        used: 0,
        total,
        remainingPercentage: total > 0 ? 100 : 0,
        resetAt: null,
        unlimited: total > 0,
      };
    };
    add("Available Balance (USD)", available);
    add("Voucher Balance (USD)", voucher);
    add("Cash Balance (USD)", cash);

    return {
      plan: available > 0 ? "Kimi Customize" : "Kimi Customize (Insufficient Balance)",
      quotas,
    };
  } catch (error) {
    return { message: `Kimi Customize error: ${error.message}` };
  }
}
