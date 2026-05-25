# EZEMTECH Virtual Tech App

App instalable tipo PWA para clientes de EZEMTECH LLC en New Jersey, United States. Funciona como tecnico virtual tipo chat para computadoras, telefonos, drones, redes, ventas e IA, con diagnostico inicial en Espanol e Ingles.

## Como probar

Desde esta carpeta, levanta un servidor local:

```bash
python -m http.server 4174
```

Luego abre:

```text
http://localhost:4174
```

## Como conectarla a EZEMTECH.com

1. Publica esta carpeta con GitHub Pages o tu hosting.
2. En EZEMTECH.com agrega un boton: `Instalar Tecnico Virtual`.
3. Ese boton debe abrir la URL publica de esta app.
4. El usuario podra instalarla desde el navegador si el dispositivo soporta PWA.

## Configuracion segura

Configura correos, WhatsApp, webhooks y seguridad en `config.js`. No pongas API keys de OpenAI, Gemini ni ningun proveedor de IA dentro de la app del navegador.

```js
window.EZEMTECH_VIRTUAL_TECH_CONFIG = {
  bookingUrl: "https://www.ezemtech.com/book-online",
  websiteUrl: "https://www.ezemtech.com/",
  whatsappNumber: "16468422766",
  webhookUrl: "",
  assistantWebhookUrl: "https://ezemtech.mastecnologiaec.workers.dev",
  learningWebhookUrl: "",
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
    computers: "info@ezemtech.com,listercampos@gmail.com",
    phones: "info@ezemtech.com,listercampos@gmail.com",
    drones: "info@ezemtech.com,listercampos@gmail.com",
    ai: "info@ezemtech.com,listercampos@gmail.com",
    network: "info@ezemtech.com,listercampos@gmail.com",
    sales: "sales@ezemtech.com,listercampos@gmail.com",
    information: "info@ezemtech.com,listercampos@gmail.com",
    general: "info@ezemtech.com,listercampos@gmail.com"
  }
};
```

La app clasifica el caso y usa el correo correcto en **Notificar tecnico**. Si agregas `webhookUrl`, tambien envia los datos a Zapier, Make o n8n para mandar el correo automaticamente.

Ruteo actual:

- Ventas, productos y accesorios: `sales@ezemtech.com,listercampos@gmail.com`.
- Todo lo demas: `info@ezemtech.com,listercampos@gmail.com`.
- WhatsApp, mensajes y llamadas: `+1 646 842 2766`.

## Modo conversacional tipo ChatGPT

La app permite escribir o hablar en modo conversacion. El cliente puede decir cosas como:

- "Mi laptop esta lenta y se apaga."
- "Quiero crear un ticket."
- "Abrir cita."
- "Enviar por WhatsApp."
- "Notificar al tecnico."

Sin backend, la app responde con un tecnico virtual local usando reglas de soporte. Para respuestas IA tipo ChatGPT reales, conecta `assistantWebhookUrl` a un backend seguro como el de `../cloudflare-worker/`. No pongas una API key directa en el navegador.

## Internet y aprendizaje

La app no navega internet directamente desde el cliente. Para usar internet como base de aprendizaje, conecta `assistantWebhookUrl` a un backend HTTPS que haga busqueda/RAG y use `brandPolicy`:

- Priorizar informacion de `https://www.ezemtech.com/`.
- Recomendar servicios o productos de EZEMTECH cuando aplique.
- Usar internet solo desde el backend seguro.
- Devolver al navegador solo la respuesta final.

Para aprender de conversaciones, conecta `learningWebhookUrl`. La app solo envia conversaciones si el cliente marca el consentimiento **Permitir guardar esta conversacion para mejorar el servicio**. Antes de enviar, redacta datos sensibles.

## Seguridad

- La app bloquea webhooks `http://` cuando `requireHttps` esta activo.
- Redacta contrasenas, claves, tarjetas, SSN, API keys y private keys antes de enviar tickets o historial a webhooks.
- No guarda datos de clientes en `localStorage`.
- El service worker solo cachea archivos de la app y no intercepta `POST` ni URLs externas.
- `index.html` incluye Content Security Policy para limitar scripts, estilos, conexiones e imagenes.

Lee `../SECURITY.md` antes de conectar un backend IA real.

## Incluye

- Manifest para instalacion.
- Service worker para carga rapida y uso basico offline.
- Diagnostico inicial por categoria.
- Clasificacion automatica de tickets.
- Notificacion por correo segun categoria tecnica.
- Voz para leer respuestas en alto.
- Microfono para dictar el problema.
- Enlaces a EZEMTECH.com y booking online.

## Voz y microfono

La app usa `speechSynthesis` para hablar y `SpeechRecognition` cuando el navegador lo soporte. El microfono requiere permiso del usuario y la app debe estar publicada en HTTPS o ejecutarse en `localhost`.
