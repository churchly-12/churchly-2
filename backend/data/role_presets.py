# Role presets for quick admin role creation

ROLE_PRESETS = {
    "SUPER_ADMIN": {
        "name": "Super Admin",
        "permissions": [
            "admin_access",
            "user_management",
            "role_management",
            "prayer_management",
            "parish_management",
            "content_management",
            "system_settings",
            "audit_logs"
        ]
    },
    "MODERATOR": {
        "name": "Moderator",
        "permissions": [
            "admin_access",
            "user_management",
            "prayer_management",
            "content_management"
        ]
    },
    "PARISH_ADMIN": {
        "name": "Parish Admin",
        "permissions": [
            "admin_access",
            "user_management",
            "prayer_management",
            "parish_management"
        ]
    },
    "READ_ONLY_ADMIN": {
        "name": "Read-Only Admin",
        "permissions": [
            "admin_access"
        ]
    }
}

def get_role_preset(preset_name: str):
    """Get a role preset by name"""
    return ROLE_PRESETS.get(preset_name.upper())