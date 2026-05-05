# ReferPeople.in — Multi-Tenant Loan & Property Management Platform

A full-stack platform for financial institutions with 12 dashboards, 12 Django REST APIs, and React frontends.

## 📖 Deployment Guide
👉 [ReferPeople_Production_Deployment_Guide.md](./ReferPeople_Production_Deployment_Guide.md)

## 🏗️ Architecture
- **26 Docker containers** — 12 React frontends + 12 Django backends + Nginx + Redis
- **AWS EC2** t3.large + **RDS PostgreSQL 16** + **Redis 7**
- **Nginx** reverse proxy routing all traffic

## 🚀 Quick Deploy
```bash
git clone https://github.com/vizz-bob/BRD_FINAL.git
cd BRD_FINAL
# Set DB credentials in create-env-files.sh then:
bash create-env-files.sh
# Follow ReferPeople_Production_Deployment_Guide.md for all steps
```

## 📋 Dashboards
| Dashboard | URL | Role |
|---|---|---|
| Master Admin | /master-admin/ | Super Admin |
| CRM | /crm/ | CRM Agents |
| Finance | /finance/ | Finance Team |
| Sales CRM | /sales-crm/ | Sales Agents |
| Tenant Admin | /tenant-admin/ | Org Admin |
| Channel Partner | /channel/ | Partners |
| Fraud | /fraud/ | Fraud Team |
| Legal | /legal/ | Legal Team |
| Operations | /operations/ | Ops Team |
| Valuation | /valuation/ | Valuators |
| Tenant Portal | /tenant/ | Tenants |
| Website | / | Public |

## ✅ Server
- **IP:** 65.1.45.32 | **OS:** Ubuntu 22.04 | **Stack:** Docker Compose
