const userService = require("./../service/user.service");

const getAllUser = async (req, res) => {
  return res.status(200).json(await userService.getAllUser());
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const userLogin = await userService.login(username, password);

  return res.status(200).json({
    success: userLogin ? true : false,
    data: userLogin ? userLogin : null,
  });
};

module.exports = {
  getAllUser,
  login,
};