# Agente de Ayuda Lógica para Desarrollo de Ejercicios 🤖

Un tutor de lógica personal potenciado por IA para asistir en el desarrollo y traducción a código de ejercicios de programación.

## 📋 Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura MVC](#arquitectura-mvc)
- [Plan de Desarrollo](#plan-de-desarrollo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Roadmap](#roadmap)
- [Contribución](#contribución)

## 🎯 Resumen del Proyecto

**AgentLogic** es una herramienta interactiva que combina inteligencia artificial con una interfaz intuitiva para ayudar a desarrolladores y estudiantes a:

- **Comprender la lógica** detrás de problemas de programación
- **Visualizar soluciones** mediante diagramas de flujo
- **Traducir lógica a código** en múltiples lenguajes
- **Aprender de forma interactiva** con un chatbot especializado

## ✨ Características Principales

### 🧠 Capacidades de IA
- **Análisis de problemas**: Interpreta enunciados complejos
- **Generación de lógica**: Crea soluciones paso a paso
- **Diagramas de flujo**: Visualización automática de algoritmos
- **Traducción de código**: Convierte lógica a múltiples lenguajes
- **Chatbot interactivo**: Responde dudas en tiempo real

### 📚 Gestión de Ejercicios
- **Catálogo preestablecido**: Base de datos de ejercicios clásicos
- **Importación flexible**: Copia/pega o carga de archivos
- **Historial personal**: Seguimiento de progreso
- **Múltiples lenguajes**: Python, JavaScript, Java, C++, etc.

### 🎨 Interfaz de Usuario
- **Diseño responsivo**: Optimizado para desktop y móvil
- **Editor de código integrado**: Syntax highlighting
- **Notificaciones inteligentes**: Feedback en tiempo real
- **Temas personalizables**: Light/Dark mode

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de componentes UI
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de utilidades CSS
- **Daisy UI** - Componentes pre-estilizados
- **CodeMirror** - Editor de código avanzado
- **React Hot Toast** - Sistema de notificaciones
- **Vite** - Build tool y dev server

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Tipado estático para el servidor
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación de usuarios
- **Multer** - Manejo de archivos
- **Cors** - Gestión de CORS

### Inteligencia Artificial
- **Gemini 1.5 Flash** - Modelo de lenguaje principal
- **OpenAI API** - Modelo alternativo/complementario
- **LangChain** - Framework para aplicaciones de IA
- **Vector Database** - Almacenamiento de embeddings

### DevOps & Herramientas
- **Docker** - Containerización
- **Vitest** - Testing framework (rápido y moderno)
- **Testing Library** - Utilities para testing de componentes
- **MSW** - Mock Service Worker para API mocking
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formateador de código
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD

## 🏗️ Arquitectura MVC

### Modelo (Model)
**Ubicación**: `backend/src/models/`

#### Entidades Principales:
```typescript
// User.ts - Gestión de usuarios
interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  preferences: UserPreferences;
  createdAt: Date;
}

// Exercise.ts - Ejercicios de programación
interface IExercise {
  _id: ObjectId;
  title: string;
  description: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  testCases: TestCase[];
  solution?: string;
  createdAt: Date;
  userId?: ObjectId;
}

// Solution.ts - Soluciones generadas
interface ISolution {
  _id: ObjectId;
  exerciseId: ObjectId;
  userId: ObjectId;
  logicSteps: string[];
  flowchartData: FlowchartNode[];
  generatedCode: CodeSolution[];
  feedback: AIFeedback;
  createdAt: Date;
}

// Session.ts - Sesiones de chat
interface ISession {
  _id: ObjectId;
  userId: ObjectId;
  exerciseId?: ObjectId;
  messages: ChatMessage[];
  context: SessionContext;
  createdAt: Date;
  updatedAt: Date;
}
```

### Vista (View)
**Ubicación**: `frontend/src/components/`

#### Componentes Principales:
```
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Layout.tsx
├── exercise/
│   ├── ExerciseList.tsx
│   ├── ExerciseDetail.tsx
│   ├── ExerciseEditor.tsx
│   └── ExerciseImporter.tsx
├── solution/
│   ├── LogicSteps.tsx
│   ├── FlowchartViewer.tsx
│   ├── CodeGenerator.tsx
│   └── SolutionHistory.tsx
├── chat/
│   ├── ChatInterface.tsx
│   ├── MessageBubble.tsx
│   └── ChatInput.tsx
├── common/
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
└── editor/
    ├── CodeEditor.tsx
    ├── FileUpload.tsx
    └── SyntaxHighlighter.tsx
```

### Controlador (Controller)
**Ubicación**: `backend/src/controllers/`

#### Controladores Principales:
```typescript
// exerciseController.ts
class ExerciseController {
  async getAllExercises(req: Request, res: Response): Promise<void>
  async getExerciseById(req: Request, res: Response): Promise<void>
  async createExercise(req: Request, res: Response): Promise<void>
  async updateExercise(req: Request, res: Response): Promise<void>
  async deleteExercise(req: Request, res: Response): Promise<void>
  async importExercise(req: Request, res: Response): Promise<void>
}

// solutionController.ts
class SolutionController {
  async generateLogic(req: Request, res: Response): Promise<void>
  async createFlowchart(req: Request, res: Response): Promise<void>
  async generateCode(req: Request, res: Response): Promise<void>
  async saveSolution(req: Request, res: Response): Promise<void>
  async getSolutionHistory(req: Request, res: Response): Promise<void>
}

// chatController.ts
class ChatController {
  async createSession(req: Request, res: Response): Promise<void>
  async sendMessage(req: Request, res: Response): Promise<void>
  async getSessionHistory(req: Request, res: Response): Promise<void>
  async endSession(req: Request, res: Response): Promise<void>
}

// aiController.ts
class AIController {
  async processExercise(req: Request, res: Response): Promise<void>
  async generateExplanation(req: Request, res: Response): Promise<void>
  async validateSolution(req: Request, res: Response): Promise<void>
  async optimizeCode(req: Request, res: Response): Promise<void>
}
```

## 📋 Plan de Desarrollo

### Fase 1: Fundación (Semanas 1-2)
**Objetivo**: Establecer la base del proyecto

#### Backend
- [x] Configuración inicial del proyecto Node.js + TypeScript
- [x] Conexión a MongoDB con Mongoose
- [x] Modelo base de Exercise
- [ ] Sistema de autenticación JWT
- [ ] Middleware de validación y error handling
- [ ] Configuración de CORS y seguridad básica

#### Frontend
- [ ] Setup de React + TypeScript + Vite
- [ ] Configuración de Tailwind CSS + Daisy UI
- [ ] Estructura de carpetas y componentes base
- [ ] Sistema de rutas con React Router
- [ ] Configuración de estado global (Context/Redux)

### Fase 2: Funcionalidades Core (Semanas 3-5)
**Objetivo**: Implementar las funcionalidades principales

#### Gestión de Ejercicios
- [ ] CRUD completo de ejercicios
- [ ] Importación de ejercicios (texto/archivo)
- [ ] Categorización y filtrado
- [ ] Sistema de búsqueda

#### Integración IA
- [ ] Configuración de Gemini API
- [ ] Servicio de procesamiento de ejercicios
- [ ] Generación de lógica paso a paso
- [ ] Creación de diagramas de flujo básicos

### Fase 3: Características Avanzadas (Semanas 6-8)
**Objetivo**: Implementar funcionalidades avanzadas

#### Generación de Código
- [ ] Traducción lógica → código
- [ ] Soporte múltiples lenguajes
- [ ] Validación y testing de código
- [ ] Optimización de soluciones

#### Chat Interactivo
- [ ] Interface de chat en tiempo real
- [ ] Contexto de conversación
- [ ] Historial de sesiones
- [ ] Respuestas contextuales

### Fase 4: UX/UI y Optimización (Semanas 9-10)
**Objetivo**: Pulir la experiencia de usuario

#### Interfaz de Usuario
- [ ] Diseño responsivo completo
- [ ] Animaciones y transiciones
- [ ] Temas personalizables
- [ ] Accesibilidad (a11y)

#### Performance
- [ ] Optimización de consultas DB
- [ ] Caching inteligente
- [ ] Lazy loading de componentes
- [ ] Compresión de assets

### Fase 5: Testing y Deploy (Semanas 11-12)
**Objetivo**: Preparar para producción

#### Testing
- [ ] Tests unitarios (Vitest)
- [ ] Tests de componentes (React Testing Library)
- [ ] Tests de integración con MSW
- [ ] Tests E2E (Playwright)
- [ ] Tests de performance y accesibilidad

#### Deployment
- [ ] Containerización con Docker
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en cloud (AWS/Vercel)
- [ ] Monitoreo y logging

## 📁 Estructura del Proyecto

```
agentlogic/
├── backend/                          # Servidor Node.js
│   ├── src/
│   │   ├── controllers/             # Lógica de negocio
│   │   │   ├── exerciseController.ts
│   │   │   ├── solutionController.ts
│   │   │   ├── chatController.ts
│   │   │   └── aiController.ts
│   │   ├── models/                  # Modelos de datos
│   │   │   ├── User.ts
│   │   │   ├── Exercise.ts
│   │   │   ├── Solution.ts
│   │   │   └── Session.ts
│   │   ├── routes/                  # Rutas de la API
│   │   │   ├── exercises.ts
│   │   │   ├── solutions.ts
│   │   │   ├── chat.ts
│   │   │   └── auth.ts
│   │   ├── services/                # Servicios externos
│   │   │   ├── aiService.ts
│   │   │   ├── codeService.ts
│   │   │   └── flowchartService.ts
│   │   ├── middleware/              # Middleware personalizado
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/                   # Utilidades
│   │   │   ├── database.ts
│   │   │   ├── logger.ts
│   │   │   └── constants.ts
│   │   └── index.ts                 # Punto de entrada
│   ├── tests/                       # Tests del backend
│   │   ├── unit/                    # Tests unitarios
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/             # Tests de integración
│   │   │   ├── api/
│   │   │   └── database/
│   │   ├── fixtures/                # Datos de prueba
│   │   │   ├── exercises.json
│   │   │   └── users.json
│   │   ├── helpers/                 # Utilidades de testing
│   │   │   ├── testDB.ts
│   │   │   └── mockServices.ts
│   │   └── setup.ts                 # Configuración global de tests
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts             # Configuración de Vitest
│   └── Dockerfile
├── frontend/                         # Aplicación React
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   │   ├── layout/
│   │   │   ├── exercise/
│   │   │   ├── solution/
│   │   │   ├── chat/
│   │   │   └── common/
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ExercisePage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useExercises.ts
│   │   │   ├── useAI.ts
│   │   │   └── useChat.ts
│   │   ├── services/                # Servicios API
│   │   │   ├── api.ts
│   │   │   ├── exerciseService.ts
│   │   │   └── authService.ts
│   │   ├── store/                   # Estado global
│   │   │   ├── context.tsx
│   │   │   └── reducers.ts
│   │   ├── types/                   # Tipos TypeScript
│   │   │   ├── exercise.ts
│   │   │   ├── solution.ts
│   │   │   └── user.ts
│   │   ├── utils/                   # Utilidades
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── validation.ts
│   │   └── App.tsx
│   ├── tests/                       # Tests del frontend
│   │   ├── components/              # Tests de componentes
│   │   │   ├── layout/
│   │   │   ├── exercise/
│   │   │   ├── solution/
│   │   │   └── common/
│   │   ├── pages/                   # Tests de páginas
│   │   ├── hooks/                   # Tests de custom hooks
│   │   ├── services/                # Tests de servicios
│   │   ├── utils/                   # Tests de utilidades
│   │   ├── mocks/                   # Mocks y fixtures
│   │   │   ├── handlers.ts          # MSW handlers
│   │   │   ├── server.ts            # MSW server setup
│   │   │   └── data.ts              # Datos de prueba
│   │   ├── __tests__/               # Tests de integración
│   │   └── setup.ts                 # Configuración de testing
│   ├── e2e/                         # Tests end-to-end
│   │   ├── specs/
│   │   │   ├── auth.spec.ts
│   │   │   ├── exercises.spec.ts
│   │   │   └── chat.spec.ts
│   │   ├── fixtures/                # Datos para E2E
│   │   └── support/                 # Utilidades E2E
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts               # Configuración Vite + Vitest
│   ├── playwright.config.ts         # Configuración Playwright
│   ├── tailwind.config.js
│   └── tsconfig.json
├── shared/                           # Código compartido (opcional)
│   ├── types/                       # Tipos compartidos
│   │   ├── api.ts
│   │   ├── common.ts
│   │   └── index.ts
│   ├── utils/                       # Utilidades compartidas
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/                            # Documentación
│   ├── api/                         # Documentación de API
│   │   ├── endpoints.md
│   │   └── schemas.md
│   ├── development/                 # Guías de desarrollo
│   │   ├── setup.md
│   │   ├── testing.md
│   │   └── deployment.md
│   ├── architecture/                # Documentación técnica
│   │   ├── database.md
│   │   ├── ai-integration.md
│   │   └── security.md
│   └── user/                        # Documentación de usuario
│       ├── user-guide.md
│       └── faq.md
├── scripts/                         # Scripts de automatización
│   ├── setup.sh                     # Setup inicial del proyecto
│   ├── seed-database.ts             # Poblar BD con datos iniciales
│   ├── generate-types.ts            # Generar tipos desde schemas
│   └── deploy.sh                    # Script de despliegue
├── .github/                         # GitHub Actions
│   ├── workflows/
│   │   ├── ci.yml                   # Integración continua
│   │   ├── cd.yml                   # Despliegue continuo
│   │   ├── security.yml             # Análisis de seguridad
│   │   └── performance.yml          # Tests de performance
│   ├── ISSUE_TEMPLATE/              # Plantillas de issues
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   └── pull_request_template.md     # Plantilla de PR
├── config/                          # Configuraciones globales
│   ├── database.config.ts
│   ├── ai.config.ts
│   └── environment.config.ts
├── docker-compose.yml               # Orquestación de contenedores
├── docker-compose.dev.yml           # Para desarrollo
├── docker-compose.prod.yml          # Para producción
├── .env.example                     # Variables de entorno ejemplo
├── .gitignore
├── .eslintrc.js                     # Configuración ESLint
├── .prettierrc                      # Configuración Prettier
├── vitest.workspace.ts              # Workspace de Vitest para monorepo
├── README.md
└── package.json                     # Scripts del proyecto raíz
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MongoDB 6+
- API Key de Gemini
- Git

### Setup del Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/agentlogic.git
cd agentlogic

# Instalar dependencias completas

## Backend
```bash
cd backend
npm install express mongoose cors helmet morgan bcryptjs jsonwebtoken
npm install -D @types/express @types/mongoose @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D vitest @vitest/ui supertest @types/supertest mongodb-memory-server
npm install -D tsx nodemon typescript @types/node
```

## Frontend  
```bash
cd frontend
npm install react react-dom react-router-dom
npm install -D @vitejs/plugin-react vite typescript
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event msw
npm install -D playwright @playwright/test
npm install tailwindcss daisyui @codemirror/basic-setup codemirror
npm install react-hot-toast lucide-react
```

## Root (scripts compartidos)
```bash
npm install -D concurrently cross-env husky lint-staged
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
```

### Variables de Entorno

```env
# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agentlogic
JWT_SECRET=tu-jwt-secret-super-seguro
GEMINI_API_KEY=tu-api-key-de-gemini
OPENAI_API_KEY=tu-api-key-opcional
CORS_ORIGIN=http://localhost:5173

# Frontend (.env.local)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AgentLogic
```

## 🔧 Guía de Desarrollo

### Comandos Principales

```bash
# Desarrollo
npm run dev                    # Inicia ambos servidores (concurrently)
npm run dev:backend           # Solo backend con hot reload
npm run dev:frontend          # Solo frontend con Vite
npm run dev:db               # Iniciar MongoDB local

# Testing con Vitest
npm run test                 # Ejecuta todos los tests
npm run test:ui              # Interfaz gráfica de Vitest
npm run test:watch           # Tests en modo watch
npm run test:coverage        # Reporte de coverage
npm run test:backend         # Solo tests del backend
npm run test:frontend        # Solo tests del frontend

# Testing E2E
npm run test:e2e             # Tests end-to-end con Playwright
npm run test:e2e:ui          # E2E con interfaz gráfica
npm run test:e2e:debug       # E2E en modo debug

# Build y Deploy
npm run build                # Build de producción completo
npm run build:backend        # Build solo backend
npm run build:frontend       # Build solo frontend
npm run preview              # Preview del build de frontend

# Docker y Contenedores
npm run docker:build         # Construir imágenes Docker
npm run docker:dev           # Levantar entorno de desarrollo
npm run docker:prod          # Levantar entorno de producción
npm run docker:clean         # Limpiar contenedores e imágenes

# Base de datos
npm run db:seed              # Poblar BD con datos iniciales
npm run db:reset             # Resetear base de datos
npm run db:migrate           # Ejecutar migraciones

# Utilidades
npm run lint                 # Ejecutar ESLint
npm run lint:fix             # Arreglar errores de linting
npm run format               # Formatear código con Prettier
npm run type-check           # Verificar tipos TypeScript
npm run generate:types       # Generar tipos desde schemas
```

### Configuración de Testing

#### Vitest Workspace (vitest.workspace.ts)
```typescript
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Frontend tests
  {
    test: {
      name: 'frontend',
      root: './frontend',
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
    },
  },
  // Backend tests  
  {
    test: {
      name: 'backend',
      root: './backend',
      environment: 'node',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
    },
  },
])
```

#### Frontend Testing Setup (frontend/tests/setup.ts)
```typescript
import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Configurar MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))
```

#### Backend Testing Setup (backend/tests/setup.ts)
```typescript
import { beforeAll, afterAll, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})
```

#### Naming
- **Archivos**: camelCase para archivos, PascalCase para componentes
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Tipos**: PascalCase con prefijo `I` para interfaces

#### Estructura de Commits
```
feat: añadir generación de diagramas de flujo
fix: corregir validación de ejercicios
docs: actualizar documentación de API
style: formatear código con prettier
refactor: reorganizar servicios de IA
test: añadir tests para controlador de ejercicios
```

### Workflows de Desarrollo

#### Feature Branch Flow
```bash
# Crear nueva feature
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: implementar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
# Crear Pull Request
```

#### Hotfix Flow
```bash
# Crear hotfix
git checkout -b hotfix/bug-critico
git commit -m "fix: solucionar bug crítico"
git push origin hotfix/bug-critico
# Merge directo a main después de review
```

## 🗺️ Roadmap

### Q1 2024: MVP
- ✅ Configuración base del proyecto
- ✅ Modelos de datos principales
- 🔄 CRUD de ejercicios
- 🔄 Integración básica con IA
- ⏳ Interface de usuario básica

### Q2 2024: Core Features
- ⏳ Generación de diagramas de flujo
- ⏳ Chat interactivo
- ⏳ Generación de código multi-lenguaje
- ⏳ Sistema de usuarios y autenticación

### Q3 2024: Advanced Features
- ⏳ Análisis de código avanzado
- ⏳ Sugerencias de optimización
- ⏳ Integración con GitHub
- ⏳ API pública

### Q4 2024: Scale & Polish
- ⏳ Performance optimizations
- ⏳ Mobile app (React Native)
- ⏳ Marketplace de ejercicios
- ⏳ Certificaciones y badges

## 🤝 Contribución

### Cómo Contribuir
1. Fork el proyecto
2. Crea una feature branch
3. Commit tus cambios
4. Push a la branch
5. Abre un Pull Request

### Guidelines
- Seguir las convenciones de código
- Incluir tests para nueva funcionalidad
- Actualizar documentación cuando sea necesario
- Usar commits semánticos

### Reportar Issues
- Usar las plantillas de issues
- Incluir pasos para reproducir
- Especificar entorno (OS, Node version, etc.)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu-email@ejemplo.com

---

⭐ Si este proyecto te parece útil, ¡considera darle una estrella!
