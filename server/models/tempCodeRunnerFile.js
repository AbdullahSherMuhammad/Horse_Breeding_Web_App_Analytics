async initializeRoles() {
    try {
      const rolesResult = await this.get('role', ['role_id', 'role_name']);
      const roles = rolesResult.data || [];
      roles.forEach((role) => {
        if (role.role_id && role.role_name) {
          this.roleMap.set(role.role_name.toLowerCase(), role.role_id);
        }
      });