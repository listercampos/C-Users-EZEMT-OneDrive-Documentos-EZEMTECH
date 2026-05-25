// EZEMTECH Cloudflare Worker
// Backend seguro para busqueda web + IA. No pongas claves en el frontend.
//
// Variables/secretos recomendados:
// SERP_API_KEY    = clave de SerpAPI
// GROQ_API_KEY    = clave de Groq
// GROQ_MODEL      = llama3-8b-8192 (opcional)
// EMAIL_WEBHOOK_URL = webhook opcional de Zapier, Make, n8n o Apps Script para notificar tickets
// LEARNING_WEBHOOK_URL = webhook opcional para guardar aprendizaje con consentimiento
// RESEND_API_KEY  = opcional si quieres enviar correo directo con Resend
// EMAIL_FROM      = opcional, ejemplo: EZEMTECH AI <support@ezemtech.com>
// ALLOWED_ORIGINS = https://www.ezemtech.com,https://ezemtech.com,http://localhost:4174,http://localhost:4175

const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.ezemtech.com",
  "https://ezemtech.com",
  "http://localhost:4174",
  "http://127.0.0.1:4174",
  "http://localhost:4175",
  "http://127.0.0.1:4175"
];

const ROUTES = {
  sales: "sales@ezemtech.com,listercampos@gmail.com",
  default: "info@ezemtech.com,listercampos@gmail.com"
};

const COMPANY = {
  name: "EZEMTECH LLC",
  location: "New Jersey, United States",
  website: "https://www.ezemtech.com/",
  bookingUrl: "https://www.ezemtech.com/book-online",
  phone: "+1 646 842 2766"
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

function getRouteEmail(routeType) {
  return routeType === "sales" ? ROUTES.sales : ROUTES.default;
}

function makeTicketId() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `EZT-${stamp}-${random}`;
}

function getRequestAction(body) {
  const action = normalize(body.action || body.type || body.eventType || "");
  if (action.includes("ticket")) return "ticket";
  if (action.includes("learning") || action.includes("conversation_turn")) return "learning";
  if (body.ticket || body.summary) return "ticket";
  return "chat";
}

function buildPlainTicket(ticket) {
  return [
    `Ticket ID: ${ticket.ticketId}`,
    `Empresa: ${COMPANY.name}`,
    `Ubicacion: ${COMPANY.location}`,
    `Categoria: ${ticket.category}`,
    `Destino interno: ${ticket.routedTo}`,
    "",
    `Cliente: ${ticket.customerName || "N/A"}`,
    `Contacto: ${ticket.customerContact || "N/A"}`,
    `Telefono: ${ticket.phone || "N/A"}`,
    `Email: ${ticket.email || "N/A"}`,
    `Ubicacion cliente: ${ticket.location || "N/A"}`,
    "",
    "Resumen:",
    ticket.summary || "N/A",
    "",
    "Ticket completo:",
    ticket.ticket || "N/A",
    "",
    `Reserva: ${COMPANY.bookingUrl}`,
    `WhatsApp / llamadas: ${COMPANY.phone}`
  ].join("\n");
}

function buildHtmlTicket(ticket) {
  const safe = (value) => sanitizeText(value || "N/A").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  return `
    <h2>Nuevo ticket EZEMTECH</h2>
    <p><strong>Ticket ID:</strong> ${safe(ticket.ticketId)}</p>
    <p><strong>Categoria:</strong> ${safe(ticket.category)}</p>
    <p><strong>Destino interno:</strong> ${safe(ticket.routedTo)}</p>
    <hr>
    <p><strong>Cliente:</strong> ${safe(ticket.customerName)}</p>
    <p><strong>Contacto:</strong> ${safe(ticket.customerContact)}</p>
    <p><strong>Telefono:</strong> ${safe(ticket.phone)}</p>
    <p><strong>Email:</strong> ${safe(ticket.email)}</p>
    <p><strong>Ubicacion:</strong> ${safe(ticket.location)}</p>
    <hr>
    <h3>Resumen</h3>
    <pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${safe(ticket.summary)}</pre>
    <h3>Ticket completo</h3>
    <pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${safe(ticket.ticket)}</pre>
    <p><a href="${COMPANY.bookingUrl}">Reservar cita</a> | ${COMPANY.phone}</p>
  `;
}

async function forwardWebhook(url, payload) {
  if (!url) return { configured: false, ok: false, status: "not_configured" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return {
      configured: true,
      ok: response.ok,
      status: response.ok ? "sent" : "failed",
      httpStatus: response.status
    };
  } catch (error) {
    return { configured: true, ok: false, status: "failed", error: error.message };
  }
}

async function sendWithResend(ticket, env) {
  if (!env.RESEND_API_KEY) return { configured: false, ok: false, status: "not_configured" };

  const from = env.EMAIL_FROM || "EZEMTECH AI <support@ezemtech.com>";
  const to = ticket.routedTo.split(",").map((email) => email.trim()).filter(Boolean);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: env.EMAIL_REPLY_TO || undefined,
        subject: `EZEMTECH ${ticket.category} - ${ticket.ticketId}`,
        text: buildPlainTicket(ticket),
        html: buildHtmlTicket(ticket)
      })
    });

    return {
      configured: true,
      ok: response.ok,
      status: response.ok ? "sent" : "failed",
      httpStatus: response.status
    };
  } catch (error) {
    return { configured: true, ok: false, status: "failed", error: error.message };
  }
}

async function notifyTicket(ticket, env) {
  const webhook = await forwardWebhook(env.EMAIL_WEBHOOK_URL, {
    eventType: "ticket_created",
    ...ticket,
    plainText: buildPlainTicket(ticket),
    createdAt: new Date().toISOString()
  });

  if (webhook.ok) return { provider: "webhook", ...webhook };

  const resend = await sendWithResend(ticket, env);
  if (resend.ok) return { provider: "resend", ...resend };

  if (webhook.configured) return { provider: "webhook", ...webhook };
  if (resend.configured) return { provider: "resend", ...resend };

  return { provider: "none", configured: false, ok: false, status: "not_configured" };
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

async function askGroq({ message, language, category, history, brandPolicy, masterUser, masterKnowledgeUpdates, searchContext, routeEmail, groqApiKey, model }) {
  if (!groqApiKey) {
    return "";
  }

  const systemPrompt = [
    "Eres el asistente tecnico oficial de EZEMTECH LLC, una empresa real de tecnologia ubicada en New Jersey, United States.",
    "Atiende clientes sobre computadoras, telefonos, drones, redes, IA, ventas, productos, accesorios, reservas y soporte.",
    "Responde en espanol si language es 'es'; responde en ingles si language es 'en'.",
    "Usa tono profesional, claro, didactico y paso a paso.",
    "Usa la informacion web solo como apoyo; no inventes precios, garantia, inventario ni disponibilidad.",
    "Cuando aplique, recomienda servicios, productos o reservas de EZEMTECH.com sin sonar forzado.",
    "Respeta el conocimiento maestro enviado por el usuario maestro cuando no contradiga seguridad ni privacidad.",
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
    `Usuario maestro: ${JSON.stringify(sanitizePayload(masterUser || {}))}`,
    `Actualizaciones maestras cargadas:\n${JSON.stringify(sanitizePayload(masterKnowledgeUpdates || []))}`,
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

async function handleChat(request, env, body) {
  const message = sanitizeText(body.message || "");
  if (!message.trim()) {
    return jsonResponse(request, env, { error: "Mensaje vacio" }, 400);
  }

  const language = body.language === "en" ? "en" : "es";
  const routeType = classify(message, body.category);
  const routeEmail = getRouteEmail(routeType);
  const search = await searchInternet(message, env.SERP_API_KEY, language);
  if (!env.GROQ_API_KEY) {
    return jsonResponse(request, env, {
      reply: "",
      fallbackRequired: true,
      missingConfiguration: "GROQ_API_KEY",
      routedTo: routeEmail,
      category: routeType,
      sources: search.sources
    });
  }

  const reply = await askGroq({
    message,
    language,
    category: routeType,
    history: sanitizePayload(body.history || []),
    brandPolicy: sanitizePayload(body.brandPolicy || {}),
    masterUser: sanitizePayload(body.masterUser || {}),
    masterKnowledgeUpdates: sanitizePayload(body.masterKnowledgeUpdates || []),
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
}

async function handleTicket(request, env, body) {
  const summary = sanitizeText(body.summary || body.ticket || body.description || body.issue || "");
  const routeType = body.classification === "sales" ? "sales" : classify(summary, body.category || body.classification);
  const routedTo = getRouteEmail(routeType);
  const ticket = sanitizePayload({
    ticketId: makeTicketId(),
    category: routeType,
    routedTo,
    language: body.language === "en" ? "en" : "es",
    customerName: body.name || body.customerName || "",
    customerContact: body.contact || "",
    phone: body.phone || "",
    email: body.email || "",
    location: body.location || "",
    issue: body.issue || "",
    urgency: body.urgency || "",
    serviceType: body.serviceType || body.service || "",
    device: body.device || body.category || "",
    summary,
    ticket: body.ticket || body.summary || "",
    source: body.source || "",
    company: COMPANY
  });

  const notification = await notifyTicket(ticket, env);

  return jsonResponse(request, env, {
    ok: true,
    ticketId: ticket.ticketId,
    category: ticket.category,
    routedTo,
    notificationStatus: notification.status,
    notificationProvider: notification.provider
  });
}

async function handleLearning(request, env, body) {
  if (!body.consent) {
    return jsonResponse(request, env, { ok: false, stored: false, reason: "consent_required" }, 200);
  }

  const payload = sanitizePayload({
    eventType: body.eventType || "learning_event",
    consent: true,
    language: body.language || "es",
    category: body.category || "general",
    classification: body.classification || "general",
    payload: body.payload || {},
    source: body.source || "",
    createdAt: new Date().toISOString()
  });

  const forwarded = await forwardWebhook(env.LEARNING_WEBHOOK_URL, payload);

  return jsonResponse(request, env, {
    ok: true,
    stored: forwarded.ok,
    learningStatus: forwarded.status
  });
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
      const action = getRequestAction(body);

      if (action === "ticket") return handleTicket(request, env, body);
      if (action === "learning") return handleLearning(request, env, body);

      return handleChat(request, env, body);
    } catch (error) {
      console.error("EZEMTECH worker error", error.message);
      return jsonResponse(request, env, { error: "Error interno del asistente" }, 500);
    }
  }
};
