# Insurance/TPA Integration Service

Enterprise-grade insurance claim management and Third-Party Administrator integration system.

## Features
- Insurance provider management
- Policy verification and validation
- Electronic claim submission (EDI 837)
- Real-time eligibility checking
- Payment processing and reconciliation
- TPA system integration
- Comprehensive reporting and analytics

## API Endpoints
- `POST /providers/` - Create insurance provider
- `GET /providers/` - Get all providers
- `POST /policies/` - Create insurance policy
- `POST /claims/` - Submit insurance claim
- `POST /eligibility/check` - Check insurance eligibility
- `POST /claims/{claim_id}/submit` - Submit claim to TPA
- `POST /payments/` - Record payment
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
- Insurance regulatory requirements
- Indian healthcare standards
- Data security and privacy protocols
