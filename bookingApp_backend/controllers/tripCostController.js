// import { tripCostValidation, TripCost } from "../models/TripCostModel";
const { Booking } = require("../models/BookingModel");
const { tripCostValidation, TripCost } = require("../models/TripCostModel")

exports.addTripCost = async (req, res) => {
    try {
        // check validation for trip-cost 
        const { error } = tripCostValidation.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        } else {
            const tripCost = await TripCost.create(req.body);
            // add trip cost data in booking
            const booking = await Booking.findById(req.params.id, "tripCost tripCompleted");
            booking.tripCost = tripCost._id;
            booking.tripCompleted = true;
            await booking.save();
            return res.send({ message: "Trip Completed successfully", tripCost })
        }
    } catch (error) {
        console.log(error);

        return res.status(500).send({ error: error.message })
    }
}
