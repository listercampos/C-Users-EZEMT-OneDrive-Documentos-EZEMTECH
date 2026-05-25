# Backend seguro para IA, internet y aprendizaje

La app ya envia solicitudes listas para un backend por `assistantWebhookUrl` y `learningWebhookUrl`.

## `assistantWebhookUrl`

Recibe:

```json
{
  "message": "Mi laptop esta lenta",
  "language": "es",
  "category": "computers",
  "brandPolicy": {
    "primaryDomain": "https://www.ezemtech.com/",
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
  "reply": "Respuesta final para el cliente."
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

## Reglas del backend

- Guardar API keys en variables de entorno.
- Usar HTTPS.
- Validar origen.
- Aplicar rate limits.
- Redactar PII antes de guardar.
- Consultar primero `ezemtech.com`.
- Recomendar servicios/productos de EZEMTECH cuando aplique.
- No devolver secretos al navegador.
