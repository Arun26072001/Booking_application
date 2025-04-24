const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./routers/auth");
const booking = require("./routers/booking");
const vehicle = require("./routers/vehicle");
const allotment = require("./routers/allotment");
const completeTrip = require("./routers/trip-complete");
const state = require("./routers/state");
const tripCost = require("./routers/trip-cost");
const { imgUpload } = require("./controllers/ImgUpload");
const fs = require('fs');
const path = require("path");
const axios = require("axios");
const schedule = require("node-schedule");
const { TripComplete } = require("./models/TripCompleteModel");
dotenv.config({ path: "./config/config.env" });

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads
// API Endpoints
app.get("/", (req, res) => {
    require("dns").resolve("www.google.com", function (err) {
        if (err) {
            res.status(1024).send("Network not Connected!");
        } else {
            res.send({ message: "API and Network connected!" });
        }
    });
});


app.use("/tripDocs", express.static(path.join(__dirname, "tripDocs")));

// Routers
app.use("/api/auth", auth);
app.use("/api/booking", booking);
app.use("/api/vehicle", vehicle);
app.use("/api/allotment", allotment);
app.use("/api/trip-complete", completeTrip);
app.use("/api/upload", imgUpload);
app.use("/api/state", state)
app.use("/api/trip-cost", tripCost);

// Catch-all 404 Route
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

const deleteImage = (filename) => {
    const filePath = path.join(__dirname, "tripDocs", filename); // adjust path as needed
    console.log(filePath);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Failed to delete image:', err);
        } else {
            console.log('Image deleted:', filename);
        }
    });
};

async function fetchTripCompletedData() {
    try {
        const imgFileFolders = ["otherReceipts", "parkingReceipts", "tollReceipts"];
        const response = await axios.get(`${process.env.BACKEND_BASEURL}/api/trip-complete`);
        const tripCompletedData = response.data;

        if (tripCompletedData.length) {
            tripCompletedData.forEach((data) => {
                const bookingDate = new Date(data.createdAt);
                const scheduledDate = new Date(bookingDate);
                scheduledDate.setDate(bookingDate.getDate() + 15);

                const cronSchedule = `${scheduledDate.getMinutes()} ${scheduledDate.getHours()} ${scheduledDate.getDate()} ${scheduledDate.getMonth() + 1} *`;

                schedule.scheduleJob(cronSchedule, async () => {
                    try {
                        // Delete starting km image
                        if (data.startingKmImg) {
                            const startKmFile = data.startingKmImg.split("/").pop();
                            deleteImage(startKmFile);
                        }

                        // Delete closing km image
                        if (data.closingKmImg) {
                            const closeKmFile = data.closingKmImg.split("/").pop();
                            deleteImage(closeKmFile);
                        }

                        // Delete receipt images
                        await Promise.all(imgFileFolders.map(async (folder) => {
                            if (Array.isArray(data[folder])) {
                                await Promise.all(data[folder].map(async (img) => {
                                    const fileName = img.split("/").pop();
                                    deleteImage(fileName);
                                }));
                            }
                        }));

                        // Clear image references from DB
                        const updateData = {
                            startingKmImg: "",
                            closingKmImg: "",
                        };
                        imgFileFolders.forEach(folder => {
                            updateData[folder] = [];
                        });

                        await TripComplete.findByIdAndUpdate(data._id, updateData);
                    } catch (err) {
                        console.log("Error deleting trip images:", err);
                    }
                });
            });
        }
    } catch (error) {
        console.log("Error in fetching trip complete data:", error);
    }
}

fetchTripCompletedData();

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
