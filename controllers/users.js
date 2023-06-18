const service = require("../service");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
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
  const { email, subscription } = req.user;

  res.json({
    status: "success",
    code: 200,
    message: "Authorization was successful",
    data: { user: email, subscription },
  });
};

const logOut = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

const updateSub = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  const subscriptOptions = ["starter", "pro", "business"];

  const subscriptIndex = subscriptOptions.findIndex(
    (el) => el === subscription
  );

  if (subscriptIndex || subscription === req.user.subscription) {
    res.status(400).json({
      status: "error",
      code: 400,
      message:
        "Subscription should have on of value 'starter'/'pro'/'business' or set subscription is already in use",
    });
  }

  try {
    const result = await service.updateSubscription(subscription, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "Subscription was updated",
        data: { email: result.email, subscription: result.subscription },
      });
    }
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports = {
  create,
  getCurrent,
  logIn,
  logOut,
  updateSub,
};
