const mongoose = require("mongoose");
const Joi = require("joi");

const allotmentSchema = mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
    allotmentOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle" }
});

const Allotment = mongoose.model('allotment', allotmentSchema);

const allotmentValidation = Joi.object().keys({
    _id: Joi.string().optional(),
    __v: Joi.number().optional(),
    bookingId: Joi.string().hex().length(24).required(), // Valid MongoDB ObjectId
    allotmentOfficer: Joi.string().hex().length(24).required(), // Valid MongoDB ObjectId
    driver: Joi.string().hex().length(24).required(),
    vehicle: Joi.string().hex().length(24).required()
});

module.exports = { Allotment, allotmentValidation }