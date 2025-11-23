# Guía de seguridad

Resumen de acciones aplicadas y pautas mínimas para mantener el proyecto seguro. Documento en español y sin iconos.

## Acciones aplicadas
- Overrides de npm para dependencias vulnerables: `nth-check` (^2.1.1), `postcss` (^8.4.31), `webpack-dev-server` (^4.15.2).
- Auditoría de seguridad realizada hasta obtener 0 vulnerabilidades.
- Configuración de `.npmrc`: `audit-level=high`, `package-lock=true`, `engine-strict=true`.
- Uso de variables de entorno (`REACT_APP_*`), `.env.example` incluido y `.env` ignorado por Git.
- Scripts en `package.json`: `audit:check`, `audit:fix`, `security:check`, `deps:outdated`.

## Buenas prácticas
- Dependencias: ejecutar `npm audit` con regularidad; revisar `package-lock.json`; evaluar riesgos en actualizaciones mayores.
- Credenciales: no incluir secretos en el repositorio; usar `REACT_APP_*`; no commitear `.env`; definir variables en el proveedor de despliegue.
- Cliente: no registrar datos sensibles en consola; evitar `dangerouslySetInnerHTML` o sanitizar contenido; validar y sanitizar entradas; manejar errores sin filtrar detalles internos.

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
