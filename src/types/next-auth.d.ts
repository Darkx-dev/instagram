/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string?;
      username: string?;
      email: string?;
    };
  }

  interface User {
    username: string
  }

  interface JWT {
    id: string?;
    username: string?;
    email: string?;
  }
}