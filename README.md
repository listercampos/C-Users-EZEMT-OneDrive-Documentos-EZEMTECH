# AGENTE EZEMTECH IA

Agente rapido de servicio tecnico para EZEMTECH. Incluye un widget web bilingue
para atender clientes, identificar el problema, medir urgencia, capturar datos y
generar un resumen listo para el equipo tecnico.

EZEMTECH LLC es una empresa real ubicada en New Jersey, United States. El agente
esta configurado para recomendar EZEMTECH.com cuando aplique y para rutear casos
segun el tipo de solicitud.

## Proyecto incluido

- `ezemtech-chat-widget/`: widget de chat para insertar en EZEMTECH.com.
- `ezemtech-virtual-tech-app/`: app instalable tipo PWA conectada a EZEMTECH.com.
- `cloudflare-worker/`: backend seguro para busqueda en internet + IA con SerpAPI y Groq.

## Funciones

- Atencion en Espanol e Ingles.
- Diagnostico inicial de problemas comunes.
- Captura de nombre, telefono, email, ubicacion, equipo y descripcion.
- Recomendacion de soporte remoto o presencial.
- Resumen listo para email, WhatsApp, booking o webhook.
- Conexion opcional a Google Sheets como base de conocimiento bilingue.
- App instalable para diagnostico de computadoras, drones, telefonos e IA.
- Pantalla principal tipo chat conversacional con logo EZEMTECH.
- Redaccion automatica de datos sensibles y bloqueo de endpoints no HTTPS.

## Ruteo

- Ventas, productos y accesorios: `sales@ezemtech.com,listercampos@gmail.com`.
- Todo lo demas: `info@ezemtech.com,listercampos@gmail.com`.
- WhatsApp, mensajes y llamadas: `+1 646 842 2766`.

## Instalacion

Lee las instrucciones en `ezemtech-chat-widget/README.md`.

## Seguridad

Lee `SECURITY.md` antes de conectar webhooks, IA o automatizaciones con datos de clientes.
