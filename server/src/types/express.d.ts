declare namespace Express {
  interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
      role?: "ADMIN" | "USER";
    };
  }
}
