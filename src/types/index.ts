import { Models } from "appwrite";


/**
 * Represents a user object.
 * Extends the base `Models.Document` type.
 */
export type User = Models.User<Models.Preferences> & {
  avatar?: string;
}

/**
 * Represents a team member object.
 * Extends the base `Models.Document` type.
 */
export type TeamMember = Models.Document & {
  userId: string;
  teamId: string;
  role: string;
}

/**
 * Represents a team object.
 * Extends the base `Models.Document` type.
 */
export type Team = Models.Document & {
  name: string;
  ownerId: string;
  planId: string;
  casesUsed: number;
  maxCases: number;
  planExpiresAt: Date;
  total?: number;
  members?: TeamMember[];
  // settings?: {
  //   [key: string]: any;
  // };
  // permissions?: {
  //   [key: string]: any;
  // };
}

/**
 * Represents a doctor object.
 * Extends the base `Models.Document` type.
 */
export type Doctor = Models.Document & {
  name: string;
  due: number;
  totalCases: number;
  teamId: string;
}

/**
 * Represents a material object.
 * Extends the base `Models.Document` type.
 */
export type Material = Models.Document & {
  name: string;
  price: number;
  teamId: string;
}

/**
 * Represents a case object.
 * Extends the base `Models.Document` type.
 * @param {string} userId represents the user who created the case
 */
export type Case = Models.Document & {
  patient: string;
  date: string;
  doctorId: string;
  doctor: {
    $id: string;
    name: string;
  }
  material: {
    $id: string;
    name: string;
  }
  materialId: string;
  data: ToothCollection;
  shade: string;
  due: number;
  invoice?: boolean;
  note: string;
  teamId: string;
  userId: string; // represents the user who created the case
  user?: {
    id: string,
    name: string,
    email: string,
    avatar?: string,
  } | null;
}

/**
 * Represents a tooth object.
 */
export type Tooth = {
  label: number;
  materialId: string;
  // other tooth-specific fields...
}

/**
 * Represents a TeethPart object.
 * @param {Tooth[]} right - An array of right tooth objects.
 * @param {Tooth[]} left - An array of left tooth objects.
 */
export type TeethPart = {
  right: Tooth[];
  left: Tooth[];
}

/**
 * Represents a ToothCollection object.
 * @param {TeethPart[]} upper - An array of upper teeth parts.
 * @param {TeethPart[]} lower - An array of lower teeth parts.
 */
export type ToothCollection = {
  upper: TeethPart;
  lower: TeethPart;
}

/**
 * Represents a cases template object.
 * Extends the base `Models.Document` type.
 */
export type Template = Models.Document & {
  name: string;
  doctor: string | null;
  material: string | null;
  shade: string | null;
  note: string | null;
  teamId: string;
}

export type Payment = Models.Document & {
  date: string;
  doctorId: string;
  amount: number;
}

export type BillingPlan = Models.Document & {
  name: string;
  description: string;
  price: number;
  maxCases: number;
  maxTeamMembers: number;
}

/**
 * Common action types for audit logs.
 * These are just typed suggestions — any string is technically allowed.
 */
export type AuditLogAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ARCHIVE'
  | 'RESTORE'
  | (string); // fallback to any custom string

/**
 * Represents a single audit log entry for tracking user actions in the DentaAuto app.
 * This type is used to log actions performed by users on various resources.
 * It includes information about the user, the action taken, the resource affected,
 * and any additional metadata related to the action.
 * This is useful for auditing and tracking changes within the application.
 * extends the base `Models.Document` type.
 * @param {string} teamId - The ID of the team associated with the action.
 * @param {string} userId - The ID of the user who performed the action.
 * @param {AuditLogAction} action - The type of action performed.
 * @param {string} resource - The kind of resource the action was performed on.
 * @param {string} resourceId - The unique ID of the specific resource affected.
 * @param {string} timestamp - ISO-formatted timestamp of when the action occurred.
 * @param {Record<string, any>} changes - Optional object describing changes made during the action.
 * Includes the state of the resource before and/or after the action.
 * @param {Record<string, any>} metadata - Optional object for storing extra context.
 * Examples: IP address, user agent, action notes, batch context, etc.
 */
export type AuditLogEntry = Models.Document & {
  /**
   * The ID of the team associated with the action.
   * Used to scope the log entry to a specific team.
   */
  teamId?: string;

  /**
   * The ID of the user who performed the action.
   */
  userId: string;

  /**
   * The user object associated with the action.
   * This may include additional information about the user.
   */
  user?: {
    id: string,
    name: string,
    email: string,
    avatar?: string,
  } | null;

  /**
   * The type of action performed.
   * Common values: 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'.
   * You may also use custom values.
   */
  action: AuditLogAction;

  /**
   * The kind of resource the action was performed on.
   * Examples: 'case', 'doctor', 'material', 'team', etc.
   */
  resource: string;

  /**
   * The unique ID of the specific resource affected.
   * Example: the document ID of the updated case.
   */
  resourceId: string;

  /**
   * ISO-formatted timestamp of when the action occurred.
   */
  timestamp: string;

  /**
   * Optional object describing changes made during the action.
   * Includes the state of the resource before and/or after the action.
   */
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };

  /**
   * Optional object for storing extra context.
   * Examples: IP address, user agent, action notes, batch context, etc.
   */
  metadata?: Record<string, any>;
};

export type AnalyticsEntry = Models.Document & {
  period: string;
  data: {
    cases: number;
    casesDelta: number;
    doctors: number;
    doctorsDelta: number;
    materials: number;
    materialsDelta: number;
  }
  casesChartData: {
    week: {
      [key: string]: number;
    }
    month: {
      [key: string]: number;
    }
    year: {
      [key: string]: number;
    }
  }
  teamId: string;
}

export type CaseInvoice = Models.Document & {
  teamId: string;
  userId: string;
  name: string;
  doctorId: string;
  cases: Case[];
  totalAmount: number;
  deducted?: number;
  finalAmount: number;
}