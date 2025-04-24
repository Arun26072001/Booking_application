const { State, StateValidation } = require("../models/StateModel")

exports.getStates = async (req, res) => {
    try {
        const states = await State.find().exec();
        res.send(states);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

exports.addState = async (req, res) => {
    try {
        const validation = StateValidation.validate(req.body);
        const { error } = validation;
        if (error) {
            res.status(400).send({ error: error.details[0].message })
        } else {
            const addState = await State.create(req.body);
            res.send({ message: "state has been added", addState })
        }

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}