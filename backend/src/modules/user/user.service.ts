import crypto from 'crypto';

import { UserModel } from "./user.model";

export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    hashedPassword: input.hashedPassword,
  });
}

export function generateSalt() {
  return crypto.randomBytes(64).toString('hex');
}