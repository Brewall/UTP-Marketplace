# Guía de Seguridad - UTP Marketplace

Documento de referencia sobre prácticas de seguridad implementadas y recomendaciones para el mantenimiento seguro del proyecto.

## Estado Actual del Proyecto

### Sistema de Autenticación
- **Implementación actual**: Autenticación mock con LocalStorage
- **Datos persistidos**: sessionStorage para sesiones, localStorage para usuarios registrados
- **Validaciones**: Correos institucionales UTP (`u########@utp.edu.pe` o `@autonoma.pe`)
- **Contraseñas**: Validación básica (mínimo 6 caracteres)

### Almacenamiento de Datos
- **LocalStorage**: Productos, carritos, órdenes, usuarios
- **Prefijos**: `utp_marketplace_*` para evitar colisiones
- **Sin encriptación**: Los datos son visibles en el navegador (apropiado para desarrollo/demo)

### Variables de Entorno
- **Configuración**: `.env.example` incluido, `.env` en `.gitignore`
- **Formato**: Variables con prefijo para integración futura
- **Firebase**: Configuración preparada pero no implementada

## Consideraciones de Seguridad por Capa

### 1. Autenticación y Autorización

**Estado Actual (LocalStorage)**
- Sesiones en sessionStorage (se pierden al cerrar navegador)
- Usuarios en localStorage (persisten)
- Sin cifrado de contraseñas
- Sin tokens JWT

**Migración Futura (Firebase)**
- Autenticación con Firebase Auth
- Tokens JWT automáticos
- Refresh tokens
- Cierre de sesión seguro
- Verificación de correo electrónico

### 2. Validación de Datos

**Implementadas**
- Validación de correos UTP (`isValidUTPEmail`)
- Validación de precios (`isValidPrice`)
- Sanitización HTML básica (`sanitizeHTML`)
- Validación de texto (`isValidText`)

**Recomendaciones**
- Agregar validación de longitud máxima en campos
- Implementar rate limiting para formularios
- Validar tipos de archivo en uploads (cuando se implementen)

### 3. Gestión de Dependencias

**Scripts Disponibles**
```bash
npm run audit:check     # Auditoría con nivel crítico/alto
npm run security:check  # Auditoría completa
npm run deps:outdated   # Dependencias desactualizadas
npm audit fix           # Corrección automática
```

**Política de Actualizaciones**
- Revisar CHANGELOG antes de actualizar versiones mayores
- Probar localmente después de actualizar
- Verificar `npm audit` después de cada instalación

### 4. Protección de Datos Sensibles

**Actualmente NO almacenar**
- Datos de tarjetas de crédito
- Información personal identificable (PII) sensible
- Contraseñas en texto plano

**Para Producción**
- Implementar Firebase Auth (contraseñas cifradas)
- Usar Firestore con reglas de seguridad
- Implementar HTTPS obligatorio
- Agregar Content Security Policy (CSP)

## Buenas Prácticas de Desarrollo

### Manejo de Errores
```javascript
// EVITAR: Exponer detalles internos
catch (error) {
  alert(error.stack); // NO
}

// CORRECTO: Mensajes genéricos al usuario
catch (error) {
  console.error('Error interno:', error);
  setError('Ocurrió un error. Intenta nuevamente.');
}
```

### Sanitización de Entradas
```javascript
import { sanitizeHTML, isValidText } from '@/utils/validators';

// Siempre validar antes de usar
const productName = sanitizeHTML(userInput);
if (!isValidText(productName)) {
  throw new Error('Nombre inválido');
}
```

### Código Cliente
- No exponer claves API en el código frontend
- No registrar información sensible en `console.log`
- Evitar `eval()` y `dangerouslySetInnerHTML`
- Validar datos antes de persistir en LocalStorage

## Checklist de Seguridad Pre-Producción

### Antes de Migrar a Firebase
- [ ] Configurar Firebase Auth con correos UTP
- [ ] Implementar reglas de seguridad Firestore
- [ ] Configurar CORS apropiadamente
- [ ] Establecer límites de rate limiting
- [ ] Habilitar logging de accesos

### Configuración de Entorno
- [ ] Verificar que `.env` esté en `.gitignore`
- [ ] Configurar variables en plataforma de hosting
- [ ] Usar secretos seguros para Firebase
- [ ] Implementar HTTPS con certificado válido

### Testing de Seguridad
- [ ] Probar validaciones del lado del cliente
- [ ] Verificar que no haya XSS en campos de texto
- [ ] Comprobar que LocalStorage no contenga datos sensibles
- [ ] Auditar permisos de Firestore (cuando aplique)

## Comandos de Auditoría

```bash
# Auditoría de vulnerabilidades (falla con nivel alto o superior)
npm run audit:check

# Auditoría completa con reporte detallado
npm run security:check

# Listar paquetes desactualizados
npm run deps:outdated

# Intentar corregir vulnerabilidades automáticamente
npm audit fix

# Actualizar dependencias menores de forma segura
npm update
```

## Recursos y Referencias

### Documentación Oficial
- [npm audit](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [React Security Best Practices](https://react.dev/learn)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Avisos de Seguridad
- [GitHub Security Advisories](https://github.com/advisories)
- [Snyk Vulnerability Database](https://security.snyk.io/)

### Herramientas Adicionales
- [npm audit](https://docs.npmjs.com/cli/v9/commands/npm-audit) - Auditoría integrada
- [Snyk](https://snyk.io/) - Monitoreo continuo de vulnerabilidades
- [Dependabot](https://github.com/dependabot) - Actualizaciones automáticas

## Contacto y Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad en el proyecto:

1. **NO** abras un issue público
2. Envía un correo a los mantenedores del proyecto
3. Incluye detalles técnicos y pasos para reproducir
4. Espera confirmación antes de divulgar públicamente

## Historial de Cambios de Seguridad

### Noviembre 2025
- Implementación inicial con LocalStorage
- Validaciones básicas de correos UTP
- Configuración de estructura para Firebase
- Sanitización HTML básica implementada

---

**Nota**: Este documento debe actualizarse cada vez que se implementen cambios relacionados con seguridad o se detecten nuevas vulnerabilidades.

## Comandos
```bash
# Auditoría de vulnerabilidades (falla con nivel alto o superior)
npm run audit:check

# Auditoría completa
npm run security:check

# Listar paquetes desactualizados
npm run deps:outdated

# Intentar corregir vulnerabilidades automáticamente
npm run audit:fix

# Ver versiones de dependencias clave
npm ls nth-check postcss webpack-dev-server
```

## Overrides en uso
```json
{
  "overrides": {
    "nth-check": "^2.1.1",
    "postcss": "^8.4.31",
    "webpack-dev-server": "^4.15.2"
  }
}
```

## Referencias
- npm audit: https://docs.npmjs.com/cli/v9/commands/npm-audit
- Documentación de React: https://react.dev/learn
- Avisos de seguridad de GitHub: https://github.com/advisories
