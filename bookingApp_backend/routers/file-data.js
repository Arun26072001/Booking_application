const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const fs = require("fs");
const { verifyAdmin } = require("../middleware/authorization");
const { imgUpload } = require("../controllers/ImgUpload");

router.post("/leave", imgUpload("photo"), verifyAdmin, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: false, message: "No file uploaded." });
    }

    const months = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    const filePath = req.file.path;

    try {
        const workbook = XLSX.readFile(filePath);

        // Ensure there is at least one sheet
        if (workbook.SheetNames.length < 2) {
            throw new Error("The second sheet is missing!");
        }

        const sheetName = workbook.SheetNames[1]; // Get the second sheet name
        if (!sheetName) {
            throw new Error("Sheet not found!");
        }

        const monthNumber = months.findIndex(m => m === sheetName.toLowerCase());
        if (monthNumber === -1) {
            throw new Error(`Invalid month detected in sheet name: ${sheetName}`);
        }

        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 0 });

        let bookings = [];
        let existBookings = [];
        const today = new Date();
        today.setMonth(monthNumber);

        for (let i = 1; i < excelData.length; i++) {
            const row = excelData[i];
            console.log(row);

        }


        // // Create leave applications in bulk
        // const bookings = await Promise.all(leaveApps.map(async leave => {
        //     const emp = employeeMap[leave.name.split(" ")[0].toLowerCase()];
        //     if (!emp) return null; // Skip if employee is not found
        //     if (await LeaveApplication.exists({ employee: emp._id, date: leave.date })) {
        //         existsApps.push(leave);
        //         return null;
        //     } else {
        //         return {
        //             leaveType: leave.status === "CL" ? "Annual Leave"
        //                 : leave.status === "SL" ? "Sick Leave"
        //                     : leave.status === "LOP" ? "Unpaid Leave(LOP)"
        //                         : "Annual Leave",
        //             fromDate: leave.date,
        //             toDate: leave.date,
        //             periodOfLeave: leave.status === "HD" ? "half day" : "full day",
        //             reasonForLeave: "Employee's person reason",
        //             prescription: "",
        //             employee: emp._id.toString(),
        //             coverBy: null,
        //             status: "approved",
        //             TeamLead: "approved",
        //             TeamHead: "approved",
        //             Hr: "approved",
        //             approvedOn: new Date(),
        //             approverId: []
        //         };

        //     }));

        // const onlyLeaveApps = leaveApplications?.filter(leave => leave !== null);
        // const createdLeaves = await LeaveApplication.insertMany(onlyLeaveApps);

        // // Update employee leave applications
        // await Promise.all(createdLeaves.map(async (leave) => {
        //     const emp = await Employee.findById(leave.employee)

        //     if (emp) {
        //         emp.leaveApplication.push(leave._id);
        //         await emp.save();
        //     }
        // }));

        res.status(200).json({ status: true, message: `${createdLeaves.length} leave applications added and ${existsApps.length} leave application exists.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: error.message || "An error occurred during the bulk import process."
        });
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete uploaded file
        }
    }
});

module.exports = router