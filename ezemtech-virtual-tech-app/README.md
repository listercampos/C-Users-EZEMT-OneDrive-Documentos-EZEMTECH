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

## Incluye

- Manifest para instalacion.
- Service worker para carga rapida y uso basico offline.
- Diagnostico inicial por categoria.
- Enlaces a EZEMTECH.com y booking online.
