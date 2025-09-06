# Blood Bank Management Service

Enterprise-grade blood bank management system for hospital environments.

## Features
- **Blood Inventory Management** - Comprehensive blood unit tracking and management
- **Donor Management** - Donor registration, screening, and history tracking
- **Transfusion Management** - Blood transfusion request processing and documentation
- **Quality Control** - Blood testing and quality assurance procedures
- **Inventory Alerts** - Automated alerts for low stock and expiring units
- **Reporting & Analytics** - Comprehensive blood bank statistics and reporting

## API Endpoints
- `POST /blood-units/` - Create blood unit
- `GET /blood-units/{id}` - Get blood unit details
- `POST /donors/` - Register donor
- `POST /donations/` - Record blood donation
- `POST /transfusion-requests/` - Create transfusion request
- `POST /transfusions/` - Record blood transfusion
- `POST /blood-tests/` - Record blood test results
- `POST /inventory-alerts/` - Create inventory alert
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

- HIPAA compliance for patient data protection
- FDA blood bank regulations
- ISO 15189 medical laboratory standards
- AABB blood banking standards
