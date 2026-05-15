const alertService = require("../../src/services/alertService");

describe("alertService - classification", () => {

   it("returns OK when value is within range", () => {
      const result = alertService.classify({
         value: 50,
         min: 40,
         max: 80
      });

      expect(result).toBe("OK");
   });

   it("returns CRITICAL when below minimum", () => {
      const result = alertService.classify({
         value: 39,
         min: 40,
         max: 80
      });

      expect(result).toBe("CRITICAL");
   });

   it("returns WARNING when above maximum", () => {
      const result = alertService.classify({
         value: 81,
         min: 40,
         max: 80
      });

      expect(result).toBe("WARNING");
   });

   // Valores limite
   it("validates boundary values", () => {
      expect(alertService.classify({ value: 40, min: 40, max: 80 }))
         .toBe("OK");

      expect(alertService.classify({ value: 80, min: 40, max: 80 }))
         .toBe("OK");
   });

});

describe("MC/DC - alert classification", () => {

   it("T1 - inside range → OK", () => {
      expect(alertService.classify({ value: 50, min: 40, max: 80 }))
         .toBe("OK");
   });

   it("T2 - below min → CRITICAL", () => {
      expect(alertService.classify({ value: 39, min: 40, max: 80 }))
         .toBe("CRITICAL");
   });

   it("T3 - above max → WARNING", () => {
      expect(alertService.classify({ value: 81, min: 40, max: 80 }))
         .toBe("WARNING");
   });

});