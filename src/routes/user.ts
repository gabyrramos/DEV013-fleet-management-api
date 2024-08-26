import { Router } from "express";
import { postUser } from "../controller/users.controller";

const router = Router();

router.post('/users', postUser);

export default router;

