const { Booking } = require("../models/BookingModel");
const { TripComplete } = require("../models/TripCompleteModel")
const fs = require("fs");
const path = require("path");

const completeTripToDriver = async (req, res) => {
    try {
        // Validate booking existence
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ error: "Booking not found!" });
        }
        const newCompletedTripData = {
            ...req.body,
            bookingId: req.params.id
        }
        const addCompletedTrip = await TripComplete.create(newCompletedTripData);
        booking.vehicleInTrip = addCompletedTrip._id;
        await booking.save();
        return res.send({ message: "Trip details added successfully", addCompletedTrip })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
};

const getCompletedTripDetails = async (req, res) => {
    try {
        let completedTrip = await TripComplete.findOne({ bookingId: req.params.id }).exec();
        if (!completedTrip) {
            return res.status(404).send({ error: "trip completed data not found" })
        }
        return res.send(completedTrip)
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
}

const getCompletedTrips = async (req, res) => {
    try {
        const completedData = await TripComplete.find().exec();
        const filteredData = completedData.filter((data) => data.receivedAmount !== 0)
        return res.send(filteredData);
    } catch (error) {
        console.log("error in fetch compleetd trip data");

    }
}

const deleteOldFiles = (oldFiles = [], newFiles = []) => {
    oldFiles.forEach((file, index) => {
        if (file !== newFiles[index]) {
            const filename = file?.split("/").pop();
            const filePath = path.join(__dirname, "..", "uploads", filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted file: ${filename}`);
                } catch (error) {
                    console.error("Error deleting file:", error.message);
                }
            }
        }
    });
};

const updateCompletedTrip = async (req, res) => {
    try {
        const tripData = await TripComplete.findById(req.params.id);
        if (!tripData) {
            return res.status(404).send({ error: "TripCompleted data not found" })
        }
        // 🔁 Delete outdated files
        deleteOldFiles(tripData.tollReceipts, req.body.tollReceipts || []);
        deleteOldFiles(tripData.parkingReceipts, req.body.parkingReceipts || []);
        deleteOldFiles(tripData.otherReceipts, req.body.otherReceipts || []);
        const updateTrip = await TripComplete.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({ message: `Taxi ran in ${updateTrip.startingKm} - ${updateTrip.closingKm} with trip has been completed` })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
}

module.exports = { completeTripToDriver, getCompletedTrips, getCompletedTripDetails, updateCompletedTrip }