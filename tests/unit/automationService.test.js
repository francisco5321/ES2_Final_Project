const automationService = require("../../src/services/automationService");

describe("automationService", () => {

   it("executes in automatic mode when condition is true", () => {
      const result = automationService.run({
         mode: "AUTOMATIC",
         condition: true
      });

      expect(result.executed).toBe(true);
   });

   it("does not execute when condition is false", () => {
      const result = automationService.run({
         mode: "AUTOMATIC",
         condition: false
      });

      expect(result.executed).toBe(false);
   });

   it("rejects execution in manual mode with condition true", () => {
      expect(() =>
         automationService.run({
         mode: "MANUAL",
         condition: true
         })
      ).toThrow("Cannot run automation in manual mode.");
   });

});


/* MC/DC */
describe("MC/DC - automation execution", () => {

   it("T1 - MANUAL + false → no execution", () => {
      const result = automationService.run({
         mode: "MANUAL",
         condition: false
      });

      expect(result.executed).toBe(false);
   });

   it("T2 - AUTOMATIC + true → executes", () => {
      const result = automationService.run({
         mode: "AUTOMATIC",
         condition: true
      });

      expect(result.executed).toBe(true);
   });

   it("T3 - AUTOMATIC + false → no execution", () => {
      const result = automationService.run({
         mode: "AUTOMATIC",
         condition: false
      });

      expect(result.executed).toBe(false);
   });

});