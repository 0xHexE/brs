import { createAccessControl, Statements } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
} from 'better-auth/plugins/organization/access';

/**
 * University access control statements
 * Based on default organization permissions plus university-specific resources
 */
const statement = {
  ...defaultStatements,
  // Default organization permissions (extended for super admin)
  organization: ['create', 'update', 'delete'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],

  // University-specific permissions
  course: ['create', 'read', 'update', 'delete'],
  grade: ['create', 'read', 'update'],
  attendance: ['create', 'read', 'update'],
  transcript: ['create', 'read', 'update'],
  fee: ['create', 'read', 'update'],
  library: ['create', 'read', 'update', 'delete'],
  programme: ['create', 'read', 'update', 'delete'],
  department: ['create', 'read', 'update', 'delete'],
  faculty: ['create', 'read', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);

/**
 * University-specific roles with permissions
 */
export const superAdmin = ac.newRole({
  // All permissions
  organization: ['create', 'update', 'delete'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],
  course: ['create', 'read', 'update', 'delete'],
  grade: ['create', 'read', 'update'],
  attendance: ['create', 'read', 'update'],
  transcript: ['read', 'create', 'update'],
  fee: ['create', 'read', 'update'],
  library: ['create', 'read', 'update', 'delete'],
  programme: ['create', 'read', 'update', 'delete'],
  department: ['create', 'read', 'update', 'delete'],
  faculty: ['create', 'read', 'update', 'delete'],
});

export const registrar = ac.newRole({
  organization: ['update'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],
  course: ['create', 'update'],
  grade: ['read'],
  attendance: ['read'],
  transcript: ['read'],
  fee: ['create', 'read', 'update'],
  programme: ['create', 'read', 'update'],
  department: ['read'],
  faculty: ['read'],
});

export const dean = ac.newRole({
  member: ['create', 'update'],
  course: ['create', 'update'],
  grade: ['read'],
  attendance: ['read'],
  transcript: ['read'],
  programme: ['create', 'read', 'update'],
  department: ['read'],
  faculty: ['read'],
});

export const hod = ac.newRole({
  course: ['create', 'update'],
  grade: ['read', 'update'],
  attendance: ['read', 'update'],
  programme: ['read'],
  department: ['read'],
});

export const professor = ac.newRole({
  grade: ['create', 'read', 'update'],
  attendance: ['create', 'read', 'update'],
  course: ['read'],
});

export const ta = ac.newRole({
  grade: ['create', 'read'],
  attendance: ['create', 'read'],
  course: ['read'],
});

export const student = ac.newRole({
  grade: ['read'],
  attendance: ['read'],
  transcript: ['read'],
  course: ['read'],
});

export const parent = ac.newRole({
  grade: ['read'],
  attendance: ['read'],
  transcript: ['read'],
});

export const bursar = ac.newRole({
  fee: ['create', 'read', 'update'],
});

export const librarian = ac.newRole({
  library: ['create', 'read', 'update', 'delete'],
});

export const universityRoles = {
  superAdmin,
  registrar,
  dean,
  hod,
  professor,
  ta,
  student,
  parent,
  bursar,
  librarian,
};
