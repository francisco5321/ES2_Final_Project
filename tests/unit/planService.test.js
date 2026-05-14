const planService = require("../../src/services/planService");

describe("planService - validation", () => {
   const validPlan = {
      type: "regular",
      temperature: { min: 18, max: 28 },
      humidity: { min: 40, max: 80 },
      luminosity: { min: 5000, max: 25000 },
      duration: 90
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   // Plano válido
   it("accepts a valid regular plan", () => {
      const result = planService.validate(validPlan);

      expect(result).toBeDefined();
   });

   // Tipo inválido
   it("rejects invalid plan type", () => {
      expect(() =>
         planService.validate({ ...validPlan, type: "invalid" })
      ).toThrow("Invalid plan type");
   });

   // Valores limite (temperatura)
   it("validates temperature limits correctly", () => {
      expect(() =>
         planService.validate({
         ...validPlan,
         temperature: { min: 17, max: 28 }
         })
      ).toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         temperature: { min: 18, max: 28 }
         })
      ).not.toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         temperature: { min: 18, max: 29 }
         })
      ).toThrow();
   });

   // Valores limite (humidade)
   it("validates humidity limits correctly", () => {
      expect(() =>
         planService.validate({
         ...validPlan,
         humidity: { min: 39, max: 80 }
         })
      ).toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         humidity: { min: 40, max: 80 }
         })
      ).not.toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         humidity: { min: 40, max: 81 }
         })
      ).toThrow();
   });

   // Valores limite (luminosidade)
   it("validates luminosity limits correctly", () => {
      expect(() =>
         planService.validate({
         ...validPlan,
         luminosity: { min: 4999, max: 25000 }
         })
      ).toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         luminosity: { min: 5000, max: 25000 }
         })
      ).not.toThrow();

      expect(() =>
         planService.validate({
         ...validPlan,
         luminosity: { min: 5000, max: 25001 }
         })
      ).toThrow();
   });

   // Valores limite (duração)
   it("validates duration limits", () => {
      expect(() =>
         planService.validate({ ...validPlan, duration: 0 })
      ).toThrow();

      expect(() =>
         planService.validate({ ...validPlan, duration: 1 })
      ).not.toThrow();

      expect(() =>
         planService.validate({ ...validPlan, duration: 365 })
      ).not.toThrow();

      expect(() =>
         planService.validate({ ...validPlan, duration: 366 })
      ).toThrow();
   });

   // Plano pontual sem autorização
   it("rejects punctual plan without authorization", () => {
      expect(() =>
         planService.validate({
         ...validPlan,
         type: "punctual",
         approvedByManager: false
         })
      ).toThrow("Authorization required");
   });

   // Plano pontual com autorização
   it("accepts punctual plan with authorization", () => {
      const result = planService.validate({
         ...validPlan,
         type: "punctual",
         approvedByManager: true
      });

      expect(result).toBeDefined();
   });

   // Condições múltiplas (tipo + autorização + parâmetros)
   it("validates combined conditions for plan creation", () => {
      expect(() =>
         planService.validate({
         type: "punctual",
         approvedByManager: false,
         temperature: { min: 18, max: 28 }
         })
      ).toThrow();

      expect(() =>
         planService.validate({
         type: "punctual",
         approvedByManager: true,
         temperature: { min: 18, max: 28 }
         })
      ).not.toThrow();
   });

   // Estrutura inválida
   it("rejects missing required fields", () => {
      expect(() =>
         planService.validate({})
      ).toThrow();
   });
});

describe("MC/DC - punctual plan authorization", () => {
   it("T1 - non-punctual plan without authorization should pass", () => {
      expect(() =>
         planService.validate({
         type: "regular",
         approvedByManager: false
         })
      ).not.toThrow();
   });

   it("T2 - punctual plan without authorization should fail", () => {
      expect(() =>
         planService.validate({
         type: "punctual",
         approvedByManager: false
         })
      ).toThrow("Authorization required");
   });

   it("T3 - punctual plan with authorization should pass", () => {
      expect(() =>
         planService.validate({
         type: "punctual",
         approvedByManager: true
         })
      ).not.toThrow();
   });
});