import { Router } from "express";
import { getUserData, updateUserData } from "../controller/user.js";

const userRouter = Router();

userRouter.get('/fetch-user-data', getUserData);
userRouter.put('/update-user-data', updateUserData);

export default userRouter;