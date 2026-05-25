# EZEMTECH Cloudflare Worker

Backend seguro para que la app y el widget investiguen en internet, respondan con IA, reciban tickets y preparen notificaciones sin exponer claves en el navegador.

## Despliegue rapido

1. Crea o abre el Worker de Cloudflare.
2. Pega el contenido de `worker.js` en el editor.
3. En **Settings > Variables and Secrets**, agrega:
   - `SERP_API_KEY`: clave de SerpAPI.
   - `GROQ_API_KEY`: clave de Groq.
   - `GROQ_MODEL`: `llama3-8b-8192` o el modelo Groq que uses.
   - `EMAIL_WEBHOOK_URL`: webhook opcional de Zapier, Make, n8n o Google Apps Script para enviar tickets por correo.
   - `LEARNING_WEBHOOK_URL`: webhook opcional para guardar aprendizaje con consentimiento.
   - `RESEND_API_KEY`: opcional si quieres enviar correo directo con Resend.
   - `EMAIL_FROM`: opcional, ejemplo `EZEMTECH AI <support@ezemtech.com>`.
   - `ALLOWED_ORIGINS`: `https://www.ezemtech.com,https://ezemtech.com,http://localhost:4174,http://127.0.0.1:4174,http://localhost:4175,http://127.0.0.1:4175`
4. Publica el Worker.
5. Usa la URL del Worker en `assistantWebhookUrl`, `webhookUrl` y, si quieres aprendizaje con consentimiento, `learningWebhookUrl`.

## Seguridad

- No pegues tokens de Cloudflare, SerpAPI, Groq ni OpenAI en `index.html`, `app.js`, `widget.js` o `config.js`.
- Si un token se pega por accidente en chat, GitHub o una captura publica, revocalo y crea uno nuevo.
- El Worker solo acepta `POST`, detecta si la solicitud es chat, ticket o aprendizaje, y limita solicitudes grandes.
- El Worker redacta contrasenas, tarjetas, SSN, API keys y private keys antes de enviar contexto al modelo.
- `ALLOWED_ORIGINS` debe contener solo tus dominios reales y tus URLs locales de prueba.

## Ruteo EZEMTECH

- Ventas, productos y accesorios: `sales@ezemtech.com,listercampos@gmail.com`.
- Todo lo demas: `info@ezemtech.com,listercampos@gmail.com`.
- WhatsApp, mensajes y llamadas: `+1 646 842 2766`.

## Prueba manual

```bash
curl "https://TU-WORKER.workers.dev" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Mi laptop esta lenta, que reviso?\",\"language\":\"es\"}"
```

La respuesta debe devolver JSON con `reply`, `routedTo`, `category` y `sources`.

## Prueba de ticket

```bash
curl "https://TU-WORKER.workers.dev" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"ticket\",\"summary\":\"Cliente necesita precio de cargador USB-C\",\"language\":\"es\"}"
```

Debe responder con `ok`, `ticketId`, `routedTo`, `category`, `notificationStatus` y `notificationProvider`.

Si no configuras `EMAIL_WEBHOOK_URL` ni `RESEND_API_KEY`, el ticket se acepta y enruta, pero `notificationStatus` sera `not_configured`. En ese caso el cliente todavia puede usar los botones de email o WhatsApp del frontend.
