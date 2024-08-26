"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controller/users.controller");
const router = (0, express_1.Router)();
router.post('/users', users_controller_1.postUser);
exports.default = router;
