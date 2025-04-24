const mongoose = require("mongoose");
const Joi = require("joi");

const StateSchema = new mongoose.Schema({
    stateName: {type: String},
    cities: [{type: String}]
});

const State = mongoose.model("states", StateSchema);

const StateValidation = Joi.object().keys({
    stateName: Joi.string().required().label("StateName"),
    cities: Joi.array().items(Joi.string()).required().label("Cities")
})

module.exports = {State, StateValidation};