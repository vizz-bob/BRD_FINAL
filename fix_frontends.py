import os, json

frontends = [
    "BRD-website-main",
    "BRD_MasterAdmin_Frontend_1.1",
    "BRD-MergedTenantMaster-Frontend",
    "BRD_CRM-1.1",
    "BRD_FINANCE_DASHBOARD",
    "BRD_SALES_CRM",
    "BRD_TenantAdmin_Frontend_1.1",
    "BRD-ChannelPartner-Dashboard",
    "BRD-FraudTeamDashboard",
    "BRD-LEGAL-dashboard",
    "BRD-Operation-Verification-Dashboard",
    "BRD-ValuationDashboard"
]

dockerfile_content = '''FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install react-is --legacy-peer-deps
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
'''

nginx_content = '''server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
'''

for frontend in frontends:
    if not os.path.exists(frontend):
        print(f"❌ MISSING FOLDER: {frontend}")
        continue

    # Fix Dockerfile
    with open(f"{frontend}/Dockerfile", 'w') as f:
        f.write(dockerfile_content)
    print(f"✅ Fixed Dockerfile: {frontend}")

    # Fix nginx.conf if missing
    if not os.path.exists(f"{frontend}/nginx.conf"):
        with open(f"{frontend}/nginx.conf", 'w') as f:
            f.write(nginx_content)
        print(f"✅ Created nginx.conf: {frontend}")

    # Fix package.json
    pkg_path = f"{frontend}/package.json"
    if not os.path.exists(pkg_path):
        print(f"❌ NO package.json: {frontend}")
        continue

    try:
        with open(pkg_path, 'r') as f:
            pkg = json.load(f)

        # Add react-is
        pkg.setdefault('dependencies', {})['react-is'] = '^18.3.1'

        # Fix vite version
        if 'devDependencies' in pkg:
            if 'vite' in pkg['devDependencies']:
                current_vite = pkg['devDependencies']['vite']
                # Only downgrade if using v7+
                if current_vite.startswith('^7') or current_vite.startswith('7'):
                    pkg['devDependencies']['vite'] = '^5.4.0'
                    print(f"  ↓ Downgraded vite: {current_vite} → ^5.4.0")

        with open(pkg_path, 'w') as f:
            json.dump(pkg, f, indent=2)
        print(f"✅ Fixed package.json: {frontend}")

    except Exception as e:
        print(f"❌ Error {frontend}: {e}")

print("\n✅ ALL DONE!")
