# Role presets for common administrative roles
# Each preset defines a set of permissions for different admin levels

ROLE_PRESETS = {
    "super_admin": {
        "name": "Super Admin",
        "permissions": [
            "admin_access",
            "admin_read_only",
            "manage_users",
            "manage_roles",
            "manage_prayers",
            "manage_prayer_responses",
            "manage_parishes",
            "manage_announcements",
            "manage_events",
            "manage_testimonials",
            "view_audit_logs",
            "export_data"
        ]
    },
    "admin": {
        "name": "Admin",
        "permissions": [
            "admin_access",
            "manage_users",
            "manage_prayers",
            "manage_prayer_responses",
            "manage_announcements",
            "manage_events",
            "manage_testimonials",
            "view_audit_logs"
        ]
    },
    "moderator": {
        "name": "Moderator",
        "permissions": [
            "admin_access",
            "admin_read_only",
            "manage_prayers",
            "manage_prayer_responses",
            "manage_testimonials"
        ]
    },
    "read_only_admin": {
        "name": "Read-Only Admin",
        "permissions": [
            "admin_access",
            "admin_read_only",
            "view_audit_logs"
        ]
    }
}

def get_role_preset(preset_name: str):
    """
    Get a role preset by name.

    Args:
        preset_name (str): The name of the preset (e.g., "admin", "moderator")

    Returns:
        dict or None: The preset dictionary with 'name' and 'permissions' keys, or None if not found
    """
    return ROLE_PRESETS.get(preset_name.lower())