# Getting Started Locally: Debugging & Fixes

This document outlines the steps taken and issues resolved to make this project runnable on a local machine. Use this as a reference for similar setups in the future.

---

## 1. Initial Attempt: Running the Server
- **Command Used:** `npm run dev`
- **Expected:** The app should start and be accessible at http://localhost:5000
- **Actual:** Error: `sh: tsx: command not found`

### **Root Cause:**
- The dependencies (including `tsx`) were not installed.

### **Solution:**
- Run `npm install` to install all dependencies.

---

## 2. Error: `import.meta.dirname` is undefined
- **Error Message:**
  ```
  TypeError [ERR_INVALID_ARG_TYPE]: The "paths[0]" argument must be of type string. Received undefined
  at Object.resolve (node:path:1097:7)
  at <anonymous> (vite.config.ts:21:17)
  ```

### **Root Cause:**
- `import.meta.dirname` is not natively available in Node.js. It is only available in some ESM environments, and not always as expected in all tools.

### **Solution:**
- Add the following to the top of files using `import.meta.dirname`:
  ```ts
  import { fileURLToPath } from 'url';
  import path from 'path';
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  ```
- Replace all `import.meta.dirname` with `__dirname`.
- Applied this fix in both `vite.config.ts` and `server/vite.ts`.

---

## 3. TypeScript Error: `allowedHosts: boolean` is not assignable
- **Error Message:**
  ```
  Il tipo '{ ... allowedHosts: boolean; }' non è assegnabile al tipo 'ServerOptions'.
  Il tipo 'boolean' non è assegnabile al tipo 'true | string[] | undefined'.
  ```

### **Root Cause:**
- The Vite server config expected `allowedHosts: true` (not just a boolean, but a literal type).

### **Solution:**
- Changed to `allowedHosts: true as const` in `server/vite.ts`.

---

## 4. Port Already in Use
- **Error Message:**
  ```
  Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
  ```

### **Root Cause:**
- The server was already running in the background, so a new instance couldn't bind to the same port.

### **Solution:**
- Stopped the previous process with `pkill -f "tsx server/index.ts"`.
- Restarted the server.

---

## 5. Success!
- After these fixes, the app was accessible at http://localhost:5000 and API requests were working.

---

## **Summary of Key Learnings**
- Always run `npm install` before starting a project for the first time.
- `import.meta.dirname` is not always available; use the `fileURLToPath` workaround for Node.js ESM projects.
- Pay attention to TypeScript literal types in config files.
- If you see `EADDRINUSE`, kill the previous process or use a different port.

---

**Use this checklist for future local setups!** 