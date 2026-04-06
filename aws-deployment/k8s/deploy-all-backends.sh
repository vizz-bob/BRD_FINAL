#!/bin/bash

# Deploy all backend services
echo "Deploying all backend services..."

# Apply backend deployments
kubectl apply -f backends/masteradmin-backend.yaml
kubectl apply -f backends/tenant-backend.yaml
kubectl apply -f backends/crm-backend.yaml
kubectl apply -f backends/finance-backend.yaml
kubectl apply -f backends/agents-backend.yaml
kubectl apply -f backends/channel-backend.yaml
kubectl apply -f backends/fraud-backend.yaml
kubectl apply -f backends/legal-backend.yaml
kubectl apply -f backends/operations-backend.yaml
kubectl apply -f backends/salescrm-backend.yaml
kubectl apply -f backends/tenantadmin-backend.yaml
kubectl apply -f backends/valuation-backend.yaml

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment --all -n brd-loancrm

echo "All backend services deployed successfully!"
