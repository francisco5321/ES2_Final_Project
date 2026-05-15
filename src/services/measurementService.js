const AppError = require("../errors/AppError");

module.exports = {
   validate: ({ temperature, humidity, luminosity }) => {
      if (temperature === undefined || humidity === undefined || luminosity === undefined) {
         throw new AppError("Missing measurement data.", 400);
      }

      return {
         temperature,
         humidity,
         luminosity,
         valid: true
      };
   }
};