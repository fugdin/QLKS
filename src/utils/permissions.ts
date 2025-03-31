export enum Permission {
  READ = 1,
  WRITE = 2,
  DELETE = 4,
  ADMIN = 8
}

export interface UserPermissions {
  roleId: string;
  permissions: number;
}

export const checkPermission = (userPermissions: UserPermissions, requiredPermission: Permission): boolean => {
  return (userPermissions.permissions & requiredPermission) === requiredPermission;
};

export const hasMultiplePermissions = (userPermissions: UserPermissions, requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => checkPermission(userPermissions, permission));
};

export const getPermissionsFromRole = (rolePermissions: { MaVaitro: string; TONGQUYEN: number }[]): UserPermissions => {
  return {
    roleId: rolePermissions[0]?.MaVaitro || '',
    permissions: rolePermissions[0]?.TONGQUYEN || 0
  };
}; 