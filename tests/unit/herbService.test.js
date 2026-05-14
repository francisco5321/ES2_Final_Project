const herbService = require("../../src/services/herbService");

describe("herbService - import", () => {
   const validCSV = `
   name,scientificName
   Basil,Ocimum basilicum
   Mint,Mentha
   Parsley,Petroselinum crispum
   `;

   const invalidCSV = `
   name,scientificName
   Basil,
   ,Mentha
   ,
   `;

   const mixedCSV = `
   name,scientificName
   Basil,Ocimum basilicum
   InvalidRow,
   Mint,Mentha
   `;

   it("imports valid herbs from CSV", async () => {
      const result = await herbService.import(validCSV);

      expect(result.valid).toBe(3);
      expect(result.invalid).toBe(0);
      expect(result.total).toBe(3);
   });

   it("counts invalid rows correctly", async () => {
      const result = await herbService.import(invalidCSV);

      expect(result.valid).toBe(0);
      expect(result.invalid).toBeGreaterThan(0);
      expect(result.total).toBe(result.invalid);
   });

   it("handles mixed valid and invalid rows", async () => {
      const result = await herbService.import(mixedCSV);

      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(1);
      expect(result.total).toBe(3);
   });

   it("rejects empty file", async () => {
      await expect(herbService.import(""))
         .rejects.toMatchObject({
         statusCode: 400,
         message: "File is empty."
         });
   });

   it("rejects file with only headers", async () => {
      const csv = "name,scientificName";

      await expect(herbService.import(csv))
         .rejects.toMatchObject({
         statusCode: 400
         });
   });

   it("ignores extra whitespace and still processes correctly", async () => {
      const csv = `
      name,scientificName
      Basil  ,  Ocimum basilicum
      Mint , Mentha
      `;

      const result = await herbService.import(csv);

      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(0);
   });
});