const AppError = require("../errors/AppError");

module.exports = {
   classify: ({ value, min, max }) => {
      if (value < min) {
         return "CRITICAL";
      }

      if (value > max) {
         return "WARNING";
      }

      return "OK";
   }
};