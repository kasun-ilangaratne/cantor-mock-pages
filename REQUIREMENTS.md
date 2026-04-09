# Cantor Application - Requirements Document

## 1. Project Overview

### 1.1 Application Purpose
Cantor is a financial consolidation and reporting application designed for managing consolidated result units, dimensions, and financial data across multiple companies in a group structure. The application supports Norwegian (Bokmål) and English languages.

### 1.2 Target Users
- Financial controllers and accountants
- Group consolidation specialists
- Financial reporting teams
- Auditors and compliance officers

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Dimensions Management
**Purpose**: Manage organizational dimensions for financial reporting and consolidation.

**Requirements**:
- Create, read, update, and delete (CRUD) dimensions
- Maximum of 11 dimensions allowed per system
- Unique dimension names required
- Support for dimension values with text descriptions
- Special handling for "Group of Companies" dimension value (ID: "0")
- Cannot delete dimensions that have associated values
- Export functionality to PDF and Excel formats

**Business Rules**:
- Dimension IDs: 1-11
- Dimension Value IDs: String format, "0" reserved for Group of Companies
- Dimension names must be unique (case-insensitive)

#### 2.1.2 Consolidated Result Unit Management
**Purpose**: Configure and manage consolidated result units for group financial reporting.

**Core Sections**:

**Basic Information**:
- Dimension Number (Dimnr)
- Dimension ID (DimId)
- Name (Navn)
- Column Text 1 (Kolonnetekst 1)
- Column Text 2 (Kolonnetekst 2)
- Dimension Text (Dimtekst)

**Group Relationship (Konsernforhold)**:
- Company Number (Firmanr)
- Group Dimension Number (Konserndim)
- Parent relationship toggle
- Account duplication settings
- Include all dimensions option
- Dimension filter configuration
- Net method settings

**Currency Management**:
- Currency selection (Currency, Deullaroi)
- Translation method configuration
- Periodic translation settings
- FX gain/loss account configuration
- Offset account settings
- FX elimination display options
- Result appropriation settings
- P&L account ranges
- Equity account ranges
- OCI account configuration
- Profit allocation settings

**Opening Balance**:
- Opening balance start year
- Opening balance equity
- Opening balance FX translation

**Restrictions**:
- Share percentage
- Consolidation period ranges
- Balance-only first period option

**Minority Interests**:
- P&L account ranges for minority
- Minority share percentage
- Minority result and balance accounts
- Minority share of equity opening balance

**Tax Computation**:
- P&L account ranges for tax
- Tax rate percentage
- Tax result and balance accounts
- IFRS entries inclusion option

### 2.2 Dialog Components

#### 2.2.1 Exception Dialog
**Purpose**: Manage accounts excluded from counterparty calculations.

**Features**:
- Display list of excluded accounts with account numbers and names
- Delete functionality for exceptions
- Tooltip support for user guidance
- Norwegian/English bilingual interface

#### 2.2.2 Counterparty Dialog
**Purpose**: Manage counterparty relationships and calculations.

#### 2.2.3 Dimension Filter Dialog
**Purpose**: Configure dimension-based filtering for consolidation.

#### 2.2.4 Eliminations Dialog
**Purpose**: Manage intercompany eliminations and adjustments.

#### 2.2.5 Alternative Calculation Dialog
**Purpose**: Configure alternative calculation methods.

#### 2.2.6 Historical Cost Dialog
**Purpose**: Manage historical cost calculations and adjustments.

#### 2.2.7 Change Dialog
**Purpose**: Track and manage changes to consolidation settings.

### 2.3 Navigation and Routing
- Feature-based routing with lazy loading
- Default route to consolidated result unit
- Dimensions management route
- Responsive navigation structure

## 3. Technical Requirements

### 3.1 Technology Stack
- **Frontend Framework**: Angular 17
- **Language**: TypeScript 5.2
- **UI Framework**: Angular Material 17.3.10
- **State Management**: RxJS 7.8.0
- **Forms**: Angular Reactive Forms
- **Testing**: Jasmine/Karma
- **Build Tool**: Angular CLI 17.0.0

### 3.2 Architecture Requirements
- **Modular Architecture**: Feature-based modules with lazy loading
- **Component-Based**: Reusable Angular components
- **Service Layer**: Business logic separation
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Material Design principles

### 3.3 Performance Requirements
- **Initial Load**: < 3 seconds
- **Form Response**: < 500ms for user interactions
- **Dialog Loading**: < 1 second
- **Export Operations**: < 5 seconds for standard reports

### 3.4 Security Requirements
- **Input Validation**: All form inputs validated
- **Data Sanitization**: XSS prevention
- **Access Control**: Role-based access (future enhancement)
- **Audit Trail**: Change tracking (future enhancement)

## 4. User Interface Requirements

### 4.1 Design Principles
- **Material Design**: Following Google Material Design guidelines
- **Bilingual Support**: Norwegian (Bokmål) and English
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile and desktop compatibility

### 4.2 Form Design
- **Expandable Sections**: Collapsible form sections for better UX
- **Validation Feedback**: Real-time form validation
- **Grid Layout**: Responsive form field arrangement
- **Consistent Styling**: Unified visual design

### 4.3 Dialog Design
- **Modal Dialogs**: Material dialog components
- **Data Tables**: Sortable and filterable data display
- **Action Buttons**: Clear call-to-action buttons
- **Loading States**: User feedback during operations

## 5. Data Requirements

### 5.1 Data Models
- **Dimension**: ID, name
- **DimensionValue**: ID, dimensionId, text
- **ConsolidatedResultUnit**: Comprehensive form data model
- **ExceptionData**: Account number and name pairs

### 5.2 Data Validation
- **Required Fields**: Mandatory field validation
- **Format Validation**: Input format requirements
- **Business Rules**: Domain-specific validation rules
- **Cross-field Validation**: Dependent field validation

## 6. Integration Requirements

### 6.1 Current State
- **Mock Data**: Currently using in-memory data services
- **No Backend**: Frontend-only implementation

### 6.2 Future Integration Points
- **REST API**: Backend service integration
- **Database**: Persistent data storage
- **Authentication**: User authentication system
- **Authorization**: Role-based access control
- **Audit Logging**: Change tracking and logging

## 7. Testing Requirements

### 7.1 Unit Testing
- **Component Testing**: All Angular components
- **Service Testing**: Business logic services
- **Form Testing**: Form validation and submission
- **Dialog Testing**: Modal dialog interactions

### 7.2 Integration Testing
- **Module Testing**: Feature module integration
- **Routing Testing**: Navigation and routing
- **Service Integration**: Service layer testing

### 7.3 E2E Testing
- **User Workflows**: Complete user journey testing
- **Form Submissions**: End-to-end form processing
- **Dialog Interactions**: Modal dialog workflows

## 8. Deployment Requirements

### 8.1 Build Configuration
- **Production Build**: Optimized for deployment
- **Development Build**: Source maps and debugging
- **Asset Optimization**: CSS and JS minification
- **Bundle Analysis**: Performance monitoring

### 8.2 Environment Configuration
- **Development**: Local development setup
- **Staging**: Pre-production environment
- **Production**: Live application deployment

## 9. Maintenance Requirements

### 9.1 Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting consistency
- **Documentation**: Inline code documentation

### 9.2 Performance Monitoring
- **Bundle Size**: Regular bundle analysis
- **Load Times**: Performance monitoring
- **Error Tracking**: Application error logging
- **User Analytics**: Usage pattern analysis

## 10. Future Enhancements

### 10.1 Planned Features
- **Backend Integration**: REST API implementation
- **Database**: Persistent data storage
- **Authentication**: User login system
- **Multi-tenancy**: Multi-company support
- **Advanced Reporting**: Enhanced export capabilities
- **Real-time Updates**: Live data synchronization

### 10.2 Scalability Considerations
- **Microservices**: Service-oriented architecture
- **Caching**: Performance optimization
- **CDN**: Content delivery optimization
- **Load Balancing**: High availability setup

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 3 months] 