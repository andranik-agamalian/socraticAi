type Role = "user" | "assisstant" | "system";

export interface Conversation {
  role: Role;
  content: string;
}
