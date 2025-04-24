const { vehicleValidation, Vehicle } = require("../models/VehicleModel");

async function addVehicle(req, res) {
    try {
        const validation = vehicleValidation.validate(req.body);
        const { error } = validation;
        if (error) {
            res.status(403).send({ error: error.message.replace(/["\\]/g, '') })
        } else {
            // const isVehicle = await Vehicle.find({ vehicleNo: req.body.vehicleNo });
            if (await Vehicle.exists({ vehicleNo: req.body.vehicleNo })) {
                res.status(400).send({ error: `Already has this ${req.body.vehicleNo} taxi` })
            } else {
                const addingVehicle = await Vehicle.create(req.body);
                res.send({ message: `New ${addingVehicle.name} taxi added` })
            }
        }
    } catch (err) {
        res.status(500).send({ error: "internal server error", details: err.message })
    }
}

async function getAllVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find().exec();
        res.send(vehicles)
    } catch (error) {
        res.send({ error: error.message })
    }
}

async function updateVehicle(req, res) {
    try {
        const { error } = vehicleValidation.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.send({ message: `${updatedVehicle.name} data updated successfully` })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

async function getVehicleById(req, res) {
    try {
        const vehicle = await Vehicle.findOne({ vehicleNo: req.params.name });
        if (!vehicle) {
            return res.status(404).send({ error: "vehicle not found" })
        } else {
            return res.send(vehicle)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}

async function deleteVehicle(req, res) {
    try {
        const deleted = await Vehicle.findByIdAndDelete(req.params.id);
        return res.send({ message: `${deleted.name} Vehicle is delete successfully` })
    } catch (error) {
        console.log("error in delete vehicle", error);
        return res.status(500).send({ error: error.message })
    }
}

module.exports = { addVehicle, getAllVehicles, deleteVehicle, getVehicleById, updateVehicle };