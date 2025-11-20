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
const reservationController = __importStar(require("../controllers/reservation.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rights_middleware_1 = require("../middleware/rights.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const client_1 = require("@prisma/client");
const reservationService = __importStar(require("../services/reservation.service"));
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
// Zod schemas
const createReservationSchema = zod_1.z.object({
    type: zod_1.z.enum(['MEETING', 'WORKSHOP', 'LECTURE', 'EXAM', 'OTHER']),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    roomId: zod_1.z.string().cuid(),
});
const updateReservationSchema = zod_1.z.object({
    type: zod_1.z.enum(['MEETING', 'WORKSHOP', 'LECTURE', 'EXAM', 'OTHER']).optional(),
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    roomId: zod_1.z.string().cuid().optional(),
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
const roomIdParamSchema = zod_1.z.object({
    roomId: zod_1.z.string().cuid(),
});
const dateRangeQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
const checkOwnership = async (req, _res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError(401, 'Authentication required');
        }
        const reservationId = req.params.id;
        const userId = req.user.id;
        const userRights = req.user.rights || [];
        if (userRights.includes(client_1.UserRight.EDIT_RESERVATION)) {
            return next();
        }
        const reservation = await reservationService.getById(reservationId);
        if (reservation.userId !== userId) {
            throw new error_middleware_1.AppError(403, 'You can only modify your own reservations');
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
router.get('/', auth_middleware_1.authenticate, reservationController.getAll);
router.get('/me', auth_middleware_1.authenticate, reservationController.getMyReservations);
router.get('/rooms/:roomId', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: roomIdParamSchema, query: dateRangeQuerySchema }), reservationController.getRoomReservations);
router.get('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: idParamSchema }), reservationController.getById);
router.post('/', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.BOOK_ROOM), (0, validate_middleware_1.validate)({ body: createReservationSchema }), reservationController.create);
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: idParamSchema, body: updateReservationSchema }), checkOwnership, reservationController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: idParamSchema }), checkOwnership, reservationController.deleteReservation);
exports.default = router;
