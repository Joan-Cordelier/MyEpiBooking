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
exports.deleteCampus = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const campusService = __importStar(require("../services/campus.service"));
const error_middleware_1 = require("../middleware/error.middleware");
exports.getAll = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { city, name } = req.query;
    const filters = {
        ...(city && { city: city }),
        ...(name && { name: name }),
    };
    const campuses = await campusService.getAll(filters);
    res.status(200).json(campuses);
});
exports.getById = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const campus = await campusService.getById(id);
    res.status(200).json(campus);
});
exports.create = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { name, city, address } = req.body;
    const campus = await campusService.create(name, city, address);
    res.status(201).json(campus);
});
exports.update = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const updateFields = req.body;
    const campus = await campusService.update(id, updateFields);
    res.status(200).json(campus);
});
exports.deleteCampus = (0, error_middleware_1.asyncHandler)(async (req, res, _next) => {
    const { id } = req.params;
    const result = await campusService.deleteCampus(id);
    res.status(200).json(result);
});
