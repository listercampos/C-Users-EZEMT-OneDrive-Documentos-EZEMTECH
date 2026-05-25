const config = {
  bookingUrl: "https://www.ezemtech.com/book-online",
  websiteUrl: "https://www.ezemtech.com/",
  whatsappNumber: "",
  webhookUrl: "",
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
  recognition: null
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
    dictate: "Dictar problema",
    speechUnsupported: "La voz no esta disponible en este navegador.",
    micUnsupported: "El microfono no esta disponible en este navegador.",
    welcome:
      "Hola, soy el Tecnico Virtual de EZEMTECH. Elige una categoria, describe el problema y te preparo un diagnostico inicial con proximos pasos.",
    ticketTitle: "Ticket EZEMTECH",
    recommendations: {
      computers:
        "Revisa si el equipo reinicia, si el disco esta lleno, si hay alertas de virus y si el problema pasa en una sola app o en todo Windows/Mac.",
      phones:
        "Confirma modelo, version del sistema, espacio disponible, estado de bateria y si el problema empezo despues de una actualizacion o caida.",
      drones:
        "No vueles el drone hasta revisar calibracion, bateria, helice, conexion con control remoto y estado de camara/sensores.",
      ai:
        "Define el objetivo, los datos disponibles, el idioma, el canal de uso y si necesitas chatbot, automatizacion, prompts o integracion con sistemas."
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
    dictate: "Dictate issue",
    speechUnsupported: "Voice is not available in this browser.",
    micUnsupported: "Microphone is not available in this browser.",
    welcome:
      "Hi, I am the EZEMTECH Virtual Tech. Choose a category, describe the issue, and I will prepare an initial diagnostic with next steps.",
    ticketTitle: "EZEMTECH Ticket",
    recommendations: {
      computers:
        "Check whether the device restarts, whether storage is full, whether there are virus alerts, and whether the issue affects one app or the whole system.",
      phones:
        "Confirm model, operating system version, available storage, battery condition, and whether the issue started after an update or drop.",
      drones:
        "Do not fly the drone until calibration, battery, propellers, remote connection, and camera/sensor status are reviewed.",
      ai:
        "Define the goal, available data, language, usage channel, and whether you need a chatbot, automation, prompts, or system integration."
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
  recognition.lang = getSpeechLanguage();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  dictateIssueButton.setAttribute("aria-pressed", "true");
  dictateIssueButton.classList.add("active");
  addMessage(t("listening"));

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    issueField.value = `${issueField.value} ${transcript}`.trim();
    issueField.focus();
    addMessage(transcript, "user");
  };

  recognition.onerror = () => addMessage(t("micUnsupported"));
  recognition.onend = () => {
    state.recognition = null;
    dictateIssueButton.setAttribute("aria-pressed", "false");
    dictateIssueButton.classList.remove("active");
  };

  recognition.start();
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
  const recommendation = current.recommendations[state.device];
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
  speak(`${content[state.language].ticketTitle}. ${content[state.language].recommendations[state.device]}`);
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

updateVoiceControls();
setLanguage("es");
