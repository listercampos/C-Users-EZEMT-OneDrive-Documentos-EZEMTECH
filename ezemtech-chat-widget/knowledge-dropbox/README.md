# Knowledge Dropbox

Pega aqui los PDFs e imagenes que quieras usar como fuente para el agente de EZEMTECH.

## Carpetas

- `pdfs/`: manuales, procedimientos, listas de servicios, politicas o guias en PDF.
- `images/`: capturas, flyers, fotos de instrucciones o imagenes con informacion util.
- `processed/`: aqui se guarda la informacion convertida a formato que el widget puede leer.

## Como usarlo

1. Pega tus PDFs en `pdfs/`.
2. Pega tus imagenes en `images/`.
3. Extrae o resume la informacion importante en `processed/local-knowledge.csv`.
4. Publica ese CSV o copia sus filas a Google Sheets.
5. Usa la URL CSV en `knowledgeBaseUrl`.

## Formato que entiende el agente

El archivo final debe tener estas columnas:

```csv
language,keywords,response,source
es,"computadora lenta,windows","Respuesta corta que el agente puede decir al cliente.","manual.pdf"
en,"slow computer,windows","Short answer the agent can tell the customer.","manual.pdf"
```

## Importante

No pegues contrasenas, claves de licencia, informacion bancaria ni datos privados de clientes. Usa esta carpeta para conocimiento general de soporte tecnico y atencion al cliente.
