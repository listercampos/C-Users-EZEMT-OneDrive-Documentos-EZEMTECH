# EZEMTECH Virtual Tech App

App instalable tipo PWA para clientes de EZEMTECH. Funciona como tecnico virtual para computadoras, telefonos, drones e IA, con diagnostico inicial en Espanol e Ingles.

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

## Correos de tecnicos

Configura los correos en `index.html`:

```html
<script>
  window.EZEMTECH_VIRTUAL_TECH_CONFIG = {
    bookingUrl: "https://www.ezemtech.com/book-online",
    websiteUrl: "https://www.ezemtech.com/",
    whatsappNumber: "16468422766",
    webhookUrl: "",
    technicianEmails: {
      computers: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com",
      phones: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com",
      drones: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com",
      ai: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com",
      network: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com",
      general: "ezemtech@gmail.com,listercampos@gmail.com,info@ezemtech.com,support@ezemtech.com,sales@ezemtech.com"
    }
  };
</script>
```

La app clasifica el caso y usa el correo correcto en **Notificar tecnico**. Si agregas `webhookUrl`, tambien envia los datos a Zapier, Make o n8n para mandar el correo automaticamente.

## Incluye

- Manifest para instalacion.
- Service worker para carga rapida y uso basico offline.
- Diagnostico inicial por categoria.
- Clasificacion automatica de tickets.
- Notificacion por correo segun categoria tecnica.
- Enlaces a EZEMTECH.com y booking online.
