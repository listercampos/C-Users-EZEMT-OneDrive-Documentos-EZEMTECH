(function () {
  const config = {
    businessName: "EZEMTECH",
    bookingUrl: "https://www.ezemtech.com/book-online",
    contactEmail: "",
    whatsappNumber: "",
    webhookUrl: "",
    ...(window.EZEMTECH_AGENT_CONFIG || {})
  };

  const state = {
    language: "es",
    issue: "",
    urgency: "",
    serviceType: ""
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
      formIntro: "Perfecto. Dejame tus datos para preparar el ticket.",
      final:
        "Listo. Este es el resumen para el equipo tecnico. Puedes enviarlo por email, WhatsApp o reservar una cita.",
      book: "Reservar cita",
      email: "Enviar por email",
      whatsapp: "Enviar por WhatsApp",
      copySummary: "Copiar resumen",
      copied: "Resumen copiado.",
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
      formIntro: "Great. Please share your details so we can prepare the ticket.",
      final:
        "Done. Here is the summary for the technical team. You can send it by email, WhatsApp, or book an appointment.",
      book: "Book appointment",
      email: "Send by email",
      whatsapp: "Send by WhatsApp",
      copySummary: "Copy summary",
      copied: "Summary copied.",
      required: "Please complete name, phone/email, and description.",
      privacy: "Do not share passwords. A technician may ask for more details before connecting."
    }
  };

  const issueLabels = {
    es: ["Computadora lenta", "Virus o malware", "Internet/Wi-Fi", "Impresora", "Email", "Backup o data", "Windows/Mac", "Otro"],
    en: ["Slow computer", "Virus or malware", "Internet/Wi-Fi", "Printer", "Email", "Backup or data", "Windows/Mac", "Other"]
  };

  const urgencyLabels = {
    es: ["Urgente hoy", "Esta semana", "Consulta general"],
    en: ["Urgent today", "This week", "General question"]
  };

  const serviceLabels = {
    es: ["Remoto", "Presencial", "No estoy seguro"],
    en: ["Remote", "On-site", "Not sure"]
  };

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
        <div class="ez-agent-title">
          <strong>${copy.es.title}</strong>
          <span>${copy.es.subtitle}</span>
        </div>
        <button class="ez-agent-close" type="button" aria-label="Close chat">&times;</button>
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

  function start() {
    messages.innerHTML = "";
    state.language = "es";
    state.issue = "";
    state.urgency = "";
    state.serviceType = "";
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
      user(language);
      askIssue();
    });
  }

  function askIssue() {
    bot(t("chooseIssue"));
    renderButtonGroup(issueLabels[state.language], (issue) => {
      state.issue = issue;
      user(issue);
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
      showForm();
    });
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

    const summary = buildSummary(data);
    user(state.language === "es" ? "Datos enviados" : "Details submitted");
    bot(t("final"));
    const summaryBubble = document.createElement("div");
    summaryBubble.className = "ez-agent-message bot ez-agent-summary";
    summaryBubble.textContent = summary;
    messages.appendChild(summaryBubble);
    messages.scrollTop = messages.scrollHeight;
    await postWebhook({ ...state, ...data, summary, source: window.location.href });
    renderActions(summary);
  }

  function buildSummary(data) {
    const labels =
      state.language === "es"
        ? {
            title: "Nuevo ticket EZEMTECH",
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
${labels.issue}: ${state.issue}
${labels.urgency}: ${state.urgency}
${labels.service}: ${state.serviceType}

${labels.name}: ${data.name}
${labels.phone}: ${data.phone || "N/A"}
${labels.email}: ${data.email || "N/A"}
${labels.location}: ${data.location || "N/A"}
${labels.device}: ${data.device || "N/A"}

${labels.description}: ${data.description}`;
  }

  function renderActions(summary) {
    options.innerHTML = "";

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

  launcher.addEventListener("click", () => {
    const isOpen = panel.getAttribute("data-open") === "true";
    panel.setAttribute("data-open", String(!isOpen));
    if (!isOpen && messages.children.length === 0) start();
  });

  close.addEventListener("click", () => panel.setAttribute("data-open", "false"));
})();
