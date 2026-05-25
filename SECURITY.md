# Seguridad EZEMTECH IA

La seguridad de datos de clientes y claves de IA es prioridad. Este proyecto esta disenado para que el navegador sea solo la interfaz, no el lugar donde se guardan secretos.

## Reglas principales

- No pongas API keys de OpenAI, Gemini, correo, Twilio, Make, Zapier o n8n dentro de `app.js`, `widget.js`, `index.html` ni `config.js`.
- Toda IA real debe pasar por un backend seguro, por ejemplo n8n, Make, Zapier, Cloudflare Worker, Vercel Function o servidor propio.
- Usa solo URLs `https://` para `webhookUrl`, `assistantWebhookUrl`, `learningWebhookUrl`, Google Sheets publicado y cualquier API externa.
- No pidas ni guardes contrasenas de clientes. El agente ya muestra avisos para no compartir contrasenas.
- No subas documentos con datos privados de clientes a Google Sheets publico ni a GitHub.
- No guardes conversaciones de clientes sin consentimiento claro.

## Protecciones incluidas

- `requireHttps`: bloquea endpoints externos `http://` para webhooks y asistente IA.
- `redactSensitiveData`: redacta contrasenas, PIN, tarjetas, SSN, API keys y private keys antes de enviar tickets o historial a webhooks.
- `maxTextLength`: limita el tamano del texto enviado a servicios externos.
- La PWA no usa `localStorage` para datos de clientes.
- El service worker solo cachea archivos estaticos de la app, no intercepta `POST` ni URLs externas.
- La app usa Content Security Policy en `index.html`.
- `learningWebhookUrl` solo envia conversaciones cuando el cliente acepta guardar la conversacion.

## Encriptacion

- Los datos en transito deben viajar por HTTPS.
- WhatsApp usa su propio canal; email depende del proveedor y no debe usarse para contrasenas.
- Para datos sensibles en reposo, usa un backend con cifrado del lado servidor y control de acceso. No intentes guardar tickets sensibles en archivos publicos del repositorio.

## Conectar ChatGPT o IA real

Usa `assistantWebhookUrl` apuntando a un backend HTTPS. Ese backend debe:

- Guardar la API key en variables de entorno.
- Validar origen y rate limits.
- Redactar o filtrar PII antes de llamar al modelo cuando aplique.
- Registrar solo lo necesario para soporte.
- Enviar al navegador solo la respuesta final, nunca secretos ni trazas internas.

## Internet como base de aprendizaje

La busqueda en internet debe ocurrir en el backend, no en el navegador. El backend debe:

- Consultar primero `https://www.ezemtech.com/`.
- Priorizar servicios/productos de EZEMTECH cuando sea relevante.
- Usar fuentes externas solo para complementar diagnosticos tecnicos.
- Guardar fuentes y fecha de consulta si almacena conocimiento.
- Filtrar datos personales antes de indexar conversaciones.

## Si sospechas exposicion

1. Revoca la clave afectada en el proveedor.
2. Cambia claves y tokens.
3. Revisa historial de GitHub.
4. Revisa logs del proveedor.
5. Genera nuevas credenciales y vuelve a desplegar.
