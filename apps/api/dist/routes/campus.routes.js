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
const campusController = __importStar(require("../controllers/campus.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rights_middleware_1 = require("../middleware/rights.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const validators_1 = require("../utils/validators");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const createCampusBodySchema = zod_1.z.object({
    name: validators_1.campusNameSchema,
    city: zod_1.z.string().min(2).max(100).trim(),
    address: validators_1.campusAddressSchema.optional(),
});
const updateCampusBodySchema = zod_1.z.object({
    name: validators_1.campusNameSchema.optional(),
    city: zod_1.z.string().min(2).max(100).trim().optional(),
    address: validators_1.campusAddressSchema.optional().nullable(),
});
const campusIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Invalid campus ID'),
});
router.get('/', campusController.getAll);
router.get('/:id', (0, validate_middleware_1.validate)({ params: campusIdParamsSchema }), campusController.getById);
router.post('/', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ body: createCampusBodySchema }), campusController.create);
router.put('/:id', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ params: campusIdParamsSchema, body: updateCampusBodySchema }), campusController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, rights_middleware_1.requireRights)(client_1.UserRight.EDIT_RIGHTS), (0, validate_middleware_1.validate)({ params: campusIdParamsSchema }), campusController.deleteCampus);
exports.default = router;
