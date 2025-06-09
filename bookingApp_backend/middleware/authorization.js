const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if (account === 1) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminManagerVendor(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];
        const { account } = jwt.decode(token);
        if ([1, 2, 6].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminManager(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];
        const { account } = jwt.decode(token);
        if ([1, 2, 6].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyEmployees(req, res, next) {
    const token = req.headers.authorization;

    if (![undefined, null, ""].includes(token)) {
        const { account } = jwt.decode(token);
        if ([1, 2, 3, 4, 5, 6].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "you no authorization, because token not found" })
    }
}

function verifyAllotor(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if (account === 3) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminManagerConsultant(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 2, 3].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminManagerConsultantAccount(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 2, 3, 5].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminManagerAccountant(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 2, 5].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyVendorDriverManagerAdmin(req, res, next) {
    if (![undefined, null].includes(req.headers['authorization'])) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 2, 4, 6].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

module.exports = { verifyAdmin, verifyAdminManager, verifyAdminManagerAccountant, verifyAdminManagerConsultantAccount, verifyAdminManagerVendor, verifyAdminManagerConsultant, verifyAllotor, verifyVendorDriverManagerAdmin, verifyEmployees }