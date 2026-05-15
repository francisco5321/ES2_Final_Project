const measurementService = require("../../src/services/measurementService");

describe("measurementService", () => {

   it("accepts valid measurement", () => {
      const result = measurementService.validate({
         temperature: 25,
         humidity: 60,
         luminosity: 15000
      });

      expect(result.valid).toBe(true);
   });

   it("rejects missing data", () => {
      expect(() =>
         measurementService.validate({
         temperature: 25
         })
      ).toThrow("Missing measurement data.");
   });

});