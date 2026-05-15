const batchService = require("../../src/services/batchService");

describe("batchService", () => {

   it("creates a valid batch", () => {
      const result = batchService.create({
         id: "batch-1",
         planId: "plan-1",
         status: "ACTIVE",
         productivity: 100
      });

      expect(result.id).toBe("batch-1");
      expect(result.status).toBe("ACTIVE");
   });

   it("rejects missing id", () => {
      expect(() =>
         batchService.create({
         planId: "plan-1",
         status: "ACTIVE",
         productivity: 100
         })
      ).toThrow("Batch id is required.");
   });

   it("rejects invalid status", () => {
      expect(() =>
         batchService.create({
         id: "batch-1",
         planId: "plan-1",
         status: "INVALID",
         productivity: 100
         })
      ).toThrow("Invalid batch status.");
   });

   it("rejects negative productivity", () => {
      expect(() =>
         batchService.create({
         id: "batch-1",
         planId: "plan-1",
         status: "ACTIVE",
         productivity: -10
         })
      ).toThrow("Productivity must be positive.");
   });

});