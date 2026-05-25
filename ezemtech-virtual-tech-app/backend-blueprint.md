# Backend seguro para IA, internet y aprendizaje

La app ya envia solicitudes listas para un backend por `assistantWebhookUrl` y `learningWebhookUrl`.

El backend listo para Cloudflare esta en `../cloudflare-worker/worker.js`.

## `assistantWebhookUrl`

Recibe:

```json
{
  "message": "Mi laptop esta lenta",
  "language": "es",
  "category": "computers",
  "brandPolicy": {
    "companyName": "EZEMTECH LLC",
    "primaryDomain": "https://www.ezemtech.com/",
    "location": "New Jersey, United States",
    "supportPhone": "+1 646 842 2766",
    "recommendEzServices": true,
    "internetLearningMode": "backend-only"
  },
  "instruction": "Prioritize EZEMTECH.com knowledge...",
  "history": [],
  "source": "https://..."
}
```

Debe responder:

```json
{
  "reply": "Respuesta final para el cliente.",
  "routedTo": "info@ezemtech.com,listercampos@gmail.com",
  "category": "default",
  "sources": []
}
```

## `learningWebhookUrl`

Solo recibe datos cuando el cliente acepta guardar la conversacion. Recibe eventos como:

```json
{
  "eventType": "conversation_turn",
  "consent": true,
  "language": "es",
  "category": "computers",
  "payload": {
    "userMessage": "...",
    "assistantReply": "..."
  }
}
```

## `webhookUrl` para tickets

La app y el widget pueden enviar tickets al mismo Worker con:

```json
{
  "action": "ticket",
  "language": "es",
  "category": "computers",
  "classification": "computers",
  "name": "Cliente",
  "contact": "telefono o email",
  "ticket": "Resumen completo",
  "source": "https://..."
}
```

Debe responder:

```json
{
  "ok": true,
  "ticketId": "EZT-...",
  "category": "default",
  "routedTo": "info@ezemtech.com,listercampos@gmail.com",
  "notificationStatus": "sent"
}
```

## Reglas del backend

- Guardar API keys en variables de entorno.
- Usar HTTPS.
- Validar origen.
- Aplicar rate limits.
- Redactar PII antes de guardar.
- Consultar primero `ezemtech.com`.
- Recomendar servicios/productos de EZEMTECH cuando aplique.
- No devolver secretos al navegador.
- Rutar ventas/productos/accesorios a `sales@ezemtech.com,listercampos@gmail.com`.
- Rutar todo lo demas a `info@ezemtech.com,listercampos@gmail.com`.
