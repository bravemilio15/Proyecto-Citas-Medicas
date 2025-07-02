# Sistema de Autenticación - Citas Médicas

Este proyecto implementa un sistema completo de autenticación usando Firebase Auth para una aplicación de citas médicas.

## 🚀 Características

- **Autenticación con Firebase**: Login y registro de usuarios
- **Validación de formularios**: Validación en tiempo real con mensajes de error
- **Diseño responsivo**: Interfaz moderna y adaptable a diferentes dispositivos
- **Manejo de estados**: Loading, error y success states
- **Arquitectura modular**: Separación clara de responsabilidades

## 📁 Estructura del Proyecto

```
frontend/src/
├── components/          # Componentes React
│   ├── AuthPage.jsx     # Página principal de autenticación
│   ├── LoginForm.jsx    # Formulario de login
│   ├── RegisterForm.jsx # Formulario de registro
│   ├── Dashboard.jsx    # Panel principal después del login
│   └── index.js         # Barrel file para exportaciones
├── hooks/               # Custom hooks
│   └── useAuth.js       # Hook para manejo de autenticación
├── lib/                 # Servicios y configuración
│   ├── firebase.js      # Configuración de Firebase
│   ├── auth.js          # Servicio de autenticación
│   └── index.js         # Barrel file para exportaciones
├── utils/               # Utilidades
│   └── validation.js    # Funciones de validación
└── App.jsx              # Componente principal
```

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework de UI
- **Firebase Auth**: Autenticación de usuarios
- **CSS3**: Estilos modernos con animaciones
- **Vite**: Build tool y desarrollo

## 🔧 Configuración

### 1. Instalación de dependencias

```bash
npm install
```

### 2. Configuración de Firebase (IMPORTANTE)

**⚠️ CRÍTICO**: Las credenciales de Firebase están protegidas con variables de entorno.

```bash
# Configurar variables de entorno automáticamente
npm run setup-env

# Editar el archivo .env con tus credenciales reales
# Ver SECURITY.md para instrucciones detalladas
```

### 3. Verificar configuración

```bash
npm run check-env
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 🔒 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- Usa diferentes proyectos Firebase para desarrollo/producción
- Revisa `SECURITY.md` para mejores prácticas

## 📋 Funcionalidades

### Autenticación

- **Login**: Los usuarios pueden iniciar sesión con email y contraseña
- **Registro**: Los usuarios pueden crear una nueva cuenta
- **Logout**: Los usuarios pueden cerrar sesión
- **Persistencia**: La sesión se mantiene entre recargas de página

### Validaciones

- **Email**: Formato válido de email
- **Contraseña**: Mínimo 6 caracteres
- **Nombre**: Mínimo 2 caracteres, máximo 50
- **Campos requeridos**: Todos los campos son obligatorios

### Manejo de Errores

- **Errores de Firebase**: Traducidos a mensajes en español
- **Errores de validación**: Mostrados en tiempo real
- **Estados de carga**: Indicadores visuales durante operaciones

## 🎨 Diseño

### Características del UI

- **Gradientes modernos**: Fondo con gradiente atractivo
- **Animaciones suaves**: Transiciones y efectos visuales
- **Responsive**: Adaptable a móviles, tablets y desktop
- **Accesibilidad**: Contraste adecuado y navegación por teclado

### Paleta de Colores

- **Primario**: `#667eea` a `#764ba2` (gradiente)
- **Error**: `#e74c3c`
- **Texto**: `#333` (principal), `#666` (secundario)
- **Fondo**: `#f5f7fa` a `#c3cfe2` (gradiente)

## 🔒 Seguridad

- **Validación del lado del cliente**: Previene envío de datos inválidos
- **Manejo seguro de errores**: No expone información sensible
- **Autenticación Firebase**: Sistema robusto y probado

## 📱 Responsive Design

El sistema está optimizado para:

- **Móviles**: 320px - 480px
- **Tablets**: 481px - 768px
- **Desktop**: 769px+

## 🚀 Uso

### Para Usuarios

1. **Registro**: Completa el formulario con nombre, email y contraseña
2. **Login**: Usa tu email y contraseña para acceder
3. **Dashboard**: Accede a las funcionalidades de citas médicas
4. **Logout**: Cierra sesión cuando termines

### Para Desarrolladores

#### Agregar nuevas validaciones

```javascript
// En utils/validation.js
export const validateNewField = (value) => {
  // Tu lógica de validación
  return {
    isValid: true,
    message: ''
  };
};
```

#### Crear nuevos componentes

```javascript
// En components/NewComponent.jsx
import { useAuth } from '../hooks/useAuth.js';

export const NewComponent = () => {
  const { user } = useAuth();
  // Tu lógica del componente
};
```

## 🔄 Flujo de Autenticación

1. **Inicio**: La app verifica si hay una sesión activa
2. **No autenticado**: Muestra la página de login/registro
3. **Autenticado**: Muestra el dashboard
4. **Logout**: Vuelve a la página de autenticación

## 📝 Próximas Mejoras

- [ ] Autenticación con Google/Facebook
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Perfil de usuario editable
- [ ] Roles de usuario (paciente/doctor)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
