// create-user.dto.ts
import type { User } from "@prisma/client";

export interface CreateUserResponse {
  user: User;
}
