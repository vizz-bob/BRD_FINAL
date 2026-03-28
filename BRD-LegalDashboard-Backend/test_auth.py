#!/usr/bin/env python
"""
Simple test script to verify authentication endpoints are working
Run from BRD-LegalDashboard-Backend directory
"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Legal_Dashboard.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User

# Create test client
client = Client()

print("=" * 60)
print("Testing Authentication Endpoints")
print("=" * 60)

# Clean up test user if exists
User.objects.filter(email="test_api@example.com").delete()

# Test 1: Registration
print("\n1. Testing Registration Endpoint...")
print("-" * 40)

register_data = {
    "email": "test_api@example.com",
    "password": "TestPass123456",
    "password2": "TestPass123456",
    "first_name": "Test",
    "last_name": "User",
    "role": "legal"
}

response = client.post(
    '/api/auth/register/',
    data=json.dumps(register_data),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 201:
    print("✅ Registration successful!")
    response_data = response.json()
else:
    print(f"❌ Registration failed!")
    print(f"Error: {response.json()}")

# Test 2: Login
print("\n2. Testing Login Endpoint...")
print("-" * 40)

login_data = {
    "email": "test_api@example.com",
    "password": "TestPass123456"
}

response = client.post(
    '/api/auth/login/',
    data=json.dumps(login_data),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
response_data = response.json()
print(f"Response Keys: {list(response_data.keys())}")

if response.status_code == 200:
    print("✅ Login successful!")
    access_token = response_data.get('tokens', {}).get('access')
    print(f"Access Token (first 50 chars): {access_token[:50] if access_token else 'None'}...")
else:
    print(f"❌ Login failed!")
    print(f"Error: {response_data}")

# Test 3: Get Current User (requires token)
if response.status_code == 200:
    print("\n3. Testing Get Current User Endpoint...")
    print("-" * 40)
    
    access_token = response_data.get('tokens', {}).get('access')
    headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
    
    response = client.get('/api/auth/user/', **headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Get current user successful!")
    else:
        print(f"❌ Get current user failed!")

# Test 4: Check user in database
print("\n4. Checking User in Database...")
print("-" * 40)

user = User.objects.filter(email="test_api@example.com").first()
if user:
    print(f"✅ User found in database!")
    print(f"   Email: {user.email}")
    print(f"   Username: {user.username}")
    print(f"   First Name: {user.first_name}")
    print(f"   Last Name: {user.last_name}")
else:
    print("❌ User not found in database!")

print("\n" + "=" * 60)
print("Testing Complete!")
print("=" * 60)
