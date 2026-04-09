# Cantor Application - Technical Stack Documentation

## 1. Overview

This document outlines the complete technical stack used in the Cantor financial consolidation application, including frameworks, libraries, tools, and development practices.

## 2. Frontend Framework

### 2.1 Angular Framework
- **Version**: 17.0.0
- **Type**: Full-featured frontend framework
- **Language**: TypeScript 5.2
- **Architecture**: Component-based with dependency injection

**Core Angular Modules Used**:
```typescript
@angular/core          // Core framework functionality
@angular/common        // Common directives and pipes
@angular/forms         // Reactive forms and form validation
@angular/router        // Client-side routing
@angular/platform-browser // Browser-specific functionality
@angular/platform-browser-dynamic // Dynamic bootstrapping
@angular/animations    // Animation support
@angular/compiler      // Template compilation
@angular/compiler-cli  // Command-line compilation
```

### 2.2 TypeScript Configuration
- **Version**: 5.2.0
- **Target**: ES2022
- **Module**: ES2022
- **Strict Mode**: Enabled
- **Decorators**: Enabled for Angular

**Key TypeScript Features**:
- Static type checking
- Interface definitions
- Generic types
- Decorator support
- Advanced ES6+ features

## 3. UI Framework & Components

### 3.1 Angular Material
- **Version**: 17.3.10
- **Design System**: Material Design
- **Components**: Pre-built UI components
- **Theming**: Customizable theming system

**Material Components Used**:
```typescript
MatDialog              // Modal dialogs
MatDialogRef          // Dialog reference
MAT_DIALOG_DATA       // Dialog data injection
MatFormField          // Form field styling
MatInput              // Input components
MatButton             // Button components
MatTable              // Data tables
MatSort               // Sorting functionality
MatPaginator          // Pagination
```

### 3.2 Angular CDK (Component Development Kit)
- **Version**: 17.3.10
- **Purpose**: Low-level component primitives
- **Features**: Accessibility, overlay, portal, and more

**CDK Features Used**:
- Overlay system for dialogs
- Portal system for dynamic content
- Accessibility features
- Focus management

## 4. State Management & Reactive Programming

### 4.1 RxJS (Reactive Extensions)
- **Version**: 7.8.0
- **Purpose**: Reactive programming and async operations
- **Pattern**: Observable/Observer pattern

**RxJS Features Used**:
```typescript
Observable             // Stream of data
of()                   // Create observable from values
throwError()           // Error handling
map()                  // Transform data
filter()               // Filter data
switchMap()            // Switch between observables
catchError()           // Error handling
```

### 4.2 Angular Reactive Forms
- **Purpose**: Form state management
- **Features**: Validation, dynamic forms, form arrays

**Form Features**:
```typescript
FormBuilder            // Form creation
FormGroup              // Form container
FormControl            // Individual form controls
Validators             // Built-in validators
Custom Validators      // Business rule validation
```

## 5. Development Tools & Build System

### 5.1 Angular CLI
- **Version**: 17.0.0
- **Purpose**: Command-line interface for Angular development
- **Features**: Project generation, building, testing, deployment

**CLI Commands Used**:
```bash
ng serve              # Development server
ng build              # Production build
ng test               # Unit testing
ng generate           # Component/service generation
ng lint               # Code linting
```

### 5.2 Build System
- **Builder**: @angular-devkit/build-angular
- **Version**: 17.0.0
- **Configuration**: angular.json

**Build Features**:
- Webpack-based bundling
- Tree shaking for optimization
- Source maps for debugging
- Asset optimization
- CSS/JS minification

### 5.3 TypeScript Compiler
- **Version**: 5.2.0
- **Configuration**: tsconfig.json
- **Features**: Strict type checking, modern JavaScript features

## 6. Testing Framework

### 6.1 Testing Stack
- **Framework**: Jasmine 5.1.0
- **Test Runner**: Karma 6.4.0
- **Browser**: Chrome (karma-chrome-launcher)
- **Coverage**: karma-coverage
- **Reporting**: karma-jasmine-html-reporter

**Testing Features**:
```typescript
describe()             // Test suites
it()                   // Test cases
beforeEach()           // Setup
afterEach()            // Cleanup
expect()               // Assertions
spyOn()                // Mocking
```

### 6.2 Testing Types
- **Unit Tests**: Component and service testing
- **Integration Tests**: Module integration testing
- **E2E Tests**: End-to-end workflow testing (planned)

## 7. Project Structure & Architecture

### 7.1 Module Architecture
```
src/
├── app/
│   ├── features/              # Feature modules
│   │   ├── dimensions/        # Dimensions management
│   │   └── consolidated-result-unit/  # Main feature
│   ├── shared/               # Shared components/services
│   └── app.module.ts         # Root module
├── assets/                   # Static assets
└── styles.css               # Global styles
```

### 7.2 Feature Module Structure
```
feature/
├── feature.module.ts         # Module definition
├── feature.component.ts      # Main component
├── feature.component.html    # Template
├── feature.component.scss    # Styles
├── dialogs/                 # Dialog components
├── services/                # Business logic
└── models.ts               # Type definitions
```

### 7.3 Lazy Loading
- **Pattern**: Route-based code splitting
- **Implementation**: `loadChildren` in routing
- **Benefits**: Reduced initial bundle size

## 8. Styling & Design System

### 8.1 CSS Framework
- **Global Styles**: styles.css
- **Component Styles**: Component-specific SCSS
- **Material Design**: Angular Material theming

### 8.2 Styling Approach
- **Component-Scoped**: Styles encapsulated per component
- **Global Styles**: Shared styles and variables
- **Material Design**: Consistent design language
- **Responsive**: Mobile-first approach

### 8.3 CSS Features
```scss
// Component styles
:host {}                    // Component root
::ng-deep {}               // Deep styling (when needed)
@import                     // Style imports
Variables                   // CSS custom properties
```

## 9. Development Environment

### 9.1 Node.js Ecosystem
- **Package Manager**: npm (package-lock.json)
- **Node Version**: Compatible with Angular 17
- **Scripts**: Defined in package.json

### 9.2 Development Scripts
```json
{
  "start": "ng serve",           // Development server
  "build": "ng build",           // Production build
  "watch": "ng build --watch",   // Watch mode
  "test": "ng test",             // Unit testing
  "ng": "ng"                     // Angular CLI
}
```

### 9.3 IDE Support
- **Recommended**: VS Code with Angular extensions
- **Extensions**: Angular Language Service, TypeScript support
- **Debugging**: Chrome DevTools integration

## 10. Performance & Optimization

### 10.1 Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Lazy loading of modules
- **Minification**: CSS and JS compression
- **Gzip**: Compression for network transfer

### 10.2 Angular Optimizations
- **Change Detection**: OnPush strategy where applicable
- **TrackBy**: Optimized *ngFor loops
- **Pure Pipes**: Stateless transformations
- **AOT Compilation**: Ahead-of-time compilation

### 10.3 Performance Monitoring
- **Bundle Analyzer**: Webpack bundle analysis
- **Lighthouse**: Performance auditing
- **Angular DevTools**: Framework-specific debugging

## 11. Security Considerations

### 11.1 Frontend Security
- **XSS Prevention**: Angular's built-in sanitization
- **Input Validation**: Form validation and sanitization
- **Content Security Policy**: CSP headers (future)
- **HTTPS**: Secure communication (production)

### 11.2 Data Handling
- **Type Safety**: TypeScript prevents type-related issues
- **Form Validation**: Client-side validation
- **Error Handling**: Graceful error management

## 12. Deployment & DevOps

### 12.1 Build Configurations
```json
{
  "development": {
    "optimization": false,
    "sourceMap": true,
    "namedChunks": true
  },
  "production": {
    "optimization": true,
    "sourceMap": false,
    "outputHashing": "all"
  }
}
```

### 12.2 Deployment Targets
- **Static Hosting**: Netlify, Vercel, AWS S3
- **Application Servers**: Node.js, .NET, Java
- **CDN**: Content delivery optimization
- **Container**: Docker containerization (future)

## 13. Third-Party Dependencies

### 13.1 Core Dependencies
```json
{
  "zone.js": "~0.14.2",           // Angular zone management
  "tslib": "^2.3.0",              // TypeScript runtime
  "rxjs": "~7.8.0"                // Reactive programming
}
```

### 13.2 Development Dependencies
```json
{
  "@types/jasmine": "~5.1.0",     // TypeScript definitions
  "karma": "~6.4.0",              // Test runner
  "typescript": "~5.2.0"          // TypeScript compiler
}
```

## 14. Browser Support

### 14.1 Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### 14.2 Polyfills
- **Zone.js**: Angular change detection
- **Modern JavaScript**: ES2022 features
- **CSS Features**: Modern CSS support

## 15. Future Technology Considerations

### 15.1 Potential Upgrades
- **Angular 18**: Next major version
- **Standalone Components**: Migration from NgModules
- **Signals**: New reactivity system
- **Control Flow**: New template syntax

### 15.2 Backend Integration
- **REST APIs**: HTTP client integration
- **GraphQL**: Alternative to REST
- **WebSockets**: Real-time communication
- **Server-Side Rendering**: Angular Universal

### 15.3 Advanced Features
- **PWA**: Progressive Web App features
- **Micro Frontends**: Module federation
- **State Management**: NgRx or Akita
- **Testing**: Playwright for E2E

## 16. Development Workflow

### 16.1 Git Workflow
- **Branch Strategy**: Feature branches
- **Commit Messages**: Conventional commits
- **Code Review**: Pull request workflow
- **CI/CD**: Automated testing and deployment

### 16.2 Code Quality
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Commitlint**: Commit message validation

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 6 months]  
**Maintained By**: Development Team 