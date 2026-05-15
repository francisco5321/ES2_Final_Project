const AppError = require("../errors/AppError");

module.exports = {
   run: ({ mode, condition }) => {
      if (!mode) {
         throw new AppError("Mode is required.", 400);
      }

      if (mode === "MANUAL" && condition === true) {
         throw new AppError("Cannot run automation in manual mode.", 400);
      }

      if (mode === "AUTOMATIC" && condition === true) {
         return { executed: true };
      }

      return { executed: false };
   }
};