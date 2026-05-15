const AppError = require("../errors/AppError");

module.exports = {
   log: ({ user, action, timestamp }) => {
      if (!user || !action || !timestamp) {
         throw new AppError("Missing audit fields.", 400);
      }

      return {
         user,
         action,
         timestamp
      };
   }
};