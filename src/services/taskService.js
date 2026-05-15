const AppError = require("../errors/AppError");

const VALID_TYPES = ["irrigation", "fertilization", "harvest", "monitoring"];

module.exports = {
   execute: ({ batchId, type, executed, date }) => {
      if (!batchId) {
         throw new AppError("Batch is required.", 400);
      }

      if (!VALID_TYPES.includes(type)) {
         throw new AppError("Invalid task type.", 400);
      }

      if (executed) {
         throw new AppError("Task already executed.", 400);
      }

      if (!date) {
         throw new AppError("Execution date is required.", 400);
      }

      return {
         batchId,
         type,
         executed: true,
         date
      };
   }
};