# Gender Healthcare System

A modern React web application providing consultation services and health tracking solutions for women's healthcare.

## 📋 Project Description

Gender Healthcare System is a comprehensive web application designed to support women in managing their reproductive health. The system provides features for menstrual cycle tracking, birth control pill reminders, STI testing appointments, online consultations, and personal health information management.

## ✨ Key Features

### For Customers
- 📅 **Menstrual Cycle Tracking**: Calculate and predict cycles, ovulation timing
- 💊 **Birth Control Pill Management**: Reminders and tracking for pill schedules
- 🧪 **STI Testing Appointments**: Book appointments and track test results
- 👩‍⚕️ **Online Consultations**: Schedule consultations with healthcare experts
- ❓ **Professional Q&A**: Ask questions and receive medical advice from doctors
- 📖 **Health Blog**: Read articles about women's health
- 💳 **Online Payment**: Support for VNPay and PayPal payment methods

### For Consultants
- 📊 **Overview Dashboard**: Track appointments, reviews, and statistics
- 📅 **Appointment Management**: View and manage consultation sessions
- ✍️ **Blog Management**: Write and manage professional articles
- 💬 **Question Answering**: Support and answer customer inquiries
- ⭐ **Review Management**: View feedback from customers
- 👤 **Professional Profile**: Manage information and certifications

### For Staff
- 📋 **Appointment Management**: Handle testing and consultation appointments
- 📊 **Reports**: Generate and export activity reports

### For Managers
- 👥 **Staff Management**: Manage employee and consultant accounts
- 🏥 **Service Management**: Manage testing services
- ✅ **Blog Approval**: Review and approve articles before publication
- 📈 **Statistics & Reports**: View overview reports and revenue
- ⭐ **Review Management**: Monitor customer feedback

### For Administrators
- 🛠️ **System Management**: Manage all users in the system
- 🔧 **System Configuration**: Configure and maintain the system

## 🛠️ Technologies Used

#### Frontend
- **React 18**: JavaScript library for building user interfaces
- **Vite**: Modern and fast build tool
- **Ant Design**: UI component library
- **React Router Dom**: Routing management
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Chart library
- **Day.js**: Date manipulation library
- **React Markdown**: Render markdown content

### Utilities & Tools
- **ESLint**: JavaScript/JSX linting
- **React Icons**: Icon library
- **HTML2Canvas & jsPDF**: Export PDF functionality
- **XLSX**: Export Excel files
- **File Saver**: Download files

#### Backend

### Core Framework
- **Spring Boot 3.5.0**: Enterprise Java application framework
- **Java 21**: Latest LTS version with modern language features
- **Maven**: Dependency management and build automation

### Security & Authentication
- **Spring Security**: Comprehensive security framework
- **JWT (JSON Web Tokens)**: Stateless authentication
- **OAuth2**: Third-party authentication integration
- **BCrypt**: Password hashing and encryption

### Database & ORM
- **Microsoft SQL Server**: Enterprise-grade relational database
- **Spring Data JPA**: Data access abstraction layer
- **Hibernate**: Object-relational mapping framework
- **Connection Pooling**: Optimized database connections

### Third-Party Integrations
- **VNPay API**: Vietnamese payment gateway
- **PayPal SDK**: International payment processing
- **Google APIs**: Calendar and OAuth2 services
- **Cloudinary**: Cloud-based media management
- **SMTP**: Email service integration

### Development Tools
- **Postman**: API testing and documentation
- **Swagger/OpenAPI**: API documentation and interactive testing
- **Git**: Version control system

## 📦 Installation and Setup

### System Requirements
- Node.js >= 16.0.0
- npm or yarn
- Java 21 or higher
- Maven 3.8+ (or use included Maven wrapper)
- Microsoft SQL Server
- Internet connection for third-party services

### Installation
```bash
# Clone repository
git clone <repository-url>
cd GenderHealthCareSystem

# Install dependencies
npm install

# Or using yarn
yarn install
```

### Running the Application

```bash
# Run development server
npm run dev

# Or
yarn dev
```

Application will run at `http://localhost:5173`

### Build for Production

```bash
# Build application
npm run build

# Preview build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🔐 User Roles & Permissions

The system supports 5 types of accounts:

1. **Customer**: Service users
2. **Consultant**: Healthcare consultants/Doctors
3. **Staff**: Employees
4. **Manager**: Management personnel
5. **Admin**: System administrators

Each role has different access permissions to system features.

## 🏗️ Front-End Architecture

The Gender Healthcare System follows a modern Front-End architecture:

### React
- **Single Page Application (SPA)**: Built with React 18 and Vite
- **Component-based architecture**: Reusable and maintainable UI components
- **State management**: Context API for global state management
- **Responsive design**: Mobile-first approach with Tailwind CSS

## 🎨 UI/UX Features

- **Responsive Design**: Compatible with all devices
- **Accessibility**: Compliant with accessibility standards
- **Loading States**: Visual feedback for users
- **Error Handling**: User-friendly error handling
- **Form Validation**: Comprehensive form validation

## 🏗️ Back-End Architecture

### Layered Architecture
The backend follows a clean, layered architecture pattern:

1. **Controller Layer**: REST API endpoints and request handling
2. **Service Layer**: Business logic and transaction management
3. **Repository Layer**: Data access and database operations
4. **Model Layer**: JPA entities and database mapping
5. **DTO Layer**: Data transfer objects for API communication
6. **Configuration Layer**: Spring Boot configurations and integrations

### Key Components

#### Controllers
- **Authentication**: Login, registration, password management
- **Healthcare Services**: Menstrual tracking, pill management, STI services
- **Consultation**: Doctor booking and consultation management
- **Content Management**: Blog posts, comments, Q&A system
- **Payment Processing**: VNPay and PayPal integration
- **User Management**: Profile management and user administration

#### Services
- **Core Services**: Authentication, user management, healthcare tracking
- **Integration Services**: Payment gateways, email, calendar, cloud storage
- **Reminder Services**: Automated notifications and scheduling
- **Analytics Services**: Reporting and dashboard data

#### Security Features
- **JWT Authentication**: Stateless token-based authentication
- **Role-based Authorization**: Different access levels for users
- **CORS Configuration**: Cross-origin resource sharing setup
- **OAuth2 Integration**: Google authentication support
- **Password Encryption**: Secure password hashing

## 🔐 Security Implementation

### Authentication Flow
1. **Login Request**: User submits credentials
2. **Validation**: Credentials verified against database
3. **Token Generation**: JWT token created with user claims
4. **Token Response**: Client receives access and refresh tokens
5. **Request Authorization**: Subsequent requests include JWT token
6. **Token Validation**: Server validates token on each request

### Authorization Levels
- **Customer**: Basic healthcare services access
- **Consultant**: Healthcare provider capabilities
- **Staff**: Administrative functions
- **Manager**: Management and reporting features
- **Admin**: Full system administration

## 📊 Database Schema

### Core Entities
- **Users**: User account information
- **Account**: Authentication and role management
- **ProfileDetail**: Extended user profile information
- **Role**: User role definitions

### Healthcare Entities
- **MenstrualCycle**: Cycle tracking data
- **Pills**: Medication information
- **PillSchedule**: Medication schedules and reminders
- **ConsultationBooking**: Doctor consultation appointments
- **StisBooking**: STI testing appointments
- **StisResult**: STI test results

### Content Entities
- **BlogPost**: Health article content
- **Comment**: Blog post comments
- **Question**: Q&A questions
- **QuestionComment**: Q&A answers and responses

### Business Entities
- **Invoice**: Payment and billing records
- **ConsultantFeedback**: Doctor reviews and ratings
- **StisFeedback**: STI service feedback

## 🚀 Deployment

URL: 14.225.192.28/

## 📝 License

This project was developed for educational purposes in the SWP391 course.

## 👥 Team

Project developed by student team in SWP391 course.

**Gender Healthcare System** - Comprehensive and modern women's healthcare solutions 💚
