export type UserRole = "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
