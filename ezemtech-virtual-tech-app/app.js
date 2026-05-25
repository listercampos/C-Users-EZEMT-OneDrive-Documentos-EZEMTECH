const state = {
  language: "es",
  device: "computers",
  lastTicket: ""
};

const content = {
  es: {
    install: "Instalar app",
    issueLabel: "Describe el problema",
    urgencyLabel: "Urgencia",
    serviceLabel: "Servicio",
    submit: "Diagnosticar",
    copied: "Ticket copiado.",
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
  conversation.innerHTML = "";
  addMessage(t("welcome"));
}

function setDevice(device) {
  state.device = device;
  document.querySelectorAll("[data-device]").forEach((button) => {
    button.classList.toggle("active", button.dataset.device === device);
  });
}

function buildTicket(data) {
  const current = content[state.language];
  const service = current.services[data.service] || data.service;
  const urgency = current.urgency[data.urgency] || data.urgency;
  const recommendation = current.recommendations[state.device];

  return `${current.ticketTitle}
Categoria: ${state.device}
Urgencia: ${urgency}
Servicio: ${service}

Cliente: ${data.name || "N/A"}
Contacto: ${data.contact || "N/A"}

Problema:
${data.issue}

Recomendacion inicial:
${recommendation}

Siguiente paso:
Reservar en https://www.ezemtech.com/book-online o contactar a EZEMTECH para soporte tecnico.`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  state.lastTicket = buildTicket(data);
  addMessage(data.issue, "user");

  const answer = document.createElement("div");
  answer.className = "message";
  answer.innerHTML = `<strong>${content[state.language].ticketTitle}</strong>${state.lastTicket.replace(/\n/g, "<br>")}`;
  conversation.appendChild(answer);
  conversation.scrollTop = conversation.scrollHeight;
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

document.querySelectorAll("[data-device]").forEach((button) => {
  button.addEventListener("click", () => setDevice(button.dataset.device));
});

document.querySelector("#copyTicket").addEventListener("click", async () => {
  if (!state.lastTicket) return;
  await navigator.clipboard.writeText(state.lastTicket);
  addMessage(t("copied"));
});

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

setLanguage("es");
