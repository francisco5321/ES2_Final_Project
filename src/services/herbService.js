const AppError = require("../errors/AppError");

function parseCSV(csv) {
   const lines = csv
      .trim()
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

      if (lines.length <= 1) {
      throw new AppError("File is empty.", 400);
   }

   const dataLines = lines.slice(1);

   let valid = 0;
   let invalid = 0;

   for (const line of dataLines) {
      const [name, scientificName] = line.split(",").map(v => v?.trim());

      if (name && scientificName) {
      valid++;
      } else {
      invalid++;
      }
   }

   return {
      valid,
      invalid,
      total: valid + invalid
   };
}

module.exports = {
   import: async (csv) => {
      if (!csv || csv.trim() === "") {
         throw new AppError("File is empty.", 400);
      }

      return parseCSV(csv);
   }
};