const AppError = require("../errors/AppError");

const VALID_STATUS = ["ACTIVE", "COMPLETED", "FAILED"];

module.exports = {
   create: ({ id, planId, status, productivity }) => {
      if (!id) {
         throw new AppError("Batch id is required.", 400);
      }

      if (!planId) {
         throw new AppError("Plan is required.", 400);
      }

      if (!VALID_STATUS.includes(status)) {
         throw new AppError("Invalid batch status.", 400);
      }

      if (productivity < 0) {
         throw new AppError("Productivity must be positive.", 400);
      }

      return {
         id,
         planId,
         status,
         productivity
      };
   }
};