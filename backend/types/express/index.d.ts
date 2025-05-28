declare namespace Express {
  export interface Request {
    user?: {
      email: string;
      id: string;
      sessionId: string;
      iat: number;
      exp: number;
    };
  }
}
