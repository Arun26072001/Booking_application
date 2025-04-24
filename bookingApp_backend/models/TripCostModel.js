const mongoose = require("mongoose");
const Joi = require("joi");

const tripCostSchema = new mongoose.Schema({
    serviceProvider: { type: String },
    dieselAmount: { type: Number },
    driverAmount: { type: Number },
    otherExpenses: { type: Number },
    vendorSettlements: { type: Number },
    netProfit: { type: Number }
})

const TripCost = mongoose.model("tripcosts", tripCostSchema);

const tripCostValidation = Joi.object({
    serviceProvider: Joi.string().required(),
    dieselAmount: Joi.number().positive().required(),
    driverAmount: Joi.number().positive().required(),
    otherExpenses: Joi.number().positive().required(),
    vendorSettlements: Joi.number().positive().required(),
    netProfit: Joi.number().positive().required()
});

module.exports = {
    TripCost,
    tripCostValidation
}