import { TeamMember } from '@/types';

export type Resource = 
'cases' | 
'doctors' |
'materials' |
'financials' |
'templates' |
'inventory' | 
'team' | 
'members' |
'export';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'has';

// Define permission matrix based on roles
const permissionMatrix: Record<string, Record<Resource, Action[]>> = {
  owner: {
    cases: ['create', 'read', 'update', 'delete'],
    export: ['has'],
    financials: ['has'],
    doctors: ['create', 'read', 'update', 'delete'],
    materials: ['create', 'read', 'update', 'delete'],
    templates: ['create', 'read', 'update', 'delete'],
    inventory: ['create', 'read', 'update', 'delete'],
    team: ['create', 'read', 'update', 'delete'],
    members: ['create', 'read', 'update', 'delete']
  },
  admin: {
    cases: ['create', 'read', 'update', 'delete'],
    doctors: ['create', 'read', 'update', 'delete'],
    export: ['has'],
    financials: ['has'],
    materials: ['create', 'read', 'update', 'delete'],
    templates: ['create', 'read', 'update', 'delete'],
    inventory: ['create', 'read', 'update', 'delete'],
    team: ['read', 'update'],
    members: ['create', 'read', 'update', 'delete']
  },
  member: {
    cases: ['create', 'read', 'update'],
    export: [],
    financials: [],
    doctors: ['create', 'read'],
    materials: ['create', 'read'],
    templates: ['create', 'read', 'update'],
    inventory: ['read', 'update'],
    team: ['read'],
    members: ['read']
  },
  viewer: {
    cases: ['read'],
    export: [],
    financials: [],
    doctors: ['read'],
    materials: ['read'],
    templates: ['read'],
    inventory: ['read'],
    team: ['read'],
    members: ['read']
  }
};

export function usePermission(userRole: TeamMember['role'] | null) {
  const checkPermission = (resource: Resource, action: Action): boolean => {
    if (!userRole) return false;
    
    const role = userRole.toLowerCase();
    if (!permissionMatrix[role]) return false;
    
    return permissionMatrix[role][resource].includes(action);
  };

  function canViewDue() {
    return checkPermission('financials', 'has');
  }
  
  return { checkPermission, canViewDue };
}

export interface PermissionCheckType {
  checkPermission: (resource: Resource, action: Action) => boolean;
  canViewDue: () => boolean;
}