const AppError = require("../errors/AppError");

module.exports = {
   generate: ({ format, data }) => {
      if (!data || data.length === 0) {
         throw new AppError("No data to export.", 400);
      }

      if (!["CSV", "EXCEL"].includes(format)) {
         throw new AppError("Invalid format.", 400);
      }

      return {
         format,
         exported: true
      };
   }
};