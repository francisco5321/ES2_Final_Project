const auditService = require("../../src/services/auditService");

describe("auditService", () => {

   it("logs a valid action", () => {
      const result = auditService.log({
         user: "admin",
         action: "CREATE_PLAN",
         timestamp: Date.now()
      });

      expect(result.user).toBe("admin");
   });

   it("rejects missing fields", () => {
      expect(() =>
         auditService.log({
         user: "admin"
         })
      ).toThrow("Missing audit fields.");
   });

});