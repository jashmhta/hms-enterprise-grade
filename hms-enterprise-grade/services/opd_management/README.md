# OPD Management Service

Enterprise-grade outpatient department management system for hospital operations.

## Features
- **Patient Management** - Complete patient registration and demographic management
- **Appointment Scheduling** - Advanced appointment booking with doctor availability
- **Consultation Management** - Comprehensive consultation tracking and medical records
- **Billing Integration** - Seamless integration with billing and payment systems
- **Doctor Management** - Doctor profiles, availability, and scheduling
- **Real-time Statistics** - OPD performance metrics and analytics

## API Endpoints
- `POST /patients/` - Register new patients
- `GET /patients/` - Retrieve patient list
- `POST /doctors/` - Add doctors to system
- `GET /doctors/` - Retrieve doctor list
- `POST /appointments/` - Schedule appointments
- `GET /appointments/` - Retrieve appointments
- `POST /consultations/` - Record consultations
- `POST /bills/` - Create OPD bills
- `GET /availability/doctor/{id}` - Check doctor availability
- `GET /statistics` - Get OPD statistics

## Development

1. Copy environment file:
```bash
cp .env.example .env
```

2. Start services:
```bash
docker-compose up -d
```

3. Run tests:
```bash
pytest
```

## Deployment

Kubernetes deployment configuration available in `k8s/` directory.

## Compliance

- HIPAA patient data protection
- GDPR compliance for EU patients
- Hospital accreditation standards
- Medical records retention policies
