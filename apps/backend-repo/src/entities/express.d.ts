export interface ExpressUser {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: ExpressUser;
    }
  }
}
