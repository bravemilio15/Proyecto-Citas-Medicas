# 🔒 Guía de Seguridad - Variables de Entorno

## ⚠️ IMPORTANTE: Protección de Credenciales

Este proyecto utiliza Firebase para la autenticación. Es **CRÍTICO** proteger las credenciales de Firebase para evitar que usuarios maliciosos accedan a tu proyecto.

## 🚨 ¿Por qué es importante?

- **API Keys expuestas** pueden ser usadas por cualquiera
- **Proyectos Firebase** pueden ser comprometidos
- **Costos inesperados** por uso no autorizado
- **Datos sensibles** pueden ser accedidos

## 📁 Archivos de Configuración

### Archivos que SÍ se suben al repositorio:
- ✅ `env.example` - Plantilla con variables vacías
- ✅ `scripts/setup-env.js` - Script de configuración
- ✅ `src/lib/firebase.js` - Código que usa las variables

### Archivos que NO se suben al repositorio:
- ❌ `.env` - Credenciales reales (en .gitignore)
- ❌ `.env.local` - Variables locales
- ❌ `.env.production` - Variables de producción

## 🔧 Configuración Inicial

### 1. Crear archivo .env

```bash
# Opción 1: Usar el script automático
npm run setup-env

# Opción 2: Manual
cp env.example .env
```

### 2. Configurar credenciales

Edita el archivo `.env` con tus credenciales reales:

```env
VITE_FIREBASE_API_KEY=tu_api_key_real_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 3. Verificar configuración

```bash
npm run check-env
```

## 🔍 Obtener Credenciales de Firebase

### 1. Ir a Firebase Console
- Visita [console.firebase.google.com](https://console.firebase.google.com)
- Selecciona tu proyecto

### 2. Configuración del proyecto
- Ve a ⚙️ > Configuración del proyecto
- Pestaña "General"
- Sección "Tus apps" > Web app

### 3. Copiar configuración
```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 🛡️ Mejores Prácticas de Seguridad

### ✅ Hacer:
- [ ] Usar variables de entorno para todas las credenciales
- [ ] Mantener `.env` en `.gitignore`
- [ ] Usar diferentes proyectos Firebase para desarrollo/producción
- [ ] Revisar regularmente los logs de Firebase
- [ ] Configurar reglas de seguridad en Firestore
- [ ] Habilitar autenticación solo para dominios autorizados

### ❌ NO hacer:
- [ ] Nunca subir credenciales al repositorio
- [ ] No compartir archivos `.env` por email/chat
- [ ] No usar credenciales de producción en desarrollo
- [ ] No exponer API keys en el código fuente
- [ ] No usar credenciales hardcodeadas

## 🔄 Flujo de Desarrollo Seguro

### Para nuevos desarrolladores:

1. **Clonar repositorio**
   ```bash
   git clone <repo-url>
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   npm run setup-env
   # Editar .env con credenciales reales
   ```

4. **Verificar configuración**
   ```bash
   npm run check-env
   ```

5. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

## 🚀 Despliegue Seguro

### Variables de entorno en producción:

- **Vercel**: Configurar en Settings > Environment Variables
- **Netlify**: Configurar en Site Settings > Environment Variables
- **Heroku**: Usar `heroku config:set`
- **Docker**: Usar `--env-file` o variables de entorno del sistema

### Ejemplo para Vercel:
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... repetir para todas las variables
```

## 🔍 Verificación de Seguridad

### Comandos útiles:

```bash
# Verificar que .env no está en git
git status

# Verificar variables configuradas
npm run check-env

# Buscar credenciales hardcodeadas
grep -r "AIzaSy" src/
grep -r "firebaseapp.com" src/
```

## 🆘 Solución de Problemas

### Error: "Missing Firebase environment variables"

1. Verificar que existe el archivo `.env`
2. Verificar que las variables empiezan con `VITE_`
3. Reiniciar el servidor de desarrollo
4. Ejecutar `npm run check-env`

### Error: "Firebase configuration error"

1. Verificar que todas las variables están configuradas
2. Verificar que los valores son correctos
3. Verificar que no hay espacios extra en `.env`

## 📞 Soporte

Si encuentras problemas de seguridad:

1. **Inmediatamente**: Revoca las credenciales comprometidas en Firebase Console
2. **Generar nuevas**: Crear nuevas credenciales en Firebase
3. **Actualizar**: Cambiar todas las variables de entorno
4. **Notificar**: Informar al equipo sobre el incidente

---

**Recuerda**: La seguridad es responsabilidad de todos. Siempre verifica que las credenciales estén protegidas antes de hacer commit. 