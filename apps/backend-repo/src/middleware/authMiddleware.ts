import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { FirebaseAuthError } from "firebase-admin/auth";


const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      res.status(401).json({ message: 'Authorization header is missing' });
    } else {
      const token = authorizationHeader.split('Bearer ')[1] ?? ''
      if (!token) {
        res.status(401).json({ message: 'Authorization header is invalid' });
      } else {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = { id: decodedToken.uid };
        next();
      }
    }
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      const authError: FirebaseAuthError = error;
      if (authError.code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Token expired' });
      }
    } else {
      res.status(500).json({ error: 'Error fetching user', details: error });
    }
  }
};

export default verifyToken;