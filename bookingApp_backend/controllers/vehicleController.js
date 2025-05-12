const { vehicleValidation, Vehicle } = require("../models/VehicleModel");

async function addVehicle(req, res) {
    try {
        const newVehicle = {
            ...req.body,
            createdBy: req.params.id
        }
        const validation = vehicleValidation.validate(newVehicle);
        const { error } = validation;
        if (error) {
            res.status(400).send({ error: error.message.replace(/["\\]/g, '') })
        } else {
            // const isVehicle = await Vehicle.find({ vehicleNo: req.body.vehicleNo });
            if (await Vehicle.exists({ vehicleNo: newVehicle.vehicleNo })) {
                res.status(400).send({ error: `Already has this ${newVehicle.vehicleNo} taxi` })
            } else {
                const addingVehicle = await Vehicle.create(newVehicle);
                res.send({ message: `New ${addingVehicle.name} taxi added` })
            }
        }
    } catch (err) {
        res.status(500).send({ error: "internal server error", details: err.message })
    }
}

async function getAllVehicles(req, res) {
    try {
        let filterObj = {};
        if (req.query.filter) {
            filterObj = req.query.filter;
        }
        const vehicles = await Vehicle.find(
            filterObj
        ).exec();
        res.send(vehicles)
    } catch (error) {
        res.send({ error: error.message })
    }
}

async function fetchDriverVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find({ createdBy: req.params.id }).lean().exec();
        if (!vehicles.length) {
            return res.send([])
        } else {
            return res.send(vehicles)
        }
    } catch (error) {
        console.log("error in fetch driver vehicles", error);
        return res.status(500).send({ error: error.message })
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

module.exports = { addVehicle, fetchDriverVehicles, getAllVehicles, deleteVehicle, getVehicleById, updateVehicle };