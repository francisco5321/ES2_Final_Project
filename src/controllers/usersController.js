const userRepository = require("../repositories/userRepository");

async function me(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.sub);
    res.status(200).json({
      user: userRepository.sanitize(user)
    });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const users = await userRepository.list();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  me,
  list
};
