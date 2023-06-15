const service = require("../service");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;

const postSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/
  ),
});

const logIn = async (req, res, _) => {
  const { email, password } = req.body;

  const validationResult = postSchema.validate({ email, password });

  if (validationResult.error) {
    res.status(400).json({
      message: "data are invalid!",
      data: validationResult.error.message,
    });
    return;
  }

  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Incorrect email or password",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });

  user.token = token;
  user.save();
};

const create = async (req, res, next) => {
  const { email, password } = req.body;
  const validationResult = postSchema.validate({ email, password });

  if (validationResult.error) {
    res.status(400).json({
      message: "data are invalid!",
      details: validationResult.error.message,
    });
    return;
  }

  const user = await service.getUser(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  try {
    const newUser = new User({ email, password });
    await newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({
      status: "Registration successful",
      code: 201,
      user: { email, subscription: "starter" },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getCurrent = async (req, res, next) => {
  const { email } = req.user;
  console.log(email);

  res.json({
    status: "success",
    code: 200,
    message: "Authorization was successful",
    data: { user: email },
  });
};

module.exports = {
  create,
  getCurrent,
  logIn,
};
