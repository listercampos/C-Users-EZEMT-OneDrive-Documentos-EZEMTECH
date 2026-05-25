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
    contactEmail: "ezemtech@gmail.com,listercampos@gmail.com",
    whatsappNumber: "TU_NUMERO_WHATSAPP_CON_CODIGO_PAIS",
    webhookUrl: "",
    knowledgeBaseUrl: "URL_CSV_PUBLICA_DE_GOOGLE_SHEETS",
    localKnowledgeBaseUrl: "URL_PUBLICA/local-knowledge.csv",
    technicianEmails: {
      computers: "ezemtech@gmail.com,listercampos@gmail.com",
      phones: "ezemtech@gmail.com,listercampos@gmail.com",
      drones: "ezemtech@gmail.com,listercampos@gmail.com",
      ai: "ezemtech@gmail.com,listercampos@gmail.com",
      network: "ezemtech@gmail.com,listercampos@gmail.com",
      general: "ezemtech@gmail.com,listercampos@gmail.com"
    }
  };
</script>
<script src="URL_PUBLICA/widget.js"></script>
```

## Configuracion

- `contactEmail`: email donde quieres recibir tickets.
- `whatsappNumber`: numero en formato internacional sin signos. Ejemplo: `15551234567`.
- `webhookUrl`: URL opcional de Zapier, Make o n8n para crear tickets automaticamente.
- `bookingUrl`: enlace de reservas de EZEMTECH.
- `knowledgeBaseUrl`: URL publica CSV de Google Sheets para que el agente cargue respuestas actualizadas.
- `localKnowledgeBaseUrl`: URL publica de un CSV propio, por ejemplo el archivo generado desde `knowledge-dropbox/processed/local-knowledge.csv`.
- `technicianEmails`: correos por categoria para notificar al tecnico correcto.

## Clasificacion y notificacion

El agente clasifica automaticamente cada ticket en:

- `computers`: computadoras, Windows, Mac, impresoras, virus, backup.
- `phones`: telefonos, iPhone, Android, pantalla, bateria.
- `drones`: drones, DJI, calibracion, helice, control, camara.
- `ai`: IA, chatbots, automatizacion, prompts.
- `network`: internet, Wi-Fi, router, red.
- `general`: cualquier caso que no tenga una coincidencia clara.

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
