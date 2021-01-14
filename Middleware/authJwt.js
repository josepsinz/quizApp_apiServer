const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) {
        return res.status(403).send({
            message: "No token provided!"
        })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.user = user
        next()
    })
}

const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;