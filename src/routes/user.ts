import { Router } from "express";
import { postUser, getUsers, editUser, deleteUser } from "../controller/users.controller";

const router = Router();

router.post('/', postUser);

router.get('/', getUsers);

router.put('/:id', editUser);

router.delete('/:identifier', deleteUser);

export default router;

