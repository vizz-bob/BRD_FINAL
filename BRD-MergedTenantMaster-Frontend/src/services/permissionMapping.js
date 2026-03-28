// Permission mapping utility for Django admin sync
import { rolesApi } from './api.js';

// Map frontend permission keys to Django permission codes (exact match with backend)
const FRONTEND_TO_DJANGO_CODES = {
  // Loan Management
  'loan_create': ['CREATE_LOANS'],
  'loan_approve': ['APPROVE_LOANS'],
  'loan_edit': ['EDIT_APPLICATIONS'],
  'loan_view': ['VIEW_LOANS'],
  'loan_delete': ['DELETE_LOANS'],
  'application_processing_loan': ['LOAN_APPLICATION'],
  'credit_assessment': ['CREDIT_ASSESSMENT'],
  'loan_lifecycle': ['LOAN_LIFECYCLE'],
  'loan_closure': ['LOAN_CLOSURE'],
  'sanction_approval': ['SANCTION_APPROVAL'],
  
  // Document Management
  'view_docs': ['VIEW_DOCUMENTS'],
  'download_docs': ['DOWNLOAD_DOCUMENTS'],
  'upload_docs': ['UPLOAD_DOCUMENTS'],
  'delete_docs': ['DELETE_DOCUMENTS'],
  'document_collection': ['DOCUMENT_COLLECTION'],
  'document_verification': ['DOCUMENT_VERIFICATION'],
  'kyc_documents': ['KYC_DOCUMENTS'],
  'property_documents': ['PROPERTY'],
  'income_financial': ['INCOME'],
  
  // System Administration
  'audit_logs': ['AUDIT_LOGS'],
  'edit_policies': ['EDIT_POLICIES'],
  'manage_users': ['MANAGE_USERS'],
  'manage_roles': ['MANAGE_ROLES'],
  'manage_branches': ['MANAGE_BRANCHES'],
  'user_management': ['USER_MANAGEMENT'],
  'role_permission': ['ROLE_PERMISSION'],
  'tenant_organization_settings': ['TENANT'],
  'configuration_masters': ['CONFIGURATION'],
  'workflow_setup': ['WORKFLOW_SETUP'],
  'manage_categories': ['MANAGE_CATEGORIES'],
  
  // Analytics & Reports
  'view_reports': ['VIEW_REPORTS'],
  'export_reports': ['EXPORT_DATA'],
  'dashboard_analytics': ['DASHBOARD'],
  'performance_reports': ['PERFORMANCE'],
  'customer_analytics': ['CUSTOMER'],
  'financial_reports': ['FINANCIAL'],
  'operational_reports': ['OPERATIONAL'],
  
  // Branch Control
  'view_all_branches': ['VIEW_ALL'],
  'edit_branch_details': ['EDIT_BRANCH'],
  'assign_users_to_branches': ['ASSIGN_USERS'],
  'branch_management': ['BRANCH_MANAGEMENT'],
  'branch_wise_user_mapping': ['BRANCH_USER_MAPPING'],
  'branch_wise_loan_access': ['BRANCH_LOAN_ACCESS'],
  'branch_performance_monitoring': ['BRANCH_PERFORMANCE'],
  'geo_area_control': ['GEO'],
  'branch_configuration_settings': ['BRANCH_CONFIGURATION'],
  
  // Rules Management
  'rule_profile': ['RULE_PROFILE'],
  'rule_collateral': ['RULE_COLLATERAL'],
  'rule_financial': ['RULE_FINANCIAL'],
  'rule_credit': ['RULE_CREDIT'],
  'rule_scorecard': ['RULE_SCORECARD'],
  'rule_geo': ['RULE_GEO'],
  'rule_risk': ['RULE_RISK'],
  'rule_verification': ['RULE_VERIFICATION'],
};

// Cache for permission UUIDs
let permissionUuidCache = null;

/**
 * Fetch all permissions from backend and build code-to-UUID mapping
 */
export const fetchPermissionUuids = async () => {
  if (permissionUuidCache) {
    return permissionUuidCache;
  }
  
  try {
    const response = await rolesApi.getPermissions();
    if (response.ok && response.data) {
      permissionUuidCache = {};
      response.data.forEach(perm => {
        permissionUuidCache[perm.code] = perm.id;
      });
      return permissionUuidCache;
    }
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return {};
  }
  
  return {};
};

/**
 * Get all available Django permissions and cache them
 */
export const getAllDjangoPermissions = async () => {
  if (permissionCache) {
    return permissionCache;
  }
  
  try {
    const response = await rolesApi.list();
    if (response.ok && response.data) {
      // This would need to be implemented to get all permissions
      // For now, we'll use a basic mapping
      permissionCache = {
        // User permissions (auth app)
        'add_user': 37,
        'change_user': 38,
        'view_user': 40,
        'delete_user': 39,
        
        // Group permissions (auth app)
        'add_group': 9,
        'change_group': 10,
        'view_group': 12,
        'delete_group': 11,
      };
      return permissionCache;
    }
    return {};
  } catch (error) {
    console.error('Error fetching Django permissions:', error);
    return {};
  }
};

/**
 * Convert frontend permissions to Django permission UUIDs
 */
export const mapFrontendToDjangoPermissions = async (frontendPermissions) => {
  const djangoPermUuids = [];
  
  console.log('🔍 Mapping Frontend Permissions to Django UUIDs:');
  console.log('📥 Input permissions:', frontendPermissions);
  
  // Get permission UUID mapping
  const permissionUuids = await fetchPermissionUuids();
  
  // Count enabled permissions
  const enabledPermissions = Object.entries(frontendPermissions).filter(([key, enabled]) => enabled);
  console.log('✅ Enabled permissions count:', enabledPermissions.length);
  console.log('📋 Enabled permissions list:');
  enabledPermissions.forEach(([key, enabled]) => {
    console.log(`   - ${key}: ${enabled}`);
  });
  
  Object.entries(frontendPermissions).forEach(([frontendKey, enabled]) => {
    if (enabled && FRONTEND_TO_DJANGO_CODES[frontendKey]) {
      const codes = FRONTEND_TO_DJANGO_CODES[frontendKey];
      console.log(`🔄 Mapping ${frontendKey} → ${codes.length} Django codes: ${codes}`);
      
      // Convert each code to UUID
      codes.forEach(code => {
        const uuid = permissionUuids[code];
        if (uuid && !djangoPermUuids.includes(uuid)) {
          djangoPermUuids.push(uuid);
          console.log(`   ✅ Mapped ${code} → ${uuid}`);
        } else if (!uuid) {
          console.log(`   ⚠️  Warning: Permission code ${code} not found in backend`);
        }
      });
    } else if (enabled && !FRONTEND_TO_DJANGO_CODES[frontendKey]) {
      console.log(`⚠️  Warning: ${frontendKey} is enabled but not mapped to any Django permissions`);
    }
  });
  
  console.log('📤 Final Django permission UUIDs:', djangoPermUuids);
  console.log('🔢 Total Django permission UUIDs:', djangoPermUuids.length);
  console.log('🏁 Permission mapping completed');
  
  return djangoPermUuids;
};

/**
 * Convert Django permissions to frontend permission keys
 */
export const mapDjangoToFrontendPermissions = (djangoPermissions) => {
  const frontendPerms = {};
  
  // Initialize all permissions to false
  Object.keys(FRONTEND_TO_DJANGO_CODES).forEach(key => {
    frontendPerms[key] = false;
  });
  
  // Convert Django permissions to frontend keys
  if (Array.isArray(djangoPermissions)) {
    djangoPermissions.forEach(djangoPerm => {
      const permCode = djangoPerm.code || djangoPerm;
      
      // Find frontend permissions that include this Django permission code
      Object.entries(FRONTEND_TO_DJANGO_CODES).forEach(([frontendKey, djangoCodes]) => {
        if (djangoCodes.includes(permCode)) {
          frontendPerms[frontendKey] = true;
        }
      });
    });
  }
  
  return frontendPerms;
};

/**
 * Sync role permissions with Django admin
 */
export const syncRolePermissions = async (roleId, frontendPermissions) => {
  try {
    console.log('🚀 Starting Permission Sync Process');
    console.log('====================================');
    
    // Convert frontend permissions to Django permission IDs
    const djangoPermIds = await mapFrontendToDjangoPermissions(frontendPermissions);
    
    const payload = { 
        role: roleId,
        permissions: djangoPermIds 
      };
    
    console.log('📤 Preparing to send to backend:');
    console.log('   Role ID:', roleId);
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    console.log('   Permission count:', djangoPermIds.length);
    
    // Validate payload before sending
    if (!Array.isArray(djangoPermIds)) {
      console.error('❌ Invalid permission IDs format:', typeof djangoPermIds);
      throw new Error('Permission IDs must be an array');
    }
    
    if (djangoPermIds.some(id => typeof id !== 'string' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i))) {
      console.error('❌ Invalid permission ID found:', djangoPermIds);
      throw new Error('All permission IDs must be valid UUID strings');
    }
    
    console.log('✅ Payload validation passed');
    
    // Update Django Group permissions
    console.log('🌐 Sending API request...');
    const result = await rolesApi.updatePermissions(roleId, payload);
    
    console.log('📥 API Response received:');
    console.log('   Success:', result.ok);
    console.log('   Data:', result.data);
    console.log('   Error:', result.error);
    
    if (result.ok) {
      console.log('🎉 Permission sync completed successfully!');
      console.log(`   ✅ ${djangoPermIds.length} permissions synced to role ${roleId}`);
    } else {
      console.error('❌ Permission sync failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Permission sync error:', error);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};
