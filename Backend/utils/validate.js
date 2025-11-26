// utils/validate.js
const ErrorResponse = require("./errorResponse");

const requireFields = (obj, fields) => {
  for (const f of fields) {
    if (!obj[f] && obj[f] !== 0) {
      throw new ErrorResponse(`Field '${f}' is required`, 400);
    }
  }
};

module.exports = { requireFields };
