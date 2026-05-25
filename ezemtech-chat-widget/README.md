# EZEMTECH Support Agent Widget

Widget rapido para atender clientes de EZEMTECH LLC desde la web. Puede funcionar sin servidor con flujo guiado y tambien conectarse a un Worker seguro para chat IA con busqueda en internet.

## Archivos

- `index.html`: demo local del chat.
- `config.js`: configuracion del demo y datos de contacto.
- `styles.css`: estilos del widget.
- `widget.js`: logica del agente.
- `assets/ezemtech-ezt-logo.png`: logo del encabezado.

## Como probarlo

Abre `index.html` en el navegador y usa el boton de chat en la esquina inferior derecha.

## Como instalarlo en Wix / EZEMTECH.com

1. Sube `styles.css`, `widget.js`, `assets/` y opcionalmente `config.js` a un lugar publico, por ejemplo al hosting de archivos que uses o a tu servidor.
2. En Wix, entra a **Settings > Custom Code**.
3. Agrega este bloque antes de cerrar `</body>`:

```html
<link rel="stylesheet" href="URL_PUBLICA/styles.css">
<script src="URL_PUBLICA/config.js"></script>
<script src="URL_PUBLICA/widget.js"></script>
```

Si necesitas configurar directo en Wix, puedes usar este bloque antes de `widget.js`:

```html
<script>
  window.EZEMTECH_AGENT_CONFIG = {
    businessName: "EZEMTECH",
    bookingUrl: "https://www.ezemtech.com/book-online",
    contactEmail: "info@ezemtech.com,listercampos@gmail.com",
    whatsappNumber: "16468422766",
    webhookUrl: "",
    assistantWebhookUrl: "https://ezemtech.mastecnologiaec.workers.dev",
    knowledgeBaseUrl: "URL_CSV_PUBLICA_DE_GOOGLE_SHEETS",
    localKnowledgeBaseUrl: "URL_PUBLICA/local-knowledge.csv",
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
</script>
<script src="URL_PUBLICA/widget.js"></script>
```

## Configuracion

- `contactEmail`: email donde quieres recibir tickets.
- `whatsappNumber`: numero en formato internacional sin signos. Ejemplo: `15551234567`.
- `webhookUrl`: URL opcional de Zapier, Make o n8n para crear tickets automaticamente.
- `assistantWebhookUrl`: URL HTTPS del Worker para chat IA con busqueda en internet.
- `bookingUrl`: enlace de reservas de EZEMTECH.
- `knowledgeBaseUrl`: URL publica CSV de Google Sheets para que el agente cargue respuestas actualizadas.
- `localKnowledgeBaseUrl`: URL publica de un CSV propio, por ejemplo el archivo generado desde `knowledge-dropbox/processed/local-knowledge.csv`.
- `technicianEmails`: correos por categoria para notificar al tecnico correcto.
- `security.requireHttps`: bloquea webhooks y bases externas no HTTPS.
- `security.redactSensitiveData`: redacta contrasenas, tarjetas, SSN, API keys y private keys antes de enviar.
- `security.maxTextLength`: limita texto enviado a servicios externos.

## Seguridad

El widget no guarda datos en `localStorage`. Antes de enviar un ticket a webhook, email, WhatsApp o copia, redacta informacion sensible comun. Para envio automatico real usa siempre `https://` y nunca pongas API keys de IA en el navegador.

Si usas `assistantWebhookUrl`, las claves de SerpAPI/Groq deben vivir en el Worker, no en este widget.

## Clasificacion y notificacion

El agente clasifica automaticamente cada ticket en:

- `computers`: computadoras, Windows, Mac, impresoras, virus, backup.
- `phones`: telefonos, iPhone, Android, pantalla, bateria.
- `drones`: drones, DJI, calibracion, helice, control, camara.
- `ai`: IA, chatbots, automatizacion, prompts.
- `network`: internet, Wi-Fi, router, red.
- `sales`: ventas, productos, accesorios, precios, cotizaciones, compras.
- `information`: informacion general, preguntas sobre servicios, horarios o reservas.
- `general`: cualquier caso que no tenga una coincidencia clara.

Ruteo actual:

- Ventas, productos y accesorios: `sales@ezemtech.com,listercampos@gmail.com`.
- Todo lo demas: `info@ezemtech.com,listercampos@gmail.com`.
- WhatsApp, mensajes y llamadas: `+1 646 842 2766`.

Si configuras `technicianEmails`, el boton **Notificar tecnico** abre un email dirigido al tecnico correcto. Si configuras `webhookUrl`, el payload tambien incluye `classification`, `classificationLabel` y `technicianEmail` para que Zapier, Make o n8n envie el correo automaticamente.

## Conexion a Google Sheets

Esta es la forma rapida de que el agente "aprenda" sin tocar codigo. Cada vez que editas el Google Sheet, el widget puede leer las nuevas respuestas publicadas.

1. Crea un Google Sheet.
2. Usa estas columnas: `language`, `keywords`, `response`.
3. Copia el contenido de `google-knowledge-template.csv` como ejemplo.
4. En Google Sheets, ve a **File > Share > Publish to web**.
5. Elige la hoja y publica como **Comma-separated values (.csv)**.
6. Copia la URL CSV y pegala en `knowledgeBaseUrl`.

Ejemplo de filas:

```csv
language,keywords,response
es,"computadora lenta,lenta,windows","Reinicia el equipo y verifica espacio disponible. EZEMTECH puede revisar malware, inicio y disco."
en,"slow computer,slow,windows","Restart the computer and check available space. EZEMTECH can review malware, startup and disk health."
```

Importante: no pongas contrasenas, datos privados de clientes ni informacion sensible en esa hoja si la publicas como CSV.

## Carpeta para PDFs e imagenes

Tambien se incluye `knowledge-dropbox/` para que pegues documentos que quieras convertir en conocimiento del agente:

- `knowledge-dropbox/pdfs/`
- `knowledge-dropbox/images/`
- `knowledge-dropbox/processed/local-knowledge.csv`

El navegador no puede leer PDFs o imagenes directamente desde una carpeta local por seguridad. La forma correcta es extraer o resumir la informacion importante y ponerla en `processed/local-knowledge.csv` o en Google Sheets con las columnas `language`, `keywords`, `response`.

## Flujo incluido

1. Idioma: Espanol o Ingles.
2. Tipo de problema.
3. Urgencia.
4. Soporte remoto, presencial o no seguro.
5. Recomendacion automatica desde Google Sheets cuando exista una coincidencia.
6. Datos del cliente.
7. Resumen listo para enviar o copiar.

## Voz y microfono

El widget incluye botones de voz en el encabezado:

- Activar voz: el agente lee sus respuestas en voz alta.
- Microfono: permite dictar la descripcion del problema cuando el formulario esta abierto.

Estas funciones usan capacidades del navegador. En Chrome y Edge suelen funcionar mejor; el microfono requiere permiso del usuario y una pagina HTTPS o `localhost`.
