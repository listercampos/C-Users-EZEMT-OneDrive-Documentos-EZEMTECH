# 🧠 ESTADO MAESTRO — EZEMTECH + Ruflo

> Documento de traspaso (handoff). Cualquier chat nuevo (Cowork, Claude Code o Codex) debe leer esto primero para continuar sin perder contexto.
> Última actualización: 2026-07-21

---

## 1. Contexto del proyecto
- **Empresa:** EZEMTECH (New Jersey). Rol del dueño: Arquitecto Jefe ("System God"), presupuesto **CERO** (solo open-source / freemium).
- **Repo principal:** `listercampos/C-Users-EZEMT-OneDrive-Documentos-EZEMTECH`
  - Contiene: `cloudflare-worker/`, `ezemtech-chat-widget/`, `ezemtech-virtual-tech-app/` (PWA, JS/CSS/HTML).
- **Stack ERP paralelo (local):** Python 3.10+, Flask, SQLite (WAL), JS Vanilla SPA, LM Studio local. IA interna llamada **Emily**.

## 2. Objetivo en curso
Instalar y configurar **Ruflo** (`ruvnet/ruflo`, MIT) — orquestador de enjambre multi-agente para Claude Code / Codex — en el sistema **local** de EZEMTECH, sin costo.

## 3. Lo que YA está hecho ✅
- **Ruflo copiado al repo GitHub** → carpeta `ruflo/` (núcleo runnable, MIT). Commit `6dbde6a`.
  - Se excluyó `v3/@claude-flow` (36 MB, UI web) para aligerar. Pendiente si se quiere completo.
- **Zip entregado** en el chat (`ruflo-ezemtech.zip`, 17 MB) + `instalar-ruflo.bat` incluido.
- **Script de instalación Windows** creado: `ruflo/instalar-ruflo.bat` (verifica Node.js → `npm i -g ruflo` → `npx ruflo init wizard`).

## 4. Pendiente ⏳
1. **Instalación local en la laptop** (Windows, ruta OneDrive/Documentos). Requiere un agente CON acceso al disco local (ver sección 6).
2. (Opcional) Subir `v3/@claude-flow` completo al repo.
3. **Revocar el token GitHub** usado hoy: github.com/settings/tokens?type=beta → Delete.
4. Integrar Ruflo/Emily con las tablas del ERP: `sales`, `products`, `tickets` (crear `core/emily_tools.py`).

## 5. Comando de instalación (en la laptop, dentro de la carpeta `ruflo/`)
```bash
npx ruflo@latest init wizard
```
Requisitos: Node.js (LTS, nodejs.org) + Claude Code o Codex instalados.

## 6. Decisión clave: ¿Cowork, Claude Code o Codex?
- **Cowork (nube):** NO toca el disco local salvo que se conecte el puente del Claude Desktop. Ideal para GitHub, docs, conectores, tareas autónomas multi-herramienta.
- **Claude Code / Codex (local):** corren EN la máquina, con acceso directo a terminal y archivos. **Son los eficientes para instalar/configurar Ruflo localmente.**
- **Ruflo se integra nativamente con Claude Code y Codex**, así que cualquiera de los dos sirve. Recomendación: seguir en el ecosistema Claude (Claude Code) para mantener consistencia con este repo y plugins.

## 7. Primer paso del próximo chat
Abrir un agente **local** (Claude Code o Codex) en la carpeta del proyecto y correr `npx ruflo@latest init wizard`. Si se usa Cowork, primero abrir la app Claude Desktop para activar el puente al disco.
