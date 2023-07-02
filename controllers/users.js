const service = require("../service");
const { validateUser } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");

const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendMailMessage = require("../utils/mailing");

require("dotenv").config();

const secret = process.env.SECRET;


const logIn = async (req, res, _) => {
  const { email, password } = req.body;

  const validationResult = validateUser.validate({ email, password });

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
  const validationResult = validateUser.validate({ email, password });

  if (validationResult.error) {
    return res.status(400).json({
      message: "data are invalid!",
      details: validationResult.error.message,
    });
  }

  const avatarURL = gravatar.url(email, { s: "100", r: "g", d: "retro" }, true);
  const verificationToken = nanoid();

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
    const newUser = new User({ email, password, avatarURL, verificationToken });
    await newUser.setPassword(password);

    sendMailMessage(email, verificationToken);

    newUser.save();

    return res.status(201).json({
      status: "Registration successful",
      code: 201,
      user: { email, subscription: "starter", avatarURL, verificationToken },
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

const checkUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await service.getUserWithToken(verificationToken);

  if (user) {
    user.verificationToken = "null";
    user.verify = true;

    await user.save();

    res.json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  }

  return res.json({
    status: "not found",
    code: 404,
    message: "User not found",
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

const updateImageURL = async (req, res, next) => {
  const avatar = req.file;
  const { _id } = req.user;

  const storeImage = path.join(process.cwd(), "public", "avatars");
  const avatarPath = path.join(storeImage, `${avatar.originalname}`);
  const avatarURL = `/avatars/${avatar.originalname}`;

  try {
    const avatarResized = await Jimp.read(avatar.path);
    avatarResized.resize(250, 250);

    await avatarResized.writeAsync(avatarPath);

    await fs.promises.unlink(avatar.path);
  } catch (err) {
    await fs.promises.unlink(avatar.path);
    return next(err);
  }

  try {
    const result = await service.updateAvatar(avatarURL, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "Avatar was updated",
        data: { avatarURL },
      });
    }
  } catch (err) {
    console.log(err.message);

    next(err);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const validationResult = validateUser.validate({ email });

  if (validationResult.error) {
    return res.status(400).json({
      message: "missing required field email",
      details: validationResult.error.message,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user.verificationToken === "null") {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: "Verification has already been passed",
      });
    }

    sendMailMessage(user.email, user.verificationToken);

    return res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports = {
  create,
  getCurrent,
  checkUser,
  logIn,
  logOut,
  updateSub,
  updateImageURL,
  resendVerificationEmail,
};
