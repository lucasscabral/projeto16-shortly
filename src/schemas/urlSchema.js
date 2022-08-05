import joi from "joi";

export const validaUrl = joi.object({
  url: joi
    .string()
    .pattern(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/i
    )
    .required(),
});
