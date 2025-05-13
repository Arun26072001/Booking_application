const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleSchema = mongoose.Schema({
    name: { type: String },
    type: { type: String },
    capacity: { type: Number },
    ownerCumDriver: { type: Boolean },
    FCExpireDate: { type: Date },
    insuranceExpireDate: { type: Date },
    registeredOwnerName: { type: String },
    vehicleNo: { type: String },
    mfgYear: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    onTrip: { type: Boolean, default: false }
}, { timestamps: true });

const Vehicle = mongoose.model("vehicle", vehicleSchema);

const vehicleValidation = Joi.object({
    _id: Joi.any().optional(),
    __v: Joi.any().optional(),
    name: Joi.string().required(),
    capacity: Joi.number().min(3).max(100).required(),
    type: Joi.string().required(),
    ownerCumDriver: Joi.boolean().required(),
    FCExpireDate: Joi.date().required(),
    insuranceExpireDate: Joi.date().required(),
    registeredOwnerName: Joi.string().required(),
    vehicleNo: Joi.string().required(),
    mfgYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    createdBy: Joi.any().optional()
});

module.exports = { Vehicle, vehicleValidation }