"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trajectories_controller_1 = require("../controller/trajectories_controller");
const router = (0, express_1.Router)();
router.get('/', trajectories_controller_1.getAllTrajectories);
exports.default = router;
