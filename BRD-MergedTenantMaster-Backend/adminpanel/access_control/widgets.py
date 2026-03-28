from django import forms
from django.utils.safestring import mark_safe
from .models import Permission

class PermissionCheckboxWidget(forms.CheckboxSelectMultiple):
    def render(self, name, value, attrs=None, renderer=None):
        # Get all permissions grouped by category
        all_permissions = Permission.objects.all()
        
        # Group permissions by category (same as frontend)
        permissions_by_category = {
            'Loan Management': [],
            'Document Management': [],
            'System Administration': [],
            'Analytics & Reports': [],
            'Branch Control': [],
            'Rules Management': []
        }
        
        for perm in all_permissions:
            category = self.get_permission_category(perm.code)
            if category in permissions_by_category:
                permissions_by_category[category].append(perm)
        
        # Get current selected permissions (ensure it's a list)
        selected_permissions = value or []
        if not isinstance(selected_permissions, list):
            selected_permissions = list(selected_permissions) if selected_permissions else []
        
        print(f"DEBUG: Widget rendering - selected_permissions: {selected_permissions}")
        
        # Render checkboxes grouped by category
        output = []
        for category, permissions in permissions_by_category.items():
            if permissions:  # Only show categories with permissions
                checkboxes = []
                for perm in permissions:
                    checked = str(perm.id) in [str(p) for p in selected_permissions]
                    checkbox = f'''
                        <div class="permission-item">
                            <label class="permission-label">
                                <input type="checkbox" 
                                       name="{name}" 
                                       value="{perm.id}"
                                       {"checked" if checked else ""}>
                                <span class="permission-code">{perm.code}</span>
                                <span class="permission-description">{perm.description}</span>
                            </label>
                        </div>
                    '''
                    checkboxes.append(checkbox)
                
                category_html = f'''
                    <div class="permission-category">
                        <div class="category-header">
                            <h3>{category}</h3>
                            <div class="category-actions">
                                <button type="button" class="select-all-btn" data-category="{category}">Select All</button>
                                <button type="button" class="clear-all-btn" data-category="{category}">Clear</button>
                            </div>
                        </div>
                        <div class="permission-list">
                            {''.join(checkboxes)}
                        </div>
                    </div>
                '''
                output.append(category_html)
        
        # Add JavaScript for Select All/Clear functionality
        js_script = f'''
        <script>
        document.addEventListener('DOMContentLoaded', function() {{
            // Select All/Clear functionality for each category
            document.querySelectorAll('.select-all-btn').forEach(btn => {{
                btn.addEventListener('click', function() {{
                    const category = this.dataset.category;
                    const categoryDiv = this.closest('.permission-category');
                    const checkboxes = categoryDiv.querySelectorAll('input[name="{name}"]');
                    checkboxes.forEach(cb => cb.checked = true);
                }});
            }});
            
            document.querySelectorAll('.clear-all-btn').forEach(btn => {{
                btn.addEventListener('click', function() {{
                    const category = this.dataset.category;
                    const categoryDiv = this.closest('.permission-category');
                    const checkboxes = categoryDiv.querySelectorAll('input[name="{name}"]');
                    checkboxes.forEach(cb => cb.checked = false);
                }});
            }});
        }});
        </script>
        '''
        
        output.append(js_script)
        
        return mark_safe(''.join(output))
    
    def value_from_datadict(self, data, files, name):
        """
        Override to properly handle multiple checkbox values
        """
        print(f"DEBUG: value_from_datadict called for field '{name}'")
        print(f"DEBUG: Raw data for '{name}': {data.getlist(name)}")
        
        # Get all values for this field name
        values = data.getlist(name)
        
        # Convert to Permission objects if they're UUIDs
        permission_objects = []
        for value in values:
            if value:  # Skip empty values
                try:
                    permission = Permission.objects.get(id=value)
                    permission_objects.append(permission)
                    print(f"DEBUG: Found permission: {permission.code}")
                except Permission.DoesNotExist:
                    print(f"DEBUG: Permission not found for ID: {value}")
                except Exception as e:
                    print(f"DEBUG: Error processing permission ID {value}: {e}")
        
        print(f"DEBUG: Final permission objects: {[p.code for p in permission_objects]}")
        return permission_objects
    
    def get_permission_category(self, permission_code):
        """Map permission codes to categories"""
        loan_management = ['CREATE_LOANS', 'APPROVE_LOANS', 'EDIT_APPLICATIONS', 'VIEW_LOANS', 'DELETE_LOANS', 'LOAN_APPLICATION', 'CREDIT_ASSESSMENT', 'LOAN_LIFECYCLE', 'LOAN_CLOSURE', 'SANCTION_APPROVAL']
        document_management = ['VIEW_DOCUMENTS', 'DOWNLOAD_DOCUMENTS', 'UPLOAD_DOCUMENTS', 'DELETE_DOCUMENTS', 'DOCUMENT_COLLECTION', 'DOCUMENT_VERIFICATION', 'KYC_DOCUMENTS', 'INCOME', 'PROPERTY']
        system_administration = ['AUDIT_LOGS', 'EDIT_POLICIES', 'MANAGE_USERS', 'MANAGE_ROLES', 'MANAGE_BRANCHES', 'USER_MANAGEMENT', 'ROLE_PERMISSION', 'TENANT', 'CONFIGURATION', 'WORKFLOW_SETUP', 'MANAGE_CATEGORIES']
        analytics_reports = ['VIEW_REPORTS', 'EXPORT_DATA', 'DASHBOARD', 'PERFORMANCE', 'CUSTOMER', 'FINANCIAL', 'OPERATIONAL']
        branch_control = ['VIEW_ALL', 'EDIT_BRANCH', 'ASSIGN_USERS', 'BRANCH_MANAGEMENT', 'BRANCH_USER_MAPPING', 'BRANCH_LOAN_ACCESS', 'BRANCH_PERFORMANCE', 'GEO', 'BRANCH_CONFIGURATION']
        rules_management = ['RULE_PROFILE', 'RULE_COLLATERAL', 'RULE_FINANCIAL', 'RULE_CREDIT', 'RULE_SCORECARD', 'RULE_GEO', 'RULE_RISK', 'RULE_VERIFICATION']
        
        if permission_code in loan_management:
            return 'Loan Management'
        elif permission_code in document_management:
            return 'Document Management'
        elif permission_code in system_administration:
            return 'System Administration'
        elif permission_code in analytics_reports:
            return 'Analytics & Reports'
        elif permission_code in branch_control:
            return 'Branch Control'
        elif permission_code in rules_management:
            return 'Rules Management'
        else:
            return 'Other Permissions'
