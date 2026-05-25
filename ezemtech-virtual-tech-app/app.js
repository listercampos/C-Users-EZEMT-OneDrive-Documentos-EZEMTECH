const config = {
  bookingUrl: "https://www.ezemtech.com/book-online",
  websiteUrl: "https://www.ezemtech.com/",
  whatsappNumber: "16468422766",
  webhookUrl: "",
  assistantWebhookUrl: "",
  learningWebhookUrl: "",
  localUpdateManifestUrl: "",
  masterUser: {
    name: "EZEMTECH Master",
    email: "listercampos@gmail.com",
    role: "master",
    accessMode: "backend-secret-only"
  },
  brandPolicy: {
    companyName: "EZEMTECH LLC",
    primaryDomain: "https://www.ezemtech.com/",
    location: "New Jersey, United States",
    supportPhone: "+1 646 842 2766",
    defaultContactEmail: "info@ezemtech.com,listercampos@gmail.com",
    salesContactEmail: "sales@ezemtech.com,listercampos@gmail.com",
    recommendEzServices: true,
    internetLearningMode: "backend-only",
    preferredServices: [
      "remote support",
      "on-site technical support",
      "computer repair",
      "phone support",
      "drone support",
      "AI automation",
      "business IT support",
      "sales consultation",
      "product information",
      "technology accessories"
    ]
  },
  security: {
    requireHttps: true,
    redactSensitiveData: true,
    maxTextLength: 5000
  },
  technicianEmails: {
    computers: "",
    phones: "",
    drones: "",
    ai: "",
    network: "",
    sales: "",
    information: "",
    general: ""
  },
  ...(window.EZEMTECH_VIRTUAL_TECH_CONFIG || {})
};

const state = {
  language: "es",
  device: "computers",
  lastTicket: "",
  lastClassification: "computers",
  voiceEnabled: false,
  recognition: null,
  conversationHistory: [],
  learningConsent: false,
  masterKnowledge: []
};

const content = {
  es: {
    install: "Instalar app",
    issueLabel: "Describe el problema",
    urgencyLabel: "Urgencia",
    serviceLabel: "Servicio",
    submit: "Diagnosticar",
    copied: "Ticket copiado.",
    notifyTech: "Notificar tecnico",
    notified: "Notificacion preparada para el tecnico.",
    backendNotified: "Ticket enviado al backend seguro. Ruta interna:",
    backendPending: "Ticket creado. Backend recibido, notificacion automatica pendiente de configurar.",
    voiceOn: "Activar voz",
    voiceOff: "Pausar voz",
    listening: "Escuchando...",
    dictate: "Hablar con el tecnico virtual",
    chatPlaceholder: "Escribe o usa el microfono...",
    learningConsent: "Permitir guardar esta conversacion para mejorar el servicio.",
    ezRecommendation:
      "EZEMTECH puede ayudarte con soporte remoto, servicio presencial, diagnostico y seguimiento del caso.",
    thinking: "Estoy revisando tu caso...",
    ticketNeeded: "Primero necesito crear un ticket con el problema para poder notificarlo.",
    speechUnsupported: "La voz no esta disponible en este navegador.",
    micUnsupported: "El microfono no esta disponible en este navegador.",
    aiOffline:
      "Todavia no hay IA externa conectada. Te respondo con el tecnico virtual local de EZEMTECH.",
    welcome:
      "Hola, soy el Tecnico Virtual de EZEMTECH LLC en New Jersey. Puedes hablarme como a ChatGPT: dime el problema, pide una cita, envia WhatsApp o crea un ticket.",
    ticketTitle: "Ticket EZEMTECH",
    recommendations: {
      computers:
        "Revisa si el equipo reinicia, si el disco esta lleno, si hay alertas de virus y si el problema pasa en una sola app o en todo Windows/Mac.",
      phones:
        "Confirma modelo, version del sistema, espacio disponible, estado de bateria y si el problema empezo despues de una actualizacion o caida.",
      drones:
        "No vueles el drone hasta revisar calibracion, bateria, helice, conexion con control remoto y estado de camara/sensores.",
      ai:
        "Define el objetivo, los datos disponibles, el idioma, el canal de uso y si necesitas chatbot, automatizacion, prompts o integracion con sistemas.",
      network:
        "Reinicia modem/router, confirma si otros equipos tienen internet y verifica si el problema es Wi-Fi, cable, DNS o configuracion del equipo.",
      sales:
        "Para ventas, productos, accesorios, cotizaciones o precios, EZEMTECH puede revisar tus necesidades y recomendar la opcion adecuada.",
      information:
        "Para informacion general, EZEMTECH puede explicar servicios, disponibilidad, soporte remoto/presencial, reservas y opciones de contacto."
    },
    services: {
      remote: "Remoto",
      onsite: "Presencial",
      "not-sure": "No estoy seguro"
    },
    urgency: {
      today: "Hoy",
      week: "Esta semana",
      general: "Consulta general"
    }
  },
  en: {
    install: "Install app",
    issueLabel: "Describe the issue",
    urgencyLabel: "Urgency",
    serviceLabel: "Service",
    submit: "Diagnose",
    copied: "Ticket copied.",
    notifyTech: "Notify technician",
    notified: "Technician notification prepared.",
    backendNotified: "Ticket sent to the secure backend. Internal route:",
    backendPending: "Ticket created. Backend received it; automatic notification is pending configuration.",
    voiceOn: "Turn voice on",
    voiceOff: "Pause voice",
    listening: "Listening...",
    dictate: "Talk to the virtual tech",
    chatPlaceholder: "Type or use the microphone...",
    learningConsent: "Allow this conversation to be stored to improve service.",
    ezRecommendation:
      "EZEMTECH can help with remote support, on-site service, diagnostics, and case follow-up.",
    thinking: "I am reviewing your case...",
    ticketNeeded: "I need to create a ticket with the issue first before notifying it.",
    speechUnsupported: "Voice is not available in this browser.",
    micUnsupported: "Microphone is not available in this browser.",
    aiOffline:
      "No external AI is connected yet. I am answering with the local EZEMTECH virtual tech.",
    welcome:
      "Hi, I am the EZEMTECH LLC Virtual Tech in New Jersey. You can talk to me like ChatGPT: tell me the issue, ask me to book, send WhatsApp, or create a ticket.",
    ticketTitle: "EZEMTECH Ticket",
    recommendations: {
      computers:
        "Check whether the device restarts, whether storage is full, whether there are virus alerts, and whether the issue affects one app or the whole system.",
      phones:
        "Confirm model, operating system version, available storage, battery condition, and whether the issue started after an update or drop.",
      drones:
        "Do not fly the drone until calibration, battery, propellers, remote connection, and camera/sensor status are reviewed.",
      ai:
        "Define the goal, available data, language, usage channel, and whether you need a chatbot, automation, prompts, or system integration.",
      network:
        "Restart the modem/router, confirm whether other devices are online, and check if the issue is Wi-Fi, cable, DNS, or device configuration.",
      sales:
        "For sales, products, accessories, quotes, or pricing, EZEMTECH can review your needs and recommend the right option.",
      information:
        "For general information, EZEMTECH can explain services, availability, remote/on-site support, booking, and contact options."
    },
    services: {
      remote: "Remote",
      onsite: "On-site",
      "not-sure": "Not sure"
    },
    urgency: {
      today: "Today",
      week: "This week",
      general: "General question"
    }
  }
};

const conversation = document.querySelector("#conversation");
const form = document.querySelector("#diagnosticForm");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const learningConsent = document.querySelector("#learningConsent");
const learningConsentText = document.querySelector("#learningConsentText");
const installButton = document.querySelector(".install-button");
const copyTicketButton = document.querySelector("#copyTicket");
const toggleVoiceButton = document.querySelector("#toggleVoice");
const dictateIssueButton = document.querySelector("#dictateIssue");
const notifyButton = document.createElement("button");
const whatsappButton = document.createElement("button");
let installPrompt = null;

function t(key) {
  return content[state.language][key];
}

function addMessage(text, type = "bot") {
  const message = document.createElement("div");
  message.className = `message ${type}`.trim();
  message.textContent = text;
  conversation.appendChild(message);
  conversation.scrollTop = conversation.scrollHeight;
  if (type === "bot") speak(text);
}

function setLanguage(language) {
  state.language = language;
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === language);
  });
  document.querySelector("#issueLabel").textContent = t("issueLabel");
  document.querySelector("#urgencyLabel").textContent = t("urgencyLabel");
  document.querySelector("#serviceLabel").textContent = t("serviceLabel");
  document.querySelector(".primary-button").textContent = t("submit");
  chatInput.placeholder = t("chatPlaceholder");
  learningConsentText.textContent = t("learningConsent");
  installButton.textContent = t("install");
  notifyButton.textContent = t("notifyTech");
  updateVoiceControls();
  conversation.innerHTML = "";
  addMessage(t("welcome"));
}

function getSpeechLanguage() {
  return state.language === "es" ? "es-US" : "en-US";
}

function getSecurityConfig() {
  return {
    requireHttps: true,
    redactSensitiveData: true,
    maxTextLength: 5000,
    ...(config.security || {})
  };
}

function getBrandPolicy() {
  return {
    companyName: "EZEMTECH LLC",
    primaryDomain: "https://www.ezemtech.com/",
    location: "New Jersey, United States",
    supportPhone: "+1 646 842 2766",
    defaultContactEmail: "info@ezemtech.com,listercampos@gmail.com",
    salesContactEmail: "sales@ezemtech.com,listercampos@gmail.com",
    recommendEzServices: true,
    internetLearningMode: "backend-only",
    preferredServices: [],
    ...(config.brandPolicy || {})
  };
}

function isSecureUrl(url, options = {}) {
  const { allowRelative = true } = options;
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return false;

  try {
    const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(rawUrl);
    if (!hasProtocol && allowRelative) return true;

    const parsed = new URL(rawUrl, window.location.href);
    if (!getSecurityConfig().requireHttps) return true;

    return parsed.protocol === "https:" || parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch (error) {
    return false;
  }
}

function resolveRelativeUrl(url, baseUrl = window.location.href) {
  return new URL(url, baseUrl).toString();
}

function limitText(value) {
  const maxLength = getSecurityConfig().maxTextLength;
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength)}... [TRUNCATED]` : text;
}

function sanitizeText(value) {
  let text = limitText(value);
  if (!getSecurityConfig().redactSensitiveData) return text;

  return text
    .replace(/\b(password|passcode|contrasena|contrase\u00f1a|clave|pin)\s*[:=]?\s*\S+/gi, "$1: [REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[PAYMENT_CARD_REDACTED]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]")
    .replace(/\b(sk-[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{20,})\b/g, "[API_KEY_REDACTED]")
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[PRIVATE_KEY_REDACTED]");
}

function sanitizePayload(payload) {
  if (typeof payload === "string") return sanitizeText(payload);
  if (Array.isArray(payload)) return payload.map((item) => sanitizePayload(item));
  if (payload && typeof payload === "object") {
    return Object.entries(payload).reduce((safePayload, [key, value]) => {
      safePayload[key] = sanitizePayload(value);
      return safePayload;
    }, {});
  }

  return payload;
}

async function loadMasterKnowledge() {
  if (!config.localUpdateManifestUrl || !isSecureUrl(config.localUpdateManifestUrl, { allowRelative: true })) return;

  try {
    const manifestUrl = resolveRelativeUrl(config.localUpdateManifestUrl);
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Master manifest status ${response.status}`);

    const manifest = await response.json();
    const updates = Array.isArray(manifest.updates) ? manifest.updates : [];
    const loaded = [];

    for (const update of updates.filter((item) => item && item.enabled !== false).slice(0, 12)) {
      if (!update.file) continue;
      const fileUrl = resolveRelativeUrl(update.file, manifestUrl);
      if (!isSecureUrl(fileUrl, { allowRelative: false })) continue;

      const fileResponse = await fetch(fileUrl, { cache: "no-store" });
      if (!fileResponse.ok) continue;
      const content = sanitizeText(await fileResponse.text());
      loaded.push({
        id: sanitizeText(update.id || update.file, 120),
        version: sanitizeText(update.version || "", 80),
        title: sanitizeText(update.title || update.file, 160),
        keywords: Array.isArray(update.keywords) ? update.keywords.map((keyword) => sanitizeText(keyword, 80)) : [],
        summary: sanitizeText(update.summary || content.slice(0, 500), 700),
        source: sanitizeText(update.file, 200),
        content
      });
    }

    state.masterKnowledge = loaded;
  } catch (error) {
    console.warn("EZEMTECH master knowledge failed", error);
  }
}

function findMasterKnowledge(message) {
  const text = normalize(message);
  return state.masterKnowledge.find((update) => {
    const haystack = normalize(`${update.title} ${update.summary} ${update.content}`);
    const keywords = update.keywords.map(normalize).filter(Boolean);
    return keywords.some((keyword) => text.includes(keyword) || haystack.includes(keyword)) || haystack.includes(text);
  });
}

function getMasterKnowledgeContext(message) {
  const matched = findMasterKnowledge(message);
  const updates = matched ? [matched, ...state.masterKnowledge.filter((update) => update.id !== matched.id)] : state.masterKnowledge;
  return updates.slice(0, 4).map((update) => ({
    id: update.id,
    version: update.version,
    title: update.title,
    summary: update.summary,
    source: update.source,
    content: update.content.slice(0, 1600)
  }));
}

function isAssistantConfigReply(reply) {
  const text = normalize(reply);
  return /(sin clave de groq|groq no esta configurado|groq_api_key|no se puede generar respuesta ia|missing groq|missing api key)/.test(text);
}

function speak(text) {
  if (!state.voiceEnabled || !("speechSynthesis" in window)) return;

  const cleanText = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleanText) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 700));
  utterance.lang = getSpeechLanguage();
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function updateVoiceControls() {
  toggleVoiceButton.title = state.voiceEnabled ? t("voiceOff") : t("voiceOn");
  toggleVoiceButton.setAttribute("aria-label", state.voiceEnabled ? t("voiceOff") : t("voiceOn"));
  toggleVoiceButton.setAttribute("aria-pressed", String(state.voiceEnabled));
  toggleVoiceButton.classList.toggle("active", state.voiceEnabled);
  dictateIssueButton.title = t("dictate");
  dictateIssueButton.setAttribute("aria-label", t("dictate"));
}

function toggleVoice() {
  if (!("speechSynthesis" in window)) {
    addMessage(t("speechUnsupported"));
    return;
  }

  state.voiceEnabled = !state.voiceEnabled;
  updateVoiceControls();

  if (state.voiceEnabled) {
    addMessage(t("voiceOn"));
  } else {
    window.speechSynthesis.cancel();
    addMessage(t("voiceOff"));
  }
}

function startDictation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    addMessage(t("micUnsupported"));
    return;
  }

  if (state.recognition) {
    state.recognition.stop();
    return;
  }

  const issueField = form.querySelector('textarea[name="issue"]');
  const recognition = new SpeechRecognition();
  state.recognition = recognition;
  state.voiceEnabled = true;
  updateVoiceControls();
  recognition.lang = getSpeechLanguage();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  dictateIssueButton.setAttribute("aria-pressed", "true");
  dictateIssueButton.classList.add("active");
  addMessage(t("listening"));

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    issueField.value = issueField.value || sanitizeText(transcript);
    chatInput.value = transcript;
    handleUserMessage(transcript);
  };

  recognition.onerror = () => addMessage(t("micUnsupported"));
  recognition.onend = () => {
    state.recognition = null;
    dictateIssueButton.setAttribute("aria-pressed", "false");
    dictateIssueButton.classList.remove("active");
  };

  recognition.start();
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function inferDeviceFromMessage(message) {
  const text = normalize(message);

  if (/(drone|dron|dji|helice|gimbal|control remoto|calibracion)/.test(text)) return "drones";
  if (/(venta|ventas|sales|comprar|buy|purchase|precio|precios|price|pricing|cotizacion|quote|estimate|presupuesto|plan|planes|producto|productos|product|products|accesorio|accesorios|accessory|accessories|cable|cables|cargador|charger|parte|partes|parts)/.test(text)) return "sales";
  if (/(informacion|information|info|consulta|question|pregunta|servicios|services|horario|hours)/.test(text)) return "information";
  if (/(telefono|phone|iphone|android|samsung|pantalla|bateria|sim)/.test(text)) return "phones";
  if (/(ia|ai|chatbot|automatizacion|automation|prompt|openai|gemini|agente)/.test(text)) return "ai";
  if (/(wifi|wi-fi|internet|router|red|network|modem|dns)/.test(text)) return "network";
  if (/(computadora|computer|laptop|pc|windows|mac|virus|impresora|printer|backup|email)/.test(text)) return "computers";

  return state.device;
}

function setIssueFromMessage(message) {
  const issueField = form.querySelector('textarea[name="issue"]');
  if (!issueField.value.trim()) {
    issueField.value = sanitizeText(message);
  }
}

function isCommand(message, words) {
  const text = normalize(message);
  return words.some((word) => text.includes(word));
}

function handleLocalCommand(message) {
  if (isCommand(message, ["reservar", "cita", "booking", "appointment"])) {
    addMessage(state.language === "es" ? "Abriendo la pagina de reservas de EZEMTECH." : "Opening the EZEMTECH booking page.");
    window.open(config.bookingUrl, "_blank", "noopener");
    return true;
  }

  if (isCommand(message, ["abrir pagina", "abrir ezemtech", "website", "sitio web"])) {
    addMessage(state.language === "es" ? "Abriendo EZEMTECH.com." : "Opening EZEMTECH.com.");
    window.open(config.websiteUrl, "_blank", "noopener");
    return true;
  }

  if (isCommand(message, ["whatsapp", "mensaje"])) {
    if (state.lastTicket) {
      addMessage(state.language === "es" ? "Preparando WhatsApp con el ticket." : "Preparing WhatsApp with the ticket.");
      sendWhatsapp();
    } else {
      window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent("Hola EZEMTECH, necesito soporte tecnico.")}`, "_blank", "noopener");
      addMessage(state.language === "es" ? "Abriendo WhatsApp para contactar a EZEMTECH." : "Opening WhatsApp to contact EZEMTECH.");
    }
    return true;
  }

  if (isCommand(message, ["notificar", "correo", "email", "tecnico", "technician"])) {
    if (!state.lastTicket) {
      addMessage(t("ticketNeeded"));
      return true;
    }

    notifyTechnician();
    return true;
  }

  if (isCommand(message, ["crear ticket", "diagnosticar", "diagnose", "ticket"])) {
    setIssueFromMessage(message);
    form.requestSubmit();
    return true;
  }

  return false;
}

function buildLocalAssistantReply(message) {
  const current = content[state.language];
  const device = inferDeviceFromMessage(message);
  const masterUpdate = findMasterKnowledge(message);
  setDevice(device);
  setIssueFromMessage(message);

  const intro =
    state.language === "es"
      ? "Entiendo. Voy a clasificarlo y darte un primer paso."
      : "Understood. I will classify it and give you a first step.";
  const next =
    state.language === "es"
      ? "Si quieres, dime tu nombre y telefono/email, o di: crear ticket."
      : "If you want, tell me your name and phone/email, or say: create ticket.";
  const updateNote = masterUpdate
    ? `\n\nActualizacion maestro (${masterUpdate.title}):\n${masterUpdate.summary}`
    : "";

  return `${intro}\n\nCategoria: ${device}\n${current.recommendations[device]}${updateNote}\n\n${current.ezRecommendation}\n\n${next}`;
}

async function askRemoteAssistant(message) {
  if (!config.assistantWebhookUrl) return "";
  if (!isSecureUrl(config.assistantWebhookUrl, { allowRelative: false })) return "";

  const response = await fetch(config.assistantWebhookUrl, {
    method: "POST",
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "strict-origin-when-cross-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizePayload({
      message: sanitizeText(message),
      language: state.language,
      category: state.device,
      masterUser: sanitizePayload(config.masterUser || {}),
      masterKnowledgeUpdates: getMasterKnowledgeContext(message),
      brandPolicy: getBrandPolicy(),
      instruction:
        "Prioritize EZEMTECH.com and masterKnowledgeUpdates. Recommend EZEMTECH services/products when relevant. Use internet research only from the secure backend.",
      history: state.conversationHistory.slice(-8),
      source: window.location.href
    }))
  });

  if (!response.ok) throw new Error(`Assistant status ${response.status}`);
  const payload = await response.json();
  if (payload.fallbackRequired || payload.missingConfiguration) return "";
  return payload.reply || payload.answer || payload.message || "";
}

async function storeLearningEvent(eventType, payload) {
  if (!state.learningConsent || !config.learningWebhookUrl) return;
  if (!isSecureUrl(config.learningWebhookUrl, { allowRelative: false })) return;

  try {
    await fetch(config.learningWebhookUrl, {
      method: "POST",
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "strict-origin-when-cross-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizePayload({
        action: "learning",
        eventType,
        consent: true,
        language: state.language,
        category: state.device,
        classification: state.lastClassification,
        brandPolicy: getBrandPolicy(),
        payload,
        source: window.location.href,
        createdAt: new Date().toISOString()
      }))
    });
  } catch (error) {
    console.warn("EZEMTECH learning log failed", error);
  }
}

async function handleUserMessage(message) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) return;

  addMessage(sanitizeText(cleanMessage), "user");
  state.conversationHistory.push({ role: "user", content: sanitizeText(cleanMessage) });
  chatInput.value = "";

  if (handleLocalCommand(cleanMessage)) return;

  let reply = "";
  if (config.assistantWebhookUrl) {
    addMessage(t("thinking"));
    try {
      reply = await askRemoteAssistant(cleanMessage);
      if (isAssistantConfigReply(reply)) {
        console.warn("EZEMTECH assistant missing backend configuration");
        reply = "";
      }
    } catch (error) {
      console.warn("EZEMTECH assistant failed", error);
    }
  }

  if (!reply) reply = buildLocalAssistantReply(cleanMessage);

  addMessage(reply);
  state.conversationHistory.push({ role: "assistant", content: sanitizeText(reply) });
  await storeLearningEvent("conversation_turn", {
    userMessage: cleanMessage,
    assistantReply: reply,
    history: state.conversationHistory.slice(-8)
  });
}

function setDevice(device) {
  state.device = device;
  document.querySelectorAll("[data-device]").forEach((button) => {
    button.classList.toggle("active", button.dataset.device === device);
  });
}

function classifyTicket(data) {
  const text = `${state.device} ${data.issue || ""}`.toLowerCase();
  const categories = [
    {
      id: "sales",
      keywords: ["venta", "ventas", "sales", "comprar", "buy", "purchase", "precio", "precios", "price", "pricing", "cotizacion", "quote", "estimate", "presupuesto", "plan", "planes", "producto", "productos", "product", "products", "accesorio", "accesorios", "accessory", "accessories", "cable", "cables", "cargador", "charger", "parte", "partes", "parts"]
    },
    {
      id: "information",
      keywords: ["informacion", "information", "info", "consulta", "question", "pregunta", "servicios", "services", "horario", "hours"]
    },
    {
      id: "drones",
      keywords: ["drone", "dron", "dji", "calibracion", "calibration", "propeller", "helice", "remote controller", "gimbal"]
    },
    {
      id: "phones",
      keywords: ["phones", "phone", "telefono", "iphone", "android", "samsung", "screen", "pantalla", "battery", "bateria", "sim"]
    },
    {
      id: "ai",
      keywords: ["ai", "ia", "chatbot", "automation", "automatizacion", "prompt", "openai", "gemini", "agent"]
    },
    {
      id: "network",
      keywords: ["internet", "wifi", "wi-fi", "router", "network", "red", "dns", "ethernet", "modem"]
    },
    {
      id: "computers",
      keywords: ["computers", "computer", "computadora", "pc", "laptop", "desktop", "windows", "mac", "virus", "malware", "printer", "impresora", "email", "backup"]
    }
  ];

  const matched = categories.find((category) => category.keywords.some((keyword) => text.includes(keyword)));
  return matched ? matched.id : "general";
}

function getTechnicianEmail(classification) {
  const emails = config.technicianEmails || {};
  return emails[classification] || emails.general || "";
}

function buildTicket(data) {
  const current = content[state.language];
  const service = current.services[data.service] || data.service;
  const urgency = current.urgency[data.urgency] || data.urgency;
  const recommendation = current.recommendations[state.device] || current.recommendations.computers;
  const classification = classifyTicket(data);
  const technicianEmail = getTechnicianEmail(classification);
  state.lastClassification = classification;

  return `${current.ticketTitle}
Categoria: ${state.device}
Clasificacion: ${classification}
Destino interno: ${technicianEmail || "N/A"}
Urgencia: ${urgency}
Servicio: ${service}

Cliente: ${data.name || "N/A"}
Contacto: ${data.contact || "N/A"}

Problema:
${data.issue}

Recomendacion inicial:
${recommendation}

Siguiente paso:
Reservar en ${config.bookingUrl}, llamar o enviar WhatsApp a +1 646 842 2766, o contactar a EZEMTECH para soporte tecnico.`;
}

async function postWebhook(payload) {
  if (!config.webhookUrl) return null;
  if (!isSecureUrl(config.webhookUrl, { allowRelative: false })) return null;

  try {
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "strict-origin-when-cross-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizePayload(payload))
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.warn("EZEMTECH webhook failed", error);
    return null;
  }
}

function notifyTechnician() {
  if (!state.lastTicket) return;

  const technicianEmail = getTechnicianEmail(state.lastClassification);
  if (!technicianEmail) return;

  const subject = encodeURIComponent(`EZEMTECH ${state.lastClassification} - Nuevo ticket`);
  window.location.href = `mailto:${technicianEmail}?subject=${subject}&body=${encodeURIComponent(state.lastTicket)}`;
  addMessage(t("notified"));
}

function sendWhatsapp() {
  if (!state.lastTicket || !config.whatsappNumber) return;

  window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(state.lastTicket)}`, "_blank", "noopener");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  state.lastTicket = sanitizeText(buildTicket(data));
  addMessage(sanitizeText(data.issue), "user");

  const answer = document.createElement("div");
  answer.className = "message";
  const answerTitle = document.createElement("strong");
  answerTitle.textContent = content[state.language].ticketTitle;
  const answerBody = document.createElement("div");
  answerBody.className = "ticket-text";
  answerBody.textContent = state.lastTicket;
  answer.append(answerTitle, answerBody);
  conversation.appendChild(answer);
  conversation.scrollTop = conversation.scrollHeight;
  speak(`${content[state.language].ticketTitle}. ${content[state.language].recommendations[state.device] || content[state.language].recommendations.computers}`);
  const webhookResult = await postWebhook({
    action: "ticket",
    language: state.language,
    category: state.device,
    classification: state.lastClassification,
    technicianEmail: getTechnicianEmail(state.lastClassification),
    ...data,
    ticket: state.lastTicket,
    source: window.location.href
  });
  if (webhookResult?.ok && webhookResult.notificationStatus === "sent") {
    addMessage(`${t("backendNotified")} ${webhookResult.routedTo || getTechnicianEmail(state.lastClassification)}`);
  } else if (webhookResult?.ok) {
    addMessage(t("backendPending"));
  }
  await storeLearningEvent("ticket_created", {
    ticket: state.lastTicket,
    form: data
  });
});

learningConsent.addEventListener("change", () => {
  state.learningConsent = learningConsent.checked;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleUserMessage(chatInput.value);
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

document.querySelectorAll("[data-device]").forEach((button) => {
  button.addEventListener("click", () => setDevice(button.dataset.device));
});

copyTicketButton.addEventListener("click", async () => {
  if (!state.lastTicket) return;
  await navigator.clipboard.writeText(state.lastTicket);
  addMessage(t("copied"));
});

toggleVoiceButton.addEventListener("click", toggleVoice);
dictateIssueButton.addEventListener("click", startDictation);

notifyButton.className = "action-button";
notifyButton.type = "button";
notifyButton.textContent = content.es.notifyTech;
notifyButton.addEventListener("click", notifyTechnician);
document.querySelector(".actions").appendChild(notifyButton);

whatsappButton.className = "action-button";
whatsappButton.type = "button";
whatsappButton.textContent = "WhatsApp";
whatsappButton.addEventListener("click", sendWhatsapp);
document.querySelector(".actions").appendChild(whatsappButton);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

loadMasterKnowledge();

window.EZEMTECH_VIRTUAL_TECH = {
  sendMessage: handleUserMessage,
  setLanguage,
  setDevice,
  startVoiceCommand: startDictation,
  toggleVoice
};

updateVoiceControls();
setLanguage("es");
