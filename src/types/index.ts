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
  materialId: string;
  teethData: ToothCollection;
  shade: string;
  due: number;
  invoice?: boolean;
  note: string;
  teamId: string;
  userId: string; // represents the user who created the case
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