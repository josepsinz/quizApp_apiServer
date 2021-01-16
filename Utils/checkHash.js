const checkHash = (data, encrypted) => {
    return new Promise((resolve, reject) => {
        const bcrypt = require("bcrypt")
        bcrypt.compare(data, encrypted, function (err, same) {
            if (err) {
                reject("error")
            }
            if (same) {
                resolve(same)
            }
            reject(same)
        });
    })
}

module.exports = checkHash