const mongoose = require("mongoose");
const Joi = require("joi");

const empSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  contact: { type: String },
  role: { type: String },
  account: { type: Number },
  blood: { type: String },
  address: { type: String },
  emergencyConNumber: { type: String },
  emergencyConPerson: { type: String },
  homeLocation: { type: String },
  drivingLicence: { type: String },
  aadharCard: { type: String },
  bankAccount: { type: String },
  gPayNumber: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" }
})

const Employee = mongoose.model("employee", empSchema);

const empValidation = Joi.object({
  _id: Joi.any().optional(),
  __v: Joi.any().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // You can adjust min length
  contact: Joi.string().pattern(/^[0-9]{10}$/).message("contact must be 10 characters").required(),
  role: Joi.string().required(),
  account: Joi.number().required(),
  blood: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').optional(),
  address: Joi.string().required(),
  emergencyConNumber: Joi.string().pattern(/^[0-9]{10}$/).message("emergencyConNumber must be 10 characters").optional(),
  emergencyConPerson: Joi.string().optional(),
  homeLocation: Joi.string().optional(),
  drivingLicence: Joi.string().optional(),
  aadharCard: Joi.string().pattern(/^[0-9]{12}$/).message("aadharCard must be 12 characters").required(),
  bankAccount: Joi.string().required(),
  createdBy: Joi.any().optional(),
  gPayNumber: Joi.string().pattern(/^[0-9]{10}$/).message("gPayNumber must be 10 characters").optional()
});



module.exports = { Employee, empValidation }