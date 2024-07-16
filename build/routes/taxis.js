"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taxis_controller_1 = require("../controller/taxis_controller");
const router = (0, express_1.Router)();
router.get('/', taxis_controller_1.getAllTaxis);
exports.default = router;
