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
exports.deleteReservation = exports.update = exports.create = exports.getRoomReservations = exports.getMyReservations = exports.getById = exports.getAll = void 0;
const reservationService = __importStar(require("../services/reservation.service"));
const error_middleware_1 = require("../middleware/error.middleware");
exports.getAll = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const filters = {
        userId: req.query.userId,
        roomId: req.query.roomId,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        type: req.query.type,
    };
    const reservations = await reservationService.getAll(filters);
    res.status(200).json(reservations);
});
exports.getById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const reservation = await reservationService.getById(req.params.id);
    res.status(200).json(reservation);
});
exports.getMyReservations = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id; // From auth middleware
    const reservations = await reservationService.getByUserId(userId);
    res.status(200).json(reservations);
});
exports.getRoomReservations = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { roomId } = req.params;
    let dateRange;
    if (req.query.startDate && req.query.endDate) {
        dateRange = {
            startDate: new Date(req.query.startDate),
            endDate: new Date(req.query.endDate),
        };
    }
    const reservations = await reservationService.getByRoomId(roomId, dateRange);
    res.status(200).json(reservations);
});
exports.create = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id; // From auth middleware
    const reservation = await reservationService.create({
        ...req.body,
        userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    });
    res.status(201).json(reservation);
});
exports.update = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const updateData = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    };
    const reservation = await reservationService.update(req.params.id, updateData);
    res.status(200).json(reservation);
});
exports.deleteReservation = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await reservationService.deleteReservation(req.params.id);
    res.status(200).json(result);
});
