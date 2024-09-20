import { Router } from "express";
import { postUser, getUsers, editUser, deleteUser } from "../controller/users.controller";
import {requireAuth, requireAdmin } from "../middleware/authorization";


const router = Router();

router.post('/', requireAuth, requireAdmin, postUser);

router.get('/', requireAuth, requireAdmin, getUsers);

router.put('/:id', requireAuth, editUser);

router.delete('/:identifier', requireAuth, deleteUser);


export default router;

