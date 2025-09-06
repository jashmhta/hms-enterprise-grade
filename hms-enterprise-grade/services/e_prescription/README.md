# E-Prescription Service

Enterprise-grade electronic prescription management system for hospital environments.

## Features
- Electronic prescription generation with digital signatures
- Comprehensive medication database with drug information
- Drug interaction checking and safety validation
- Pharmacy integration and prescription dispatch
- Patient safety features with allergy checking
- Regulatory compliance and audit trails

## API Endpoints
- `POST /medications/` - Create medication record
- `GET /medications/` - Get all medications
- `POST /prescriptions/` - Create electronic prescription
- `GET /patients/{id}/prescriptions` - Get patient prescriptions
- `POST /safety/check` - Check prescription safety
- `POST /pharmacies/` - Register pharmacy
- `POST /dispatches/` - Dispatch prescription to pharmacy
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

3. Run tests:
```bash
pytest
```

## Deployment

Kubernetes deployment configuration available in `k8s/` directory.

## Compliance

- HIPAA compliance for patient data
- FDA medication safety standards
- Indian healthcare regulations
- Electronic prescription standards
