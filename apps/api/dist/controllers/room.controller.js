"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateState = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const roomService = __importStar(require("../services/room.service"));
const error_middleware_1 = require("../middleware/error.middleware");
exports.getAll = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { campusId, floor, state } = req.query;
    const filters = {
        ...(campusId && { campusId: campusId }),
        ...(floor && { floor: floor }),
        ...(state && { state: state }),
    };
    const rooms = await roomService.getAll(filters);
    res.status(200).json(rooms);
});
exports.getById = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const room = await roomService.getById(id);
    res.status(200).json(room);
});
exports.create = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { name, floor, capacity, description, campusId, state } = req.body;
    const room = await roomService.create(name, floor, capacity, description, campusId, state);
    res.status(201).json(room);
});
exports.update = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const updateFields = req.body;
    const room = await roomService.update(id, updateFields);
    res.status(200).json(room);
});
exports.updateState = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const { state } = req.body;
    const room = await roomService.updateState(id, state);
    res.status(200).json(room);
});
exports.deleteRoom = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const result = await roomService.deleteRoom(id);
    res.status(200).json(result);
});
