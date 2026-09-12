import { createFileRoute } from "@tanstack/react-router";

type Body = {
  prompt?: unknown;
  rowCount?: unknown;
  apiKey?: unknown;
};

const SYSTEM_INSTRUCTION =
  "You are a backend test data generator. Output ONLY a valid JSON array of objects matching the user's prompt. Zero markdown wrappers, zero commentary.";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function extractJsonArray(text: string): Record<string, unknown>[] {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  const slice = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
  const parsed = JSON.parse(slice) as unknown;
  if (!Array.isArray(parsed)) throw new Error("Model did not return a JSON array");
  return parsed.filter((row) => row && typeof row === "object") as Record<string, unknown>[];
}

async function callGemini(apiKey: string, userPrompt: string) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
      }),
    },
  );

  if (!res.ok) {
    try {
      const detail = await res.text();
      return { ok: false as const, status: res.status, detail };
    } catch (err) {
      return { ok: false as const, status: res.status, detail: String(err) };
    }
  }

  try {
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    return { ok: true as const, text };
  } catch (err) {
    return { ok: false as const, status: 502, detail: `Invalid JSON response from Gemini: ${String(err)}` };
  }
}

async function callGateway(apiKey: string, userPrompt: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false as const, status: res.status, detail };
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return { ok: true as const, text: data.choices?.[0]?.message?.content ?? "" };
}

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
        const rowCountRaw = Number(body.rowCount);
        const rowCount = Number.isFinite(rowCountRaw)
          ? Math.min(Math.max(Math.round(rowCountRaw), 1), 200)
          : 10;
        const userKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

        if (!prompt) return json({ error: "Describe the data you need first." }, 400);

        const userPrompt = `${prompt}\n\nReturn exactly ${rowCount} objects. Every object must share the same keys. Use realistic, varied values.`;

        const geminiKey = userKey || process.env["GEMINI_API_KEY"] || "";
        const lovableKey = process.env["LOVABLE_API_KEY"] || "";

        let result: Awaited<ReturnType<typeof callGemini>>;
        if (geminiKey) {
          result = await callGemini(geminiKey, userPrompt);
        } else if (lovableKey) {
          result = await callGateway(lovableKey, userPrompt);
        } else {
          return json(
            { error: "No generation key is configured. Add your own API key to continue." },
            503,
          );
        }

        if (!result.ok) {
          const message =
            result.status === 429
              ? "Rate limit reached. Wait a moment and try again."
              : result.status === 402
                ? "The generation credits for this tool are exhausted."
                : result.status === 401 || result.status === 403
                  ? "The API key was rejected. Check your custom key."
                  : "The generator is temporarily unavailable. Try again shortly.";
          console.error("mock-data generation failed", result.status, result.detail);
          return json({ error: message }, result.status === 429 ? 429 : 502);
        }

        try {
          const rows = extractJsonArray(result.text).slice(0, rowCount);
          if (rows.length === 0) return json({ error: "The model returned no rows." }, 502);
          return json({ rows });
        } catch {
          return json({ error: "Could not read the generated data. Try rephrasing." }, 502);
        }
      },
    },
  },
});
