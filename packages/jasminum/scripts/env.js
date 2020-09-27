
try {
    module.exports = require("../credentials.json");
} catch (error) {
    // TravisCI will acquire the encrypted configuration through environment
    // variables.
    module.exports = process.env;
}

