import joi from "joi";

export const validaUrl = joi.object({
    url: joi.string().required()
})