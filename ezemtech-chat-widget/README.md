# EZEMTECH Support Agent Widget

Widget rapido para atender clientes de EZEMTECH desde la web. Funciona sin servidor: pregunta el problema, detecta urgencia, captura datos y crea un resumen para el tecnico.

## Archivos

- `index.html`: demo local del chat.
- `styles.css`: estilos del widget.
- `widget.js`: logica del agente.

## Como probarlo

Abre `index.html` en el navegador y usa el boton de chat en la esquina inferior derecha.

## Como instalarlo en Wix / EZEMTECH.com

1. Sube `styles.css` y `widget.js` a un lugar publico, por ejemplo al hosting de archivos que uses o a tu servidor.
2. En Wix, entra a **Settings > Custom Code**.
3. Agrega este bloque antes de cerrar `</body>`:

```html
<link rel="stylesheet" href="URL_PUBLICA/styles.css">
<script>
  window.EZEMTECH_AGENT_CONFIG = {
    businessName: "EZEMTECH",
    bookingUrl: "https://www.ezemtech.com/book-online",
    contactEmail: "TU_EMAIL_AQUI",
    whatsappNumber: "TU_NUMERO_WHATSAPP_CON_CODIGO_PAIS",
    webhookUrl: ""
  };
</script>
<script src="URL_PUBLICA/widget.js"></script>
```

## Configuracion

- `contactEmail`: email donde quieres recibir tickets.
- `whatsappNumber`: numero en formato internacional sin signos. Ejemplo: `15551234567`.
- `webhookUrl`: URL opcional de Zapier, Make o n8n para crear tickets automaticamente.
- `bookingUrl`: enlace de reservas de EZEMTECH.

## Flujo incluido

1. Idioma: Espanol o Ingles.
2. Tipo de problema.
3. Urgencia.
4. Soporte remoto, presencial o no seguro.
5. Datos del cliente.
6. Resumen listo para enviar o copiar.
