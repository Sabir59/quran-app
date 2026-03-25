# Unlimited Haircuts API Documentation

## Overview
This document provides a comprehensive overview of all available APIs in the Unlimited Haircuts barbershop management system.

**Base URLs:**
- Local Development: `http://127.0.0.1:8000/api/`
- Production: `{{haircut_local_url}}/`

**Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication APIs

### Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Description:** Register a new user account
- **Body:**
```json
{
  "first_name": "Adeel",
  "last_name": "Arshad",
  "email": "adeel@gmail.com",
  "phone": "03347882314",
  "password": "Shary@1234",
  "password_confirmation": "Shary@1234",
  "role": "Customer"
}
```

### Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:** Authenticate user and get access token
- **Body:**
```json
{
  "email": "admin@softui.com",
  "password": "secret"
}
```

### Get Current User
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Description:** Get current authenticated user information
- **Auth:** Bearer Token Required

### Logout
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Description:** Logout current user
- **Auth:** Bearer Token Required

### Refresh Token
- **Method:** `POST`
- **Endpoint:** `/api/auth/refresh`
- **Description:** Refresh authentication token
- **Auth:** Bearer Token Required

### Get Roles
- **Method:** `GET`
- **Endpoint:** `/api/auth/roles`
- **Description:** Get all available user roles
- **Auth:** Bearer Token Required

---

## 🔒 Permissions & Authorization APIs

### Get Roles with Assigned Permissions
- **Method:** `GET`
- **Endpoint:** `/api/permissions/roles`
- **Description:** Get all roles with their assigned permissions
- **Auth:** Bearer Token Required

### Get All Permissions
- **Method:** `GET`
- **Endpoint:** `/api/permissions/all`
- **Description:** Get all available permissions in the system
- **Auth:** Bearer Token Required

### Get User with Permissions
- **Method:** `GET`
- **Endpoint:** `/api/permissions/user`
- **Description:** Get current user with their permissions
- **Auth:** Bearer Token Required

### Check Specific Permission
- **Method:** `POST`
- **Endpoint:** `/api/permissions/check`
- **Description:** Check if user has specific permission
- **Body:**
```json
{
  "permission": "manage-permissions"
}
```
- **Auth:** Bearer Token Required

### Check Specific Role
- **Method:** `POST`
- **Endpoint:** `/api/permissions/check-role`
- **Description:** Check if user has specific role
- **Body:**
```json
{
  "role": "Shop"
}
```
- **Auth:** Bearer Token Required

### Get Role Permissions (Admin Only)
- **Method:** `GET`
- **Endpoint:** `/api/permissions/role/{role}`
- **Description:** Get permissions for specific role
- **Auth:** Bearer Token Required (Admin)

---

## 🏪 Shop Management APIs

### Get All Shops
- **Method:** `GET`
- **Endpoint:** `/api/shops`
- **Description:** Get all shops in the system
- **Auth:** Bearer Token Required

### Get Shop Details
- **Method:** `GET`
- **Endpoint:** `/api/shops/{id}`
- **Description:** Get specific shop details by ID
- **Auth:** Bearer Token Required

### Get My Shops
- **Method:** `GET`
- **Endpoint:** `/api/my-shops`
- **Description:** Get shops owned by current user
- **Auth:** Bearer Token Required

---

## 👤 Profile Management APIs

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/api/profile`
- **Description:** Get current user profile
- **Auth:** Bearer Token Required

### Update Profile
- **Method:** `PUT`
- **Endpoint:** `/api/profile`
- **Description:** Update current user profile
- **Body:**
```json
{
  "first_name": "Muhammad",
  "last_name": "Haroon",
  "phone": "03314001533",
  "email": "haroon@gmail.com"
}
```
- **Auth:** Bearer Token Required

### Change Password
- **Method:** `POST`
- **Endpoint:** `/api/profile/change-password`
- **Description:** Change user password
- **Body:**
```json
{
  "current_password": "Shary@1234",
  "password": "Shary@456",
  "password_confirmation": "Shary@456"
}
```
- **Auth:** Bearer Token Required

---

## 💇‍♂️ Barber Management APIs (Admin Only)

### Get All Barbers
- **Method:** `GET`
- **Endpoint:** `/api/admin/barbers`
- **Description:** Get all barbers in the system
- **Auth:** Bearer Token Required (Admin)

### Create Barber
- **Method:** `POST`
- **Endpoint:** `/api/admin/barbers`
- **Description:** Create a new barber account
- **Body:**
```json
{
  "first_name": "Khuram",
  "last_name": "Saleem",
  "email": "khuramsaleem@gmail.com",
  "phone": "+1234567890",
  "password": "Shary@1234",
  "is_available": true
}
```
- **Auth:** Bearer Token Required (Admin)

### Update Barber
- **Method:** `PUT`
- **Endpoint:** `/api/admin/barbers/{id}`
- **Description:** Update barber information
- **Body:**
```json
{
  "first_name": "Tariq",
  "last_name": "Saleems",
  "email": "tariqsaleems@gmail.com",
  "specialization": "Premium Haircuts",
  "experience_years": 6,
  "is_available": false
}
```
- **Auth:** Bearer Token Required (Admin)

### Delete Barber
- **Method:** `DELETE`
- **Endpoint:** `/api/admin/barbers/{id}`
- **Description:** Delete a barber account
- **Auth:** Bearer Token Required (Admin)

### Toggle Barber Availability
- **Method:** `PATCH`
- **Endpoint:** `/api/admin/barbers/{id}/toggle-availability`
- **Description:** Toggle barber availability status
- **Auth:** Bearer Token Required (Admin)

### Toggle Barber User Status
- **Method:** `PATCH`
- **Endpoint:** `/api/admin/barbers/{id}/toggle-user-status`
- **Description:** Toggle barber user account status
- **Auth:** Bearer Token Required (Admin)

---

## 👥 Sub-User Management APIs

### Admin Sub-User Management

#### Get All Sub-Users (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/admin/sub-users`
- **Description:** Get all sub-users in the system
- **Auth:** Bearer Token Required (Admin)

#### Create Sub-User (Admin)
- **Method:** `POST`
- **Endpoint:** `/api/admin/sub-users`
- **Description:** Create sub-user for specific customer
- **Body:**
```json
{
  "customer_id": 2,
  "first_name": "Muhammad",
  "last_name": "Ibrahim",
  "email": "ibrahim@gmail.com",
  "phone": "03312881211",
  "relation": "Child",
  "status": 1
}
```
- **Auth:** Bearer Token Required (Admin)

#### Get Specific Sub-User (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/admin/sub-users/{id}`
- **Description:** Get specific sub-user details
- **Auth:** Bearer Token Required (Admin)

#### Update Sub-User (Admin)
- **Method:** `PUT`
- **Endpoint:** `/api/admin/sub-users/{id}`
- **Description:** Update sub-user information
- **Body:**
```json
{
  "customer_id": 1,
  "first_name": "Muhammad",
  "last_name": "Azans",
  "phone": "03314001533",
  "email": "azan@gmail.com",
  "relation": "Child",
  "status": true
}
```
- **Auth:** Bearer Token Required (Admin)

#### Delete Sub-User (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/api/admin/sub-users/{id}`
- **Description:** Delete sub-user account
- **Auth:** Bearer Token Required (Admin)

#### Toggle Sub-User Status (Admin)
- **Method:** `PATCH`
- **Endpoint:** `/api/admin/sub-users/{id}/toggle-status`
- **Description:** Toggle sub-user status
- **Auth:** Bearer Token Required (Admin)

### Customer Sub-User Management

#### Get My Sub-Users
- **Method:** `GET`
- **Endpoint:** `/api/my-sub-users`
- **Description:** Get current customer's sub-users
- **Auth:** Bearer Token Required (Customer)

#### Create Sub-User (Customer)
- **Method:** `POST`
- **Endpoint:** `/api/my-sub-users`
- **Description:** Create sub-user for current customer
- **Body:**
```json
{
  "first_name": "Arshad",
  "last_name": "Rasheed",
  "email": "arshad@gmail.com",
  "phone": "03312881211",
  "relation": "Parent",
  "status": true
}
```
- **Auth:** Bearer Token Required (Customer)

#### Get Specific Sub-User (Customer)
- **Method:** `GET`
- **Endpoint:** `/api/my-sub-users/{id}`
- **Description:** Get specific sub-user details
- **Auth:** Bearer Token Required (Customer)

#### Update Sub-User (Customer)
- **Method:** `PUT`
- **Endpoint:** `/api/my-sub-users/{id}`
- **Description:** Update sub-user information
- **Body:**
```json
{
  "first_name": "Muhammad",
  "last_name": "Ibrahim",
  "email": "ibrahim2@gmail.com",
  "phone": "3314771211",
  "relation": "Child",
  "status": true
}
```
- **Auth:** Bearer Token Required (Customer)

#### Delete Sub-User (Customer)
- **Method:** `DELETE`
- **Endpoint:** `/api/my-sub-users/{id}`
- **Description:** Delete sub-user account
- **Auth:** Bearer Token Required (Customer)

#### Toggle Sub-User Status (Customer)
- **Method:** `PATCH`
- **Endpoint:** `/api/my-sub-users/{id}/toggle-status`
- **Description:** Toggle sub-user status
- **Auth:** Bearer Token Required (Customer)

---

## 👤 Customer Management APIs (Admin Only)

### Get All Customers
- **Method:** `GET`
- **Endpoint:** `/api/admin/customers`
- **Description:** Get all customers in the system
- **Auth:** Bearer Token Required (Admin)

### Create Customer
- **Method:** `POST`
- **Endpoint:** `/api/admin/customers`
- **Description:** Create a new customer account
- **Body:**
```json
{
  "first_name": "Muhammad",
  "last_name": "Daud",
  "email": "daud@gmail.com",
  "phone": "3312661811",
  "password": "Shary@1234",
  "is_active": true
}
```
- **Auth:** Bearer Token Required (Admin)

### Get Specific Customer
- **Method:** `GET`
- **Endpoint:** `/api/admin/customers/{id}`
- **Description:** Get specific customer details
- **Auth:** Bearer Token Required (Admin)

### Update Customer
- **Method:** `PUT`
- **Endpoint:** `/api/admin/customers/{id}`
- **Description:** Update customer information
- **Body:**
```json
{
  "first_name": "Muhammad",
  "last_name": "Daud",
  "email": "dauds@gmail.com",
  "phone": "3312661811",
  "address": "123 Main St",
  "city": "New York",
  "county": "NY",
  "post_code": "10001",
  "country": "United States",
  "notes": "VIP customer",
  "is_active": true
}
```
- **Auth:** Bearer Token Required (Admin)

### Delete Customer
- **Method:** `DELETE`
- **Endpoint:** `/api/admin/customers/{id}`
- **Description:** Delete customer account
- **Auth:** Bearer Token Required (Admin)

---

## 📋 System Overview

### Supported User Roles
- **Admin** - Full system access and management
- **Customer** - Can manage profile and sub-users
- **Barber** - Service provider with availability management
- **Shop** - Shop owner with shop management capabilities

### Key Features
1. **Multi-role Authentication System** with JWT tokens
2. **Role-based Access Control** with granular permissions
3. **Shop Management** for barbershop operations
4. **Barber Management** with availability tracking
5. **Sub-user System** for family member management
6. **Profile Management** with secure password changes
7. **Comprehensive Permission System** for access control

### Authentication Flow
1. Register/Login to get access token
2. Use Bearer token in Authorization header
3. Token refresh when needed
4. Logout to invalidate token

### Common Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    // Validation errors
  }
}
```

---

## 🔧 Development Notes

- All endpoints return JSON responses
- Authentication is required for most endpoints
- Admin endpoints require admin role permissions
- Customer endpoints are restricted to customer role
- Sub-user system allows customers to manage family members
- Barber management includes availability and status tracking
- Shop management supports multiple shop locations

---

*Last Updated: Based on Postman Collection v2.1.0*
