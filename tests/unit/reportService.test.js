const reportService = require("../../src/services/reportService");

describe("reportService", () => {

   it("generates CSV report", () => {
      const result = reportService.generate({
         format: "CSV",
         data: [{ id: 1 }]
      });

      expect(result.exported).toBe(true);
   });

   it("rejects empty data", () => {
      expect(() =>
         reportService.generate({
         format: "CSV",
         data: []
         })
      ).toThrow("No data to export.");
   });

   it("rejects invalid format", () => {
      expect(() =>
         reportService.generate({
         format: "PDF",
         data: [{ id: 1 }]
         })
      ).toThrow("Invalid format.");
   });

});