import { Request, Response} from "express";
import { FirebaseAuthError } from "firebase-admin/auth";
import { User } from "@repo/entities/user";
import admin from "firebase-admin";
import { ExpressUser } from "../entities/express.js";

admin.initializeApp();

const db = admin.firestore();

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as ExpressUser;
    const snapshot = await db.collection('USERS').where('id', '==', id).get();
    if (snapshot.empty) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const userDoc = snapshot.docs[0]?.data();
      const user: User = {
        email: userDoc?.email,
        username: userDoc?.username,
      };
      res.status(200).json({ user });
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
}

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as ExpressUser;
    const fieldToUpdate = req.body;
    const snapshot = await db.collection('USERS').where('id', '==', id).get();
    if (snapshot.empty) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const currentData = snapshot.docs[0]?.data();
      const updatedData = { ...currentData, ...fieldToUpdate };
      await snapshot.docs[0]!.ref.update(updatedData);
      const user: User = {
        email: updatedData.email,
        username: updatedData.username,
      };
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', details: error });
  }
}