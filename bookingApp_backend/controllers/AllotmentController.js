const { allotmentValidation, Allotment } = require("../models/AllotmentModel");
const { Booking } = require("../models/BookingModel");
const nodemailer = require("nodemailer");
const { Vehicle } = require("../models/VehicleModel");
const { Employee } = require("../models/UserModel");

async function addAllotment(req, res) {
    try {
        const booking = await Booking.findById(req.params.id);
        const vehicle = await Vehicle.findById(req.body.vehicle);
        const driver = await Employee.findById(req.body.driver);
        const { pickupLocation, destination, email } = booking;
        const newAllotment = { ...req.body, bookingId: req.params.id }
        
        const validation = allotmentValidation.validate(newAllotment);
        const { error } = validation;
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        } else {
            const isAlloted = await Allotment.find({ bookingId: req.params.id }).exec();
            if (isAlloted.length > 0) {
                return res.status(400).send({ error: "Already alloted taxi for this trip" })
            } else {
                const allotment = await Allotment.create(newAllotment);
                // add booking id in allotment
                booking.allotment = allotment._id;
                await booking.save();

                // update statue for vehicle
                vehicle.onTrip = true;
                await vehicle.save();
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                var mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Booking confirmation from RBC Travels',
                    html: `<!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>RBC Travels</title>
                        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
                      </head>
                      <body style="margin: 0; font-family: 'Roboto', sans-serif; background-color: #f4f4f4;">
                        <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
                          <div style="width: 300px; border-radius: 10px; padding: 20px; background: white; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; font-size: 16px; color: #333;">
                            <h4 style="text-align: center; margin-bottom: 10px; color: #333;">Driver and Vehicle Details</h4>
                            <p style="margin: 8px 0;">Driver Name: <b>${driver.name}</b></p>
                            <p style="margin: 8px 0;">Driver Contact: <a href="tel:+91${driver.contact}" style="color: #007BFF; text-decoration: none;"><b>${driver.contact}</b></a></p>
                            <p style="margin: 8px 0;">Vehicle Name: <b>${vehicle.name}</b></p>
                            <p style="margin: 8px 0;">Vehicle Number: <b>${vehicle.vehicleNo}</b></p>
                          </div>
                        </div>
                      </body>
                    </html>`                    
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(500).send({ message: error.message })
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.send({ message: `${vehicle.name} has been alloted for ${pickupLocation} - ${destination} trip.` })
            }
        }
    } catch (error) {
        console.log(error);

        return res.status(500).send({ error: error.message?.replace(/["\\]/g, '') })
    }
}

async function getAllotments(req, res) {
    try {
        const allotments = await Allotment.find({})
            .populate("driver")
            .populate("vehicle")
            .exec();
        res.send(allotments);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function getAllomentById(req, res) {
    try {
        const allotement = await Allotment.findOne({ bookingId: req.params.id });
        if (allotement?._id) {
            return res.send(allotement);
        } else {
            return res.status(404).send({ error: "Did't Allot taxi for this trip." })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function updateAllotment(req, res) {
    try {
        const { pickupLocation, destination, email, tripCompleted } = await Booking.findById(req.params.id);
        const updatedAllotment = {
            ...req.body,
            bookingId: req.params.id,
        }
        const validation = allotmentValidation.validate(updatedAllotment);
        const { error } = validation;
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        } else {
            const vehicleData = await Vehicle.findById(req.body.vehicle)
            const updateAllot = await Allotment.findOneAndUpdate({ bookingId: req.params.id }, updatedAllotment, { new: true })
            if (tripCompleted) {
                return res.send({ message: `${updateAllot.vehicleData.name} has been allotment updated for ${pickupLocation} - ${destination} trip.` })
            } else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                var mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Booking Confirmation from RBC Travels 🚖',
                    html: `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <title>RBC Travels</title>
                                    <style>
                                        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap");
                                        * {
                                            font-family: 'Roboto', sans-serif;
                                        }
                                        .container {
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            background-color: #f4f4f4;
                                            padding: 20px;
                                        }
                                        .content {
                                            width: 300px;
                                            border-radius: 10px;
                                            padding: 20px;
                                            background: white;
                                            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                                            font-size: 16px;
                                            color: #333;
                                        }
                                        h4, h3 {
                                            text-align: center;
                                            margin-bottom: 10px;
                                            color: #333;
                                        }
                                        p {
                                            margin: 8px 0;
                                        }
                                        a {
                                            color: #007BFF;
                                            text-decoration: none;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="content">
                                            <h3>Your booking has been updated below details</h3>
                                            <h4>Driver and Vehicle Details</h4>
                                            <p>Driver Name: <b>${updateAllot.driverName}</b></p>
                                            <p>Driver Contact: <a href="tel:+91${updateAllot.driverContact}"><b>${updateAllot.driverContact}</b></a></p>
                                            <p>Vehicle Name: <b>${updateAllot.vehicleName}</b></p>
                                            <p>Vehicle Number: <b>${updateAllot.vehicleNo}</b></p>
                                        </div>
                                    </div>
                                </body>
                            </html>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(500).send({ error: error.message })
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.send({ message: `${vehicleData.name} has been allotment updated for ${pickupLocation} - ${destination} trip.` })
            }
        }
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}


module.exports = { addAllotment, getAllotments, getAllomentById, updateAllotment }