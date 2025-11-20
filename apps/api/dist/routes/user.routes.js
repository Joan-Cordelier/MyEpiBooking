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
const userController = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rights_middleware_1 = require("../middleware/rights.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
// Zod schemas
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    actual_promotion: zod_1.z.string().optional(),
    photo: zod_1.z.string().url().optional(),
    campusId: zod_1.z.string().cuid().optional(),
    rights: zod_1.z.array(zod_1.z.nativeEnum(client_1.UserRight)).optional(),
});
const updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(8).optional(),
    name: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    actual_promotion: zod_1.z.string().optional(),
    photo: zod_1.z.string().url().optional(),
    campusId: zod_1.z.string().cuid().optional().nullable(),
});
const updateRightsSchema = zod_1.z.object({
    rights: zod_1.z.array(zod_1.z.nativeEnum(client_1.UserRight)),
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
// Middleware to check if user is accessing their own profile or is SUPER_ADMIN
const checkSelfOrAdmin = (req, _res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError(401, 'Authentication required');
        }
        const requestedUserId = req.params.id;
        const currentUserId = req.user.id;
        const userRights = req.user.rights || [];
        if (userRights.includes(client_1.UserRight.EDIT_RIGHTS)) {
            return next();
        }
        if (requestedUserId === currentUserId) {
            return next();
        }
        throw new error_middleware_1.AppError(403, 'You can only access your own profile');
    }
    catch (error) {
        next(error);
    }
};
router.get('/', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), userController.getAll);
router.get('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: idParamSchema }), checkSelfOrAdmin, userController.getById);
router.post('/', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ body: createUserSchema }), userController.create);
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)({ params: idParamSchema, body: updateUserSchema }), checkSelfOrAdmin, userController.update);
router.patch('/:id/rights', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ params: idParamSchema, body: updateRightsSchema }), userController.updateRights);
router.delete('/:id', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ params: idParamSchema }), userController.deleteUser);
exports.default = router;
