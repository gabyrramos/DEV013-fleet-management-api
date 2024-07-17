"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taxis_1 = __importDefault(require("./taxis"));
const router = (0, express_1.Router)();
router.use(taxis_1.default);
//router.use('/trajectories', trajectoriesRouter);
exports.default = router;
