# IPD Management Service

Enterprise-grade Inpatient Department management system for hospital operations.

## Features
- Patient admission and discharge management
- Bed allocation and management
- Nursing care documentation
- Doctor rounds and progress tracking
- Discharge summary generation
- Real-time reporting and analytics

## API Endpoints
- `POST /admissions/` - Admit new inpatient
- `GET /admissions/` - Get all admissions
- `POST /beds/` - Allocate bed to patient
- `POST /nursing-care/` - Document nursing care
- `POST /discharge-summaries/` - Create discharge summary
- `GET /health` - Health check endpoint

## Development

1. Copy environment file:
```bash
cp .env.example .env
```

2. Start services:
```bash
docker-compose up -d
```

3. Run migrations:
```bash
alembic upgrade head
```

4. Run tests:
```bash
pytest
```

## Deployment

Kubernetes deployment configuration available in `k8s/` directory.

## Compliance

- NABH accreditation standards
- HIPAA compliance for patient data
- Indian healthcare regulations
- Patient safety protocols
