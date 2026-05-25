(function () {
  const config = {
    businessName: "EZEMTECH",
    bookingUrl: "https://www.ezemtech.com/book-online",
    contactEmail: "",
    whatsappNumber: "",
    webhookUrl: "",
    assistantWebhookUrl: "",
    knowledgeBaseUrl: "",
    localKnowledgeBaseUrl: "",
    brandPolicy: {
      companyName: "EZEMTECH LLC",
      primaryDomain: "https://www.ezemtech.com/",
      location: "New Jersey, United States",
      supportPhone: "+1 646 842 2766",
      defaultContactEmail: "info@ezemtech.com,listercampos@gmail.com",
      salesContactEmail: "sales@ezemtech.com,listercampos@gmail.com",
      recommendEzServices: true,
      internetLearningMode: "backend-only"
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
    ...(window.EZEMTECH_AGENT_CONFIG || {})
  };

  const state = {
    language: "es",
    issue: "",
    urgency: "",
    serviceType: "",
    knowledgeBase: [],
    voiceEnabled: false,
    recognition: null,
    conversationHistory: []
  };

  const copy = {
    es: {
      launcher: "Soporte tecnico",
      title: "Asistente EZEMTECH",
      subtitle: "Soporte remoto y presencial",
      hello:
        "Hola, soy el asistente tecnico de EZEMTECH. Te ayudo a diagnosticar el problema y enviar una solicitud al equipo.",
      chooseLanguage: "Elige tu idioma:",
      chooseIssue: "Que problema necesitas resolver?",
      urgency: "Que tan urgente es?",
      serviceType: "Prefieres soporte remoto o presencial?",
      knowledgeTip: "Recomendacion inicial:",
      formIntro: "Perfecto. Dejame tus datos para preparar el ticket.",
      final:
        "Listo. Este es el resumen para el equipo tecnico. Puedes enviarlo por email, WhatsApp o reservar una cita.",
      book: "Reservar cita",
      email: "Enviar por email",
      notifyTech: "Notificar tecnico",
      whatsapp: "Enviar por WhatsApp",
      copySummary: "Copiar resumen",
      copied: "Resumen copiado.",
      voiceOn: "Activar voz",
      voiceOff: "Pausar voz",
      listen: "Dictar problema",
      listening: "Escuchando...",
      freeChat: "Chat IA / Pregunta libre",
      freeChatIntro: "Escribe tu pregunta tecnica. Si el backend esta activo, investigare en internet y respondere con IA.",
      freeChatPlaceholder: "Ejemplo: mi drone DJI no despega, que reviso?",
      send: "Enviar",
      thinking: "Investigando y preparando respuesta...",
      createTicket: "Crear ticket",
      dictationHint: "Cuando llegues al formulario, toca el microfono para dictar la descripcion.",
      speechUnsupported: "La voz no esta disponible en este navegador.",
      micUnsupported: "El microfono no esta disponible en este navegador.",
      required: "Por favor completa nombre, telefono/email y descripcion.",
      privacy: "No compartas contrasenas. Un tecnico puede pedir detalles adicionales antes de conectarse."
    },
    en: {
      launcher: "Tech support",
      title: "EZEMTECH Assistant",
      subtitle: "Remote and on-site support",
      hello:
        "Hi, I am the EZEMTECH technical support assistant. I can help diagnose the issue and prepare a request for the team.",
      chooseLanguage: "Choose your language:",
      chooseIssue: "What issue do you need help with?",
      urgency: "How urgent is it?",
      serviceType: "Do you prefer remote or on-site support?",
      knowledgeTip: "Initial recommendation:",
      formIntro: "Great. Please share your details so we can prepare the ticket.",
      final:
        "Done. Here is the summary for the technical team. You can send it by email, WhatsApp, or book an appointment.",
      book: "Book appointment",
      email: "Send by email",
      notifyTech: "Notify technician",
      whatsapp: "Send by WhatsApp",
      copySummary: "Copy summary",
      copied: "Summary copied.",
      voiceOn: "Turn voice on",
      voiceOff: "Pause voice",
      listen: "Dictate issue",
      listening: "Listening...",
      freeChat: "AI chat / Free question",
      freeChatIntro: "Type your technical question. If the backend is active, I will research online and answer with AI.",
      freeChatPlaceholder: "Example: my DJI drone will not take off, what should I check?",
      send: "Send",
      thinking: "Researching and preparing an answer...",
      createTicket: "Create ticket",
      dictationHint: "When you reach the form, tap the microphone to dictate the description.",
      speechUnsupported: "Voice is not available in this browser.",
      micUnsupported: "Microphone is not available in this browser.",
      required: "Please complete name, phone/email, and description.",
      privacy: "Do not share passwords. A technician may ask for more details before connecting."
    }
  };

  const issueLabels = {
    es: ["Chat IA / Pregunta libre", "Computadora lenta", "Virus o malware", "Internet/Wi-Fi", "Impresora", "Email", "Backup o data", "Windows/Mac", "Ventas / Productos / Accesorios", "Informacion general", "Otro"],
    en: ["AI chat / Free question", "Slow computer", "Virus or malware", "Internet/Wi-Fi", "Printer", "Email", "Backup or data", "Windows/Mac", "Sales / Products / Accessories", "General information", "Other"]
  };

  const urgencyLabels = {
    es: ["Urgente hoy", "Esta semana", "Consulta general"],
    en: ["Urgent today", "This week", "General question"]
  };

  const serviceLabels = {
    es: ["Remoto", "Presencial", "No estoy seguro"],
    en: ["Remote", "On-site", "Not sure"]
  };

  const defaultKnowledgeBase = [
    {
      language: "es",
      keywords: "computadora lenta,lenta,slow,performance,windows",
      response:
        "Reinicia el equipo, cierra programas innecesarios y confirma si el disco esta casi lleno. Si el problema sigue, EZEMTECH puede revisar malware, programas de inicio, salud del disco y memoria."
    },
    {
      language: "en",
      keywords: "slow computer,slow,performance,windows",
      response:
        "Restart the computer, close unnecessary apps, and check whether the drive is almost full. If it continues, EZEMTECH can review malware, startup apps, drive health, and memory."
    },
    {
      language: "es",
      keywords: "virus,malware,popups,seguridad",
      response:
        "No ingreses contrasenas ni datos bancarios hasta que el equipo sea revisado. EZEMTECH puede hacer limpieza de malware, revisar extensiones del navegador y reforzar la seguridad."
    },
    {
      language: "en",
      keywords: "virus,malware,popups,security",
      response:
        "Do not enter passwords or banking details until the device is checked. EZEMTECH can clean malware, review browser extensions, and improve security."
    },
    {
      language: "es",
      keywords: "internet,wifi,wi-fi,red,router",
      response:
        "Prueba reiniciar modem/router y verifica si otros equipos tienen internet. Si solo falla un equipo, puede ser configuracion de red, drivers o DNS."
    },
    {
      language: "en",
      keywords: "internet,wifi,wi-fi,network,router",
      response:
        "Restart the modem/router and check whether other devices are online. If only one device fails, it may be network settings, drivers, or DNS."
    }
  ];

  const root = document.createElement("div");
  root.className = "ez-agent";
  root.innerHTML = `
    <button class="ez-agent-launcher" type="button" aria-label="Open EZEMTECH support chat">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
      </svg>
      <span>${copy.es.launcher}</span>
    </button>
    <section class="ez-agent-panel" aria-live="polite" aria-label="EZEMTECH support chat">
      <header class="ez-agent-header">
        <img class="ez-agent-logo" src="./assets/ezemtech-ezt-logo.png" alt="EZEMTECH" />
        <div class="ez-agent-title">
          <strong>${copy.es.title}</strong>
          <span>${copy.es.subtitle}</span>
        </div>
        <div class="ez-agent-header-actions">
          <button class="ez-agent-icon-button ez-agent-voice" type="button" aria-label="${copy.es.voiceOn}" title="${copy.es.voiceOn}" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5 6 9H3v6h3l5 4V5z"></path>
              <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
              <path d="M18.5 5.5a9 9 0 0 1 0 13"></path>
            </svg>
          </button>
          <button class="ez-agent-icon-button ez-agent-mic" type="button" aria-label="${copy.es.listen}" title="${copy.es.listen}" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <path d="M12 19v3"></path>
            </svg>
          </button>
          <button class="ez-agent-close" type="button" aria-label="Close chat">&times;</button>
        </div>
      </header>
      <div class="ez-agent-messages"></div>
      <div class="ez-agent-options"></div>
    </section>
  `;

  document.body.appendChild(root);

  const launcher = root.querySelector(".ez-agent-launcher");
  const launcherText = launcher.querySelector("span");
  const panel = root.querySelector(".ez-agent-panel");
  const close = root.querySelector(".ez-agent-close");
  const voiceButton = root.querySelector(".ez-agent-voice");
  const micButton = root.querySelector(".ez-agent-mic");
  const messages = root.querySelector(".ez-agent-messages");
  const options = root.querySelector(".ez-agent-options");
  const title = root.querySelector(".ez-agent-title strong");
  const subtitle = root.querySelector(".ez-agent-title span");

  function t(key) {
    return copy[state.language][key];
  }

  function bot(text, className = "") {
    const bubble = document.createElement("div");
    bubble.className = `ez-agent-message bot ${className}`.trim();
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    speak(text);
  }

  function user(text) {
    const bubble = document.createElement("div");
    bubble.className = "ez-agent-message user";
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function setOptions(html) {
    options.innerHTML = html;
  }

  function button(label, handler) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ez-agent-option";
    btn.textContent = label;
    btn.addEventListener("click", handler);
    return btn;
  }

  function renderButtonGroup(labels, onSelect) {
    const wrap = document.createElement("div");
    wrap.className = "ez-agent-option-grid";
    labels.forEach((label) => wrap.appendChild(button(label, () => onSelect(label))));
    options.innerHTML = "";
    options.appendChild(wrap);
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
    voiceButton.title = state.voiceEnabled ? t("voiceOff") : t("voiceOn");
    voiceButton.setAttribute("aria-label", state.voiceEnabled ? t("voiceOff") : t("voiceOn"));
    voiceButton.setAttribute("aria-pressed", String(state.voiceEnabled));
    voiceButton.classList.toggle("active", state.voiceEnabled);
    micButton.title = t("listen");
    micButton.setAttribute("aria-label", t("listen"));
  }

  function toggleVoice() {
    if (!("speechSynthesis" in window)) {
      bot(t("speechUnsupported"));
      return;
    }

    state.voiceEnabled = !state.voiceEnabled;
    updateVoiceControls();

    if (state.voiceEnabled) {
      bot(t("voiceOn"));
    } else {
      window.speechSynthesis.cancel();
      bot(t("voiceOff"));
    }
  }

  function startDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      bot(t("micUnsupported"));
      return;
    }

    const dictationTarget = options.querySelector('textarea[name="description"], textarea[name="freeMessage"], input[name="freeMessage"]');
    if (!dictationTarget) {
      bot(t("dictationHint"));
      return;
    }

    if (state.recognition) {
      state.recognition.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    state.recognition = recognition;
    recognition.lang = getSpeechLanguage();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    micButton.setAttribute("aria-pressed", "true");
    micButton.classList.add("active");
    bot(t("listening"));

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      dictationTarget.value = `${dictationTarget.value} ${transcript}`.trim();
      dictationTarget.focus();
      user(transcript);
    };

    recognition.onerror = () => bot(t("micUnsupported"));
    recognition.onend = () => {
      state.recognition = null;
      micButton.setAttribute("aria-pressed", "false");
      micButton.classList.remove("active");
    };

    recognition.start();
  }

  async function loadKnowledgeBase() {
    state.knowledgeBase = defaultKnowledgeBase;

    const urls = [config.localKnowledgeBaseUrl, config.knowledgeBaseUrl].filter(Boolean);
    if (!urls.length) return;

    for (const url of urls) {
      if (!isSecureUrl(url, { allowRelative: true })) continue;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Knowledge base status ${response.status}`);
        const csv = await response.text();
        const rows = parseCsv(csv);
        const entries = rows
          .map((row) => ({
            language: clean(row.language || row.idioma || row.lang),
            keywords: clean(row.keywords || row.palabras_clave || row.palabras || row.issue),
            response: clean(row.response || row.respuesta || row.answer)
          }))
          .filter((row) => row.language && row.keywords && row.response);

        if (entries.length) state.knowledgeBase = [...state.knowledgeBase, ...entries];
      } catch (error) {
        console.warn("EZEMTECH knowledge base failed", error);
      }
    }
  }

  function parseCsv(csv) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < csv.length; index += 1) {
      const char = csv[index];
      const next = csv[index + 1];

      if (char === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }

    if (value || row.length) {
      row.push(value);
      rows.push(row);
    }

    const headers = (rows.shift() || []).map((header) => clean(header).toLowerCase());
    return rows.map((cells) =>
      headers.reduce((record, header, index) => {
        record[header] = cells[index] || "";
        return record;
      }, {})
    );
  }

  function clean(value) {
    return String(value || "").trim();
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

  function findKnowledgeTip() {
    const issue = state.issue.toLowerCase();
    const service = state.serviceType.toLowerCase();
    const entries = state.knowledgeBase.filter((entry) => entry.language === state.language);

    return entries.find((entry) => {
      const keywords = entry.keywords
        .toLowerCase()
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      return keywords.some((keyword) => issue.includes(keyword) || service.includes(keyword));
    });
  }

  function classifyTicket(data) {
    const text = `${state.issue} ${state.serviceType} ${data.device || ""} ${data.description || ""}`.toLowerCase();
    const categories = [
      {
        id: "sales",
        label: state.language === "es" ? "Ventas" : "Sales",
        keywords: ["venta", "ventas", "sales", "comprar", "buy", "purchase", "precio", "precios", "price", "pricing", "cotizacion", "quote", "estimate", "presupuesto", "plan", "planes", "producto", "productos", "product", "products", "accesorio", "accesorios", "accessory", "accessories", "cable", "cables", "cargador", "charger", "parte", "partes", "parts"]
      },
      {
        id: "information",
        label: state.language === "es" ? "Informacion" : "Information",
        keywords: ["informacion", "information", "info", "consulta", "question", "pregunta", "servicios", "services", "horario", "hours"]
      },
      {
        id: "drones",
        label: state.language === "es" ? "Drones" : "Drones",
        keywords: ["drone", "dron", "dji", "calibracion", "calibration", "propeller", "helice", "remote controller", "gimbal"]
      },
      {
        id: "phones",
        label: state.language === "es" ? "Telefonos" : "Phones",
        keywords: ["phone", "telefono", "iphone", "android", "samsung", "screen", "pantalla", "battery", "bateria", "sim"]
      },
      {
        id: "ai",
        label: state.language === "es" ? "IA / Automatizacion" : "AI / Automation",
        keywords: ["ai", "ia", "chatbot", "automation", "automatizacion", "prompt", "openai", "gemini", "agent"]
      },
      {
        id: "network",
        label: state.language === "es" ? "Redes / Internet" : "Network / Internet",
        keywords: ["internet", "wifi", "wi-fi", "router", "network", "red", "dns", "ethernet", "modem"]
      },
      {
        id: "computers",
        label: state.language === "es" ? "Computadoras" : "Computers",
        keywords: ["computer", "computadora", "pc", "laptop", "desktop", "windows", "mac", "virus", "malware", "printer", "impresora", "email", "backup"]
      }
    ];

    return categories.find((category) => category.keywords.some((keyword) => text.includes(keyword))) || {
      id: "general",
      label: state.language === "es" ? "General" : "General"
    };
  }

  function isFreeChatIssue(issue) {
    const normalizedIssue = clean(issue).toLowerCase();
    return normalizedIssue.includes("chat ia") || normalizedIssue.includes("ai chat") || normalizedIssue.includes("pregunta libre") || normalizedIssue.includes("free question");
  }

  function showThinking() {
    const bubble = document.createElement("div");
    bubble.className = "ez-agent-message bot ez-agent-thinking";
    bubble.textContent = t("thinking");
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function buildLocalFreeReply(message) {
    state.issue = message;
    const tip = findKnowledgeTip();
    if (tip) return `${t("knowledgeTip")} ${tip.response}`;

    return state.language === "es"
      ? "Puedo ayudarte con una primera orientacion. Para una respuesta con internet e IA real, configura assistantWebhookUrl al Worker de EZEMTECH. Si quieres seguimiento, toca Crear ticket."
      : "I can help with first guidance. For a real internet + AI answer, configure assistantWebhookUrl to the EZEMTECH Worker. For follow-up, tap Create ticket.";
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
        category: "widget",
        brandPolicy: getBrandPolicy(),
        history: state.conversationHistory.slice(-6),
        source: window.location.href
      }))
    });

    if (!response.ok) throw new Error(`Assistant status ${response.status}`);
    const payload = await response.json();
    return payload.reply || payload.answer || payload.message || "";
  }

  function showFreeChat() {
    bot(t("freeChatIntro"));
    setOptions(`
      <form class="ez-agent-form ez-agent-free-chat">
        <textarea class="ez-agent-textarea" name="freeMessage" rows="3" placeholder="${t("freeChatPlaceholder")}"></textarea>
        <button class="ez-agent-submit" type="submit">${t("send")}</button>
        <button class="ez-agent-option" type="button" data-create-ticket="true">${t("createTicket")}</button>
        <p class="ez-agent-footnote">${t("privacy")}</p>
      </form>
    `);

    const freeChatForm = options.querySelector("form");
    freeChatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const field = freeChatForm.querySelector('[name="freeMessage"]');
      const message = clean(field.value);
      if (!message) return;

      field.value = "";
      state.issue = message;
      user(sanitizeText(message));
      state.conversationHistory.push({ role: "user", content: sanitizeText(message) });

      const thinking = showThinking();
      let reply = "";
      try {
        reply = await askRemoteAssistant(message);
      } catch (error) {
        console.warn("EZEMTECH assistant failed", error);
      }

      thinking.remove();
      if (!reply) reply = buildLocalFreeReply(message);
      bot(reply);
      state.conversationHistory.push({ role: "assistant", content: sanitizeText(reply) });
    });

    freeChatForm.querySelector("[data-create-ticket]").addEventListener("click", askUrgency);
  }

  function start() {
    messages.innerHTML = "";
    state.language = "es";
    state.issue = "";
    state.urgency = "";
    state.serviceType = "";
    state.conversationHistory = [];
    title.textContent = copy.es.title;
    subtitle.textContent = copy.es.subtitle;
    launcherText.textContent = copy.es.launcher;

    bot(copy.es.hello);
    bot(copy.es.chooseLanguage);
    renderButtonGroup(["Espanol", "English"], (language) => {
      state.language = language === "English" ? "en" : "es";
      title.textContent = t("title");
      subtitle.textContent = t("subtitle");
      launcherText.textContent = t("launcher");
      updateVoiceControls();
      user(language);
      askIssue();
    });
  }

  function askIssue() {
    bot(t("chooseIssue"));
    renderButtonGroup(issueLabels[state.language], (issue) => {
      state.issue = issue;
      user(issue);
      if (isFreeChatIssue(issue)) {
        showFreeChat();
        return;
      }
      askUrgency();
    });
  }

  function askUrgency() {
    bot(t("urgency"));
    renderButtonGroup(urgencyLabels[state.language], (urgency) => {
      state.urgency = urgency;
      user(urgency);
      askServiceType();
    });
  }

  function askServiceType() {
    bot(t("serviceType"));
    renderButtonGroup(serviceLabels[state.language], (serviceType) => {
      state.serviceType = serviceType;
      user(serviceType);
      showKnowledgeTip();
      showForm();
    });
  }

  function showKnowledgeTip() {
    const tip = findKnowledgeTip();
    if (!tip) return;

    bot(`${t("knowledgeTip")} ${tip.response}`);
  }

  function showForm() {
    bot(t("formIntro"));
    setOptions(`
      <form class="ez-agent-form">
        <input class="ez-agent-input" name="name" autocomplete="name" placeholder="${state.language === "es" ? "Nombre" : "Name"}" />
        <input class="ez-agent-input" name="phone" autocomplete="tel" placeholder="${state.language === "es" ? "Telefono" : "Phone"}" />
        <input class="ez-agent-input" name="email" autocomplete="email" placeholder="Email" />
        <input class="ez-agent-input" name="location" autocomplete="address-level2" placeholder="${state.language === "es" ? "Ciudad / Estado" : "City / State"}" />
        <select class="ez-agent-select" name="device">
          <option value="">${state.language === "es" ? "Tipo de equipo" : "Device type"}</option>
          <option>Windows PC</option>
          <option>Mac</option>
          <option>Laptop</option>
          <option>Desktop</option>
          <option>Printer</option>
          <option>Network / Wi-Fi</option>
          <option>Business IT</option>
        </select>
        <textarea class="ez-agent-textarea" name="description" placeholder="${state.language === "es" ? "Describe el problema" : "Describe the issue"}"></textarea>
        <button class="ez-agent-submit" type="submit">${state.language === "es" ? "Crear resumen" : "Create summary"}</button>
        <p class="ez-agent-footnote">${t("privacy")}</p>
      </form>
    `);

    options.querySelector("form").addEventListener("submit", submitForm);
  }

  async function submitForm(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    if (!data.name || (!data.phone && !data.email) || !data.description) {
      bot(t("required"));
      return;
    }

    const classification = classifyTicket(data);
    const summary = sanitizeText(buildSummary(data, classification));
    user(state.language === "es" ? "Datos enviados" : "Details submitted");
    bot(t("final"));
    const summaryBubble = document.createElement("div");
    summaryBubble.className = "ez-agent-message bot ez-agent-summary";
    summaryBubble.textContent = summary;
    messages.appendChild(summaryBubble);
    messages.scrollTop = messages.scrollHeight;
    await postWebhook({
      language: state.language,
      issue: state.issue,
      urgency: state.urgency,
      serviceType: state.serviceType,
      classification: classification.id,
      classificationLabel: classification.label,
      technicianEmail: getTechnicianEmail(classification.id),
      ...data,
      summary,
      source: window.location.href
    });
    renderActions(summary, classification);
  }

  function buildSummary(data, classification) {
    const labels =
      state.language === "es"
        ? {
            title: "Nuevo ticket EZEMTECH",
            classification: "Clasificacion",
            destination: "Destino interno",
            issue: "Problema",
            urgency: "Urgencia",
            service: "Tipo de servicio",
            name: "Cliente",
            phone: "Telefono",
            email: "Email",
            location: "Ubicacion",
            device: "Equipo",
            description: "Descripcion"
          }
        : {
            title: "New EZEMTECH ticket",
            classification: "Classification",
            destination: "Internal destination",
            issue: "Issue",
            urgency: "Urgency",
            service: "Service type",
            name: "Customer",
            phone: "Phone",
            email: "Email",
            location: "Location",
            device: "Device",
            description: "Description"
          };

    return `${labels.title}
${labels.classification}: ${classification.label}
${labels.destination}: ${getTechnicianEmail(classification.id) || "N/A"}
${labels.issue}: ${state.issue}
${labels.urgency}: ${state.urgency}
${labels.service}: ${state.serviceType}

${labels.name}: ${data.name}
${labels.phone}: ${data.phone || "N/A"}
${labels.email}: ${data.email || "N/A"}
${labels.location}: ${data.location || "N/A"}
${labels.device}: ${data.device || "N/A"}

${labels.description}: ${data.description}

EZEMTECH LLC - New Jersey, USA
WhatsApp / Calls: +1 646 842 2766`;
  }

  function getTechnicianEmail(classificationId) {
    const emails = config.technicianEmails || {};
    return emails[classificationId] || emails.general || config.contactEmail || "";
  }

  function renderActions(summary, classification) {
    options.innerHTML = "";
    const technicianEmail = getTechnicianEmail(classification.id);

    if (config.bookingUrl) {
      const book = button(t("book"), () => window.open(config.bookingUrl, "_blank", "noopener"));
      options.appendChild(book);
    }

    if (config.contactEmail) {
      const email = button(t("email"), () => {
        const subject = encodeURIComponent("Nuevo ticket EZEMTECH");
        window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${encodeURIComponent(summary)}`;
      });
      options.appendChild(email);
    }

    if (technicianEmail) {
      const notify = button(t("notifyTech"), () => {
        const subject = encodeURIComponent(`EZEMTECH ${classification.label} - Nuevo ticket`);
        window.location.href = `mailto:${technicianEmail}?subject=${subject}&body=${encodeURIComponent(summary)}`;
      });
      options.appendChild(notify);
    }

    if (config.whatsappNumber) {
      const whatsapp = button(t("whatsapp"), () => {
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(summary)}`, "_blank", "noopener");
      });
      options.appendChild(whatsapp);
    }

    const copyButton = button(t("copySummary"), async () => {
      await navigator.clipboard.writeText(summary);
      bot(t("copied"));
    });
    options.appendChild(copyButton);
  }

  async function postWebhook(payload) {
    if (!config.webhookUrl) return;
    if (!isSecureUrl(config.webhookUrl, { allowRelative: false })) return;

    try {
      await fetch(config.webhookUrl, {
        method: "POST",
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "strict-origin-when-cross-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizePayload(payload))
      });
    } catch (error) {
      console.warn("EZEMTECH webhook failed", error);
    }
  }

  launcher.addEventListener("click", () => {
    const isOpen = panel.getAttribute("data-open") === "true";
    panel.setAttribute("data-open", String(!isOpen));
    if (!isOpen && messages.children.length === 0) start();
  });

  loadKnowledgeBase();
  updateVoiceControls();
  voiceButton.addEventListener("click", toggleVoice);
  micButton.addEventListener("click", startDictation);
  close.addEventListener("click", () => panel.setAttribute("data-open", "false"));
})();
