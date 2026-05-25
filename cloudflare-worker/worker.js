// EZEMTECH Cloudflare Worker
// Backend seguro para busqueda web + IA. No pongas claves en el frontend.
//
// Variables/secretos recomendados:
// SERP_API_KEY    = clave de SerpAPI
// GROQ_API_KEY    = clave de Groq
// GROQ_MODEL      = llama3-8b-8192 (opcional)
// ALLOWED_ORIGINS = https://www.ezemtech.com,https://ezemtech.com,http://localhost:4174

const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.ezemtech.com",
  "https://ezemtech.com",
  "http://localhost:4174",
  "http://127.0.0.1:4174"
];

const ROUTES = {
  sales: "sales@ezemtech.com,listercampos@gmail.com",
  default: "info@ezemtech.com,listercampos@gmail.com"
};

function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(",");
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = getAllowedOrigins(env);
  const allowOrigin = allowedOrigins.includes("*")
    ? "*"
    : allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function jsonResponse(request, env, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sanitizeText(value, maxLength = 5000) {
  const text = String(value || "").slice(0, maxLength);
  return text
    .replace(/\b(password|passcode|contrasena|contrase\u00f1a|clave|pin)\s*[:=]?\s*\S+/gi, "$1: [REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[PAYMENT_CARD_REDACTED]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]")
    .replace(/\b(cfut_[A-Za-z0-9_-]+|gsk_[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+|AIza[0-9A-Za-z_-]{20,})\b/g, "[API_KEY_REDACTED]")
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[PRIVATE_KEY_REDACTED]");
}

function sanitizePayload(payload) {
  if (typeof payload === "string") return sanitizeText(payload);
  if (Array.isArray(payload)) return payload.slice(-8).map((item) => sanitizePayload(item));
  if (payload && typeof payload === "object") {
    return Object.entries(payload).reduce((safePayload, [key, value]) => {
      safePayload[key] = sanitizePayload(value);
      return safePayload;
    }, {});
  }

  return payload;
}

function classify(message, category) {
  const text = normalize(`${category || ""} ${message || ""}`);
  if (/(venta|ventas|sales|comprar|buy|purchase|precio|precios|price|pricing|cotizacion|quote|estimate|presupuesto|producto|productos|product|products|accesorio|accesorios|accessory|accessories|cable|cargador|charger|parts|partes)/.test(text)) {
    return "sales";
  }

  return "default";
}

function buildSearchQuery(message) {
  const cleanMessage = sanitizeText(message, 240);
  return `${cleanMessage} (site:ezemtech.com OR official support OR troubleshooting)`;
}

async function searchInternet(message, serpApiKey, language) {
  if (!serpApiKey) {
    return {
      summary: "SerpAPI no esta configurado. No se realizo busqueda en internet.",
      sources: []
    };
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("q", buildSearchQuery(message));
  url.searchParams.set("api_key", serpApiKey);
  url.searchParams.set("engine", "google");
  url.searchParams.set("hl", language === "en" ? "en" : "es");
  url.searchParams.set("gl", "us");
  url.searchParams.set("num", "5");

  const response = await fetch(url.toString(), {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) {
    return {
      summary: `Busqueda no disponible en este momento. Estado: ${response.status}`,
      sources: []
    };
  }

  const data = await response.json();
  const sources = (data.organic_results || [])
    .slice(0, 5)
    .map((result) => ({
      title: sanitizeText(result.title || "Fuente web", 160),
      link: sanitizeText(result.link || "", 300),
      snippet: sanitizeText(result.snippet || "", 500)
    }))
    .filter((result) => result.snippet || result.link);

  const summary = sources.length
    ? sources.map((source, index) => `${index + 1}. ${source.title}\n${source.snippet}\n${source.link}`).join("\n\n")
    : "No se encontraron resultados relevantes.";

  return { summary, sources };
}

async function askGroq({ message, language, category, history, brandPolicy, searchContext, routeEmail, groqApiKey, model }) {
  if (!groqApiKey) {
    return "Groq no esta configurado. Agrega GROQ_API_KEY como secreto del Worker para activar respuestas IA.";
  }

  const systemPrompt = [
    "Eres el asistente tecnico oficial de EZEMTECH LLC, una empresa real de tecnologia ubicada en New Jersey, United States.",
    "Atiende clientes sobre computadoras, telefonos, drones, redes, IA, ventas, productos, accesorios, reservas y soporte.",
    "Responde en espanol si language es 'es'; responde en ingles si language es 'en'.",
    "Usa tono profesional, claro, didactico y paso a paso.",
    "Usa la informacion web solo como apoyo; no inventes precios, garantia, inventario ni disponibilidad.",
    "Cuando aplique, recomienda servicios, productos o reservas de EZEMTECH.com sin sonar forzado.",
    "No pidas contrasenas, codigos 2FA, tarjetas ni datos sensibles. Si el cliente los comparte, indica que deben protegerse.",
    `Ruteo interno: ventas/productos/accesorios => ${ROUTES.sales}; todo lo demas => ${ROUTES.default}; WhatsApp/llamadas => +1 646 842 2766.`,
    `La categoria detectada es ${category}. El correo destino sugerido es ${routeEmail}.`
  ].join("\n");

  const safeHistory = (history || []).slice(-6).map((turn) => ({
    role: turn.role === "assistant" ? "assistant" : "user",
    content: sanitizeText(turn.content || turn.message || "", 1200)
  }));

  const userPrompt = [
    `Pregunta del cliente: ${sanitizeText(message)}`,
    `Politica de marca/configuracion: ${JSON.stringify(sanitizePayload(brandPolicy || {}))}`,
    `Resultados de busqueda web:\n${searchContext}`,
    "Entrega una respuesta accionable. Si conviene seguimiento, sugiere crear ticket, reservar en EZEMTECH.com o contactar por WhatsApp."
  ].join("\n\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqApiKey}`
    },
    body: JSON.stringify({
      model: model || "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory,
        { role: "user", content: userPrompt }
      ],
      temperature: 0.45,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const messageText = data.error?.message || `Groq status ${response.status}`;
    throw new Error(messageText);
  }

  return data.choices?.[0]?.message?.content || "No pude generar una respuesta en este momento.";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    if (request.method !== "POST") {
      return jsonResponse(request, env, { error: "Usa POST" }, 405);
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > 20000) {
      return jsonResponse(request, env, { error: "Solicitud demasiado grande" }, 413);
    }

    try {
      const body = await request.json();
      const message = sanitizeText(body.message || "");
      if (!message.trim()) {
        return jsonResponse(request, env, { error: "Mensaje vacio" }, 400);
      }

      const language = body.language === "en" ? "en" : "es";
      const routeType = classify(message, body.category);
      const routeEmail = routeType === "sales" ? ROUTES.sales : ROUTES.default;
      const search = await searchInternet(message, env.SERP_API_KEY, language);
      const reply = await askGroq({
        message,
        language,
        category: routeType,
        history: sanitizePayload(body.history || []),
        brandPolicy: sanitizePayload(body.brandPolicy || {}),
        searchContext: search.summary,
        routeEmail,
        groqApiKey: env.GROQ_API_KEY,
        model: env.GROQ_MODEL
      });

      return jsonResponse(request, env, {
        reply,
        routedTo: routeEmail,
        category: routeType,
        sources: search.sources
      });
    } catch (error) {
      console.error("EZEMTECH worker error", error.message);
      return jsonResponse(request, env, { error: "Error interno del asistente" }, 500);
    }
  }
};
