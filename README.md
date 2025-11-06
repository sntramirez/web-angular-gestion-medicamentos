# Sistema de Gestión de Medicamentos Hospitalarios

Sistema web desarrollado en Angular para la gestión de medicamentos próximos a caducar y administración de médicos en entornos hospitalarios.

## Características

### Módulos Implementados

1. **Autenticación y Seguridad**
   - Sistema de login con validación de credenciales
   - Protección de rutas mediante guards
   - Gestión de sesiones con localStorage
   - Soporte para múltiples roles (admin, médico, farmacéutico)

2. **Gestión de Medicamentos**
   - Visualización de inventario completo
   - Alertas automáticas de medicamentos próximos a caducar
   - Filtros por estado de caducidad (todos, próximos, caducados)
   - Búsqueda por nombre, lote o proveedor
   - Código de colores para alertas visuales:
     - Verde: Más de 30 días para caducar
     - Naranja: Entre 7 y 30 días
     - Rojo intenso: Menos de 7 días
     - Gris: Caducado

3. **Gestión de Médicos**
   - CRUD completo (Crear, Leer, Actualizar, Eliminar)
   - Filtros por estado (activo/inactivo)
   - Búsqueda por nombre, apellido, especialidad o número de licencia
   - Modal para creación y edición de registros
   - Visualización en tabla responsive

4. **Dashboard**
   - Panel central con acceso rápido a módulos
   - Información del usuario actual
   - Navegación intuitiva

## Tecnologías Utilizadas

- **Angular 20.3.9**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **CSS3**: Estilos y diseño responsive
- **JSON**: Backend simulado (fácilmente reemplazable por servicios REST)

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Componente de autenticación
│   │   ├── dashboard/       # Panel principal
│   │   ├── medicamentos/    # Gestión de medicamentos
│   │   └── medicos/         # Gestión de médicos
│   ├── services/
│   │   ├── auth.service.ts           # Servicio de autenticación
│   │   ├── medicamentos.service.ts   # Servicio de medicamentos
│   │   └── medicos.service.ts        # Servicio de médicos
│   ├── models/
│   │   ├── user.model.ts             # Modelo de usuario
│   │   ├── medicamento.model.ts      # Modelo de medicamento
│   │   └── medico.model.ts           # Modelo de médico
│   ├── guards/
│   │   └── auth.guard.ts             # Guard de autenticación
│   └── app.routes.ts                 # Configuración de rutas
└── assets/
    └── data/
        ├── users.json                # Datos de usuarios
        ├── medicamentos.json         # Datos de medicamentos
        └── medicos.json              # Datos de médicos
```

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- npm (v9 o superior)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd web-angular-gestion-medicamentos
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
ng serve
```

4. Abrir el navegador en:
```
http://localhost:4200
```

## Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| medico1 | medico123 | Médico |
| farmacia | farma123 | Farmacéutico |

## Uso del Sistema

### 1. Login
- Acceder a la página principal
- Ingresar credenciales de uno de los usuarios de prueba
- El sistema redirigirá al dashboard

### 2. Dashboard
- Vista general del sistema
- Acceso a módulos de Medicamentos y Médicos

### 3. Medicamentos
- **Ver todos**: Lista completa del inventario
- **Próximos a Caducar**: Filtra medicamentos con menos de 30 días
- **Caducados**: Muestra medicamentos vencidos
- **Búsqueda**: Buscar por nombre, lote o proveedor

### 4. Médicos
- **Listar**: Ver todos los médicos registrados
- **Crear**: Agregar nuevo médico (botón "Nuevo Médico")
- **Editar**: Modificar datos existentes
- **Eliminar**: Remover médico del sistema
- **Filtrar**: Por estado (activo/inactivo)

## Migración a Backend Real

El sistema está diseñado para migrar fácilmente de JSON a servicios REST:

### Pasos para Migrar:

1. **Actualizar servicios** (`src/app/services/*.service.ts`):
   - Cambiar las URLs de archivos JSON por endpoints REST
   - Ejemplo:
   ```typescript
   // Antes
   private medicamentosDataUrl = '/assets/data/medicamentos.json';

   // Después
   private medicamentosApiUrl = 'https://api.hospital.com/medicamentos';
   ```

2. **Agregar interceptores HTTP** (si es necesario):
   - Para agregar tokens de autenticación
   - Para manejo de errores globales

3. **Actualizar modelos** si el backend requiere campos adicionales

## Scripts Disponibles

```bash
# Desarrollo
ng serve                    # Inicia servidor de desarrollo

# Producción
ng build                    # Construye la aplicación para producción
ng build --configuration production  # Build optimizado

# Tests
ng test                     # Ejecuta tests unitarios
ng e2e                      # Ejecuta tests end-to-end

# Otros
ng generate component nombre  # Genera nuevo componente
ng lint                       # Ejecuta linter
```

## Características Responsive

El sistema está completamente optimizado para dispositivos móviles:
- Navegación adaptable
- Tablas con scroll horizontal en móviles
- Modales ajustables a pantalla
- Botones y controles táctiles optimizados

## Próximas Funcionalidades

- [ ] Módulo de reportes estadísticos
- [ ] Exportación de datos a PDF/Excel
- [ ] Notificaciones push para alertas
- [ ] Historial de cambios en medicamentos
- [ ] Gestión de proveedores
- [ ] Dashboard con gráficos y estadísticas

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor crea un issue en el repositorio.

## Autor

Sistema desarrollado para la gestión eficiente de medicamentos hospitalarios.

---

**Nota**: Este proyecto utiliza JSON para simular un backend. En producción, se recomienda migrar a un backend real con API REST y base de datos.
