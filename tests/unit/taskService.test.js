const taskService = require("../../src/services/taskService");

describe("taskService", () => {

   it("executes a valid task", () => {
      const result = taskService.execute({
         batchId: "batch-1",
         type: "irrigation",
         executed: false,
         date: "2025-01-01"
      });

      expect(result.executed).toBe(true);
   });

   it("rejects invalid type", () => {
      expect(() =>
         taskService.execute({
         batchId: "batch-1",
         type: "invalid",
         executed: false,
         date: "2025-01-01"
         })
      ).toThrow("Invalid task type.");
   });

   it("rejects already executed task", () => {
      expect(() =>
         taskService.execute({
         batchId: "batch-1",
         type: "irrigation",
         executed: true,
         date: "2025-01-01"
         })
      ).toThrow("Task already executed.");
   });

   it("rejects missing date", () => {
      expect(() =>
         taskService.execute({
         batchId: "batch-1",
         type: "irrigation",
         executed: false
         })
      ).toThrow("Execution date is required.");
   });

});