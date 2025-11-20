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
const express_1 = require("express");
const zod_1 = require("zod");
const roomController = __importStar(require("../controllers/room.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rights_middleware_1 = require("../middleware/rights.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const validators_1 = require("../utils/validators");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const createRoomBodySchema = zod_1.z.object({
    name: validators_1.roomNameSchema,
    floor: zod_1.z.string().min(1).max(10).trim(),
    capacity: validators_1.roomCapacitySchema,
    description: zod_1.z.string().min(1).max(500).trim(),
    campusId: zod_1.z.string().cuid('Invalid campus ID'),
    state: zod_1.z.nativeEnum(client_1.RoomState).optional(),
});
const updateRoomBodySchema = zod_1.z.object({
    name: validators_1.roomNameSchema.optional(),
    floor: zod_1.z.string().min(1).max(10).trim().optional(),
    capacity: validators_1.roomCapacitySchema.optional(),
    description: zod_1.z.string().min(1).max(500).trim().optional(),
    campusId: zod_1.z.string().cuid('Invalid campus ID').optional(),
    state: zod_1.z.nativeEnum(client_1.RoomState).optional(),
});
const updateStateBodySchema = zod_1.z.object({
    state: zod_1.z.nativeEnum(client_1.RoomState),
});
const roomIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Invalid room ID'),
});
router.get('/', roomController.getAll);
router.get('/:id', (0, validate_middleware_1.validate)({ params: roomIdParamsSchema }), roomController.getById);
router.post('/', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_ROOM), (0, validate_middleware_1.validate)({ body: createRoomBodySchema }), roomController.create);
router.put('/:id', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_ROOM), (0, validate_middleware_1.validate)({ params: roomIdParamsSchema, body: updateRoomBodySchema }), roomController.update);
router.patch('/:id/state', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_ROOM), (0, validate_middleware_1.validate)({ params: roomIdParamsSchema, body: updateStateBodySchema }), roomController.updateState);
router.delete('/:id', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_ROOM), (0, validate_middleware_1.validate)({ params: roomIdParamsSchema }), roomController.deleteRoom);
exports.default = router;
