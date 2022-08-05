import joi from "joi";

export const validaSignUp = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.ref("password"),
});

export const validaSignIn = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
