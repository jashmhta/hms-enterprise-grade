# Blood Bank Management Service

Enterprise-grade blood bank management system for hospital management.

## Features
- Blood inventory management with expiration tracking
- Donor management and eligibility screening
- Blood testing integration and quality control
- Transfusion management and adverse reaction reporting
- Blood request and issuance workflows

## API Endpoints
- `POST /donors/` - Register new donor
- `GET /donors/` - List donors
- `POST /blood-bags/` - Create blood bag
- `GET /blood-bags/available/{blood_type}/{component}` - Get available blood
- `POST /donations/` - Record blood donation
- `POST /transfusions/` - Record blood transfusion
- `POST /blood-requests/` - Create blood request

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

- FDA blood bank regulations
- AABB standards
- NABH accreditation requirements
