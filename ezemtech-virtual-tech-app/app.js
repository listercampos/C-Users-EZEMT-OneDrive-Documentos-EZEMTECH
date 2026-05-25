const config = {
  bookingUrl: "https://www.ezemtech.com/book-online",
  websiteUrl: "https://www.ezemtech.com/",
  whatsappNumber: "",
  webhookUrl: "",
  assistantWebhookUrl: "",
  technicianEmails: {
    computers: "",
    phones: "",
    drones: "",
    ai: "",
    network: "",
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
  conversationHistory: []
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
    voiceOn: "Activar voz",
    voiceOff: "Pausar voz",
    listening: "Escuchando...",
    dictate: "Hablar con el tecnico virtual",
    chatPlaceholder: "Escribe o usa el microfono...",
    thinking: "Estoy revisando tu caso...",
    ticketNeeded: "Primero necesito crear un ticket con el problema para poder notificarlo.",
    speechUnsupported: "La voz no esta disponible en este navegador.",
    micUnsupported: "El microfono no esta disponible en este navegador.",
    aiOffline:
      "Todavia no hay IA externa conectada. Te respondo con el tecnico virtual local de EZEMTECH.",
    welcome:
      "Hola, soy el Tecnico Virtual de EZEMTECH. Puedes hablarme como a ChatGPT: dime el problema, pideme abrir una cita, enviar WhatsApp o crear un ticket.",
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
        "Reinicia modem/router, confirma si otros equipos tienen internet y verifica si el problema es Wi-Fi, cable, DNS o configuracion del equipo."
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
    voiceOn: "Turn voice on",
    voiceOff: "Pause voice",
    listening: "Listening...",
    dictate: "Talk to the virtual tech",
    chatPlaceholder: "Type or use the microphone...",
    thinking: "I am reviewing your case...",
    ticketNeeded: "I need to create a ticket with the issue first before notifying it.",
    speechUnsupported: "Voice is not available in this browser.",
    micUnsupported: "Microphone is not available in this browser.",
    aiOffline:
      "No external AI is connected yet. I am answering with the local EZEMTECH virtual tech.",
    welcome:
      "Hi, I am the EZEMTECH Virtual Tech. You can talk to me like ChatGPT: tell me the issue, ask me to open booking, send WhatsApp, or create a ticket.",
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
        "Restart the modem/router, confirm whether other devices are online, and check if the issue is Wi-Fi, cable, DNS, or device configuration."
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
  installButton.textContent = t("install");
  notifyButton.textContent = t("notifyTech");
  updateVoiceControls();
  conversation.innerHTML = "";
  addMessage(t("welcome"));
}

function getSpeechLanguage() {
  return state.language === "es" ? "es-US" : "en-US";
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
    issueField.value = issueField.value || transcript;
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
  if (/(telefono|phone|iphone|android|samsung|pantalla|bateria|sim)/.test(text)) return "phones";
  if (/(ia|ai|chatbot|automatizacion|automation|prompt|openai|gemini|agente)/.test(text)) return "ai";
  if (/(wifi|wi-fi|internet|router|red|network|modem|dns)/.test(text)) return "network";
  if (/(computadora|computer|laptop|pc|windows|mac|virus|impresora|printer|backup|email)/.test(text)) return "computers";

  return state.device;
}

function setIssueFromMessage(message) {
  const issueField = form.querySelector('textarea[name="issue"]');
  if (!issueField.value.trim()) {
    issueField.value = message;
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

  return `${intro}\n\nCategoria: ${device}\n${current.recommendations[device]}\n\n${next}`;
}

async function askRemoteAssistant(message) {
  if (!config.assistantWebhookUrl) return "";

  const response = await fetch(config.assistantWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      language: state.language,
      category: state.device,
      history: state.conversationHistory.slice(-8),
      source: window.location.href
    })
  });

  if (!response.ok) throw new Error(`Assistant status ${response.status}`);
  const payload = await response.json();
  return payload.reply || payload.answer || payload.message || "";
}

async function handleUserMessage(message) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) return;

  addMessage(cleanMessage, "user");
  state.conversationHistory.push({ role: "user", content: cleanMessage });
  chatInput.value = "";

  if (handleLocalCommand(cleanMessage)) return;

  let reply = "";
  if (config.assistantWebhookUrl) {
    addMessage(t("thinking"));
    try {
      reply = await askRemoteAssistant(cleanMessage);
    } catch (error) {
      console.warn("EZEMTECH assistant failed", error);
    }
  }

  if (!reply) reply = buildLocalAssistantReply(cleanMessage);

  addMessage(reply);
  state.conversationHistory.push({ role: "assistant", content: reply });
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
  state.lastClassification = classification;

  return `${current.ticketTitle}
Categoria: ${state.device}
Clasificacion: ${classification}
Urgencia: ${urgency}
Servicio: ${service}

Cliente: ${data.name || "N/A"}
Contacto: ${data.contact || "N/A"}

Problema:
${data.issue}

Recomendacion inicial:
${recommendation}

Siguiente paso:
Reservar en ${config.bookingUrl} o contactar a EZEMTECH para soporte tecnico.`;
}

async function postWebhook(payload) {
  if (!config.webhookUrl) return;

  try {
    await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn("EZEMTECH webhook failed", error);
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
  state.lastTicket = buildTicket(data);
  addMessage(data.issue, "user");

  const answer = document.createElement("div");
  answer.className = "message";
  answer.innerHTML = `<strong>${content[state.language].ticketTitle}</strong>${state.lastTicket.replace(/\n/g, "<br>")}`;
  conversation.appendChild(answer);
  conversation.scrollTop = conversation.scrollHeight;
  speak(`${content[state.language].ticketTitle}. ${content[state.language].recommendations[state.device] || content[state.language].recommendations.computers}`);
  await postWebhook({
    language: state.language,
    category: state.device,
    classification: state.lastClassification,
    technicianEmail: getTechnicianEmail(state.lastClassification),
    ...data,
    ticket: state.lastTicket,
    source: window.location.href
  });
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

window.EZEMTECH_VIRTUAL_TECH = {
  sendMessage: handleUserMessage,
  setLanguage,
  setDevice,
  startVoiceCommand: startDictation,
  toggleVoice
};

updateVoiceControls();
setLanguage("es");
