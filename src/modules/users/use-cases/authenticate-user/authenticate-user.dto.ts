import { Role } from "@prisma/client";

export interface AuthenticateUserRequest {
  email: string;
  password_plain: string;
}

export interface AuthenticateUserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  };
}
