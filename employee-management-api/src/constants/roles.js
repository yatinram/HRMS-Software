const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['admin', 'hr', 'manager', 'employee'],
  [ROLES.HR]: ['employee'],
  [ROLES.MANAGER]: ['employee'],
  [ROLES.EMPLOYEE]: ['employee'],
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
};
