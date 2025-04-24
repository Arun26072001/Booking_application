const mongoose = require("mongoose");
const Joi = require("joi");

const tripCompleteSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
        startingKm: { type: Number },
        startedLocation: { type: String },
        closedLocation: { type: String },
        closingKm: { type: Number },
        totalKm: { type: Number },
        receivedAmount: { type: Number },
        tollParkingCharges: { type: Number },
        startingKmImg: { type: String },
        closingKmImg: { type: String },
        tollReceipts: [{ type: String }],
        parkingReceipts: [{ type: String }],
        otherReceipts: [{ type: String }]
    },
    { timestamps: true }
);

const TripComplete = mongoose.model('tripComplete', tripCompleteSchema)

const TripCompleteValidation = Joi.object({
    _id: Joi.string().optional(),
    __v: Joi.number().optional(),
    bookingId: Joi.string().hex().length(24).required(), // Valid MongoDB ObjectId
    startingKm: Joi.number().positive().required(),
    closingKm: Joi.number().positive().min(Joi.ref('startingKm')).required(), // closingKm should be >= startingKm
    receivedAmount: Joi.number().positive().required(),
    totalKm: Joi.number().positive(),
    tripDoc: Joi.array().items(Joi.string().required()).min(1).required(),
    tollreceipts: Joi.any().optional(),
    parkingReceipts: Joi.any().optional(),
    otherReceipts: Joi.any().optional(),
});

module.exports = { TripComplete, TripCompleteValidation }