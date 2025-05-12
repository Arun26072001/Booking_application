const mongoose = require("mongoose");
const Joi = require("joi");

const bookingSchema = new mongoose.Schema({
    sourceOfBooking: { type: String },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    customerName: { type: String },
    customerContact: { type: String },
    email: { type: String, trim: true, lowercase: true },
    tripType: { type: String }, // Fixed definition
    numOfPeople: { type: Number },
    vehicleType: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle" },
    pickupDateTime: { type: Date },
    pickupLocation: { type: String },
    pickupLocationLink: { type: String },
    destination: { type: String },
    dropDateTime: { type: Date },
    placesToVisit: [{ type: String }],
    notes: { type: String },
    kmAllowed: { type: Number },
    totalPayment: { type: Number },
    balanceToDriver: { type: Number },
    advancePayment: { type: Number },
    isIncludesTollAndParking: { type: String },
    extraKmCharge: { type: Number },
    extraHourCharge: { type: Number },
    tripCompleted: { type: Boolean, default: false },
    allotment: { type: mongoose.Schema.Types.ObjectId, ref: "allotment" },
    vehicleInTrip: { type: mongoose.Schema.Types.ObjectId, ref: "tripComplete" },
    tripCost: { type: mongoose.Schema.Types.ObjectId, ref: "TripCost", default: null }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

const bookingValidation = Joi.object({
    sourceOfBooking: Joi.string().required(),
    bookedBy: Joi.string().hex().length(24).required(),
    customerName: Joi.string().required(),
    customerContact: Joi.string().pattern(/^[0-9]{10,15}$/).required(), // Adjust the range if needed
    email: Joi.string().email().lowercase().trim().required(),
    tripType: Joi.string().required(),
    numOfPeople: Joi.number().integer().min(1).max(100).required(),
    vehicleType: Joi.string().hex().length(24).required(),
    pickupDateTime: Joi.string().required(), // Consider changing to Joi.date() if you're using ISO strings
    pickupLocation: Joi.string().required(),
    pickupLocationLink: Joi.string().uri().allow(""), // Optional but must be valid URL if present
    destination: Joi.string().required(),
    dropDateTime: Joi.string().required(), // Again, could be Joi.date() if using ISO format
    placesToVisit: Joi.array().items(Joi.string()).default([]),
    notes: Joi.string().allow(""),
    kmAllowed: Joi.number().min(0).required(),
    totalPayment: Joi.number().min(0).required(),
    advancePayment: Joi.number().min(0).max(Joi.ref("totalPayment")).required(),
    balanceToDriver: Joi.number().min(0).max(Joi.ref("totalPayment")).required(),
    isIncludesTollAndParking: Joi.string().valid("yes", "no", "Yes", "No").required(), // Adjust to match your expected values
    extraKmCharge: Joi.number().min(0).required(),
    extraHourCharge: Joi.number().min(0).required(),
    tripCompleted: Joi.boolean().default(false),
});

module.exports = { Booking, bookingValidation }
