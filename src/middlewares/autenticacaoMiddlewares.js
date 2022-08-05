import { validaSignIn, validaSignUp } from "../schemas/autenticacaoSchema.js";

export async function validaBodySignUp(req, res, next) {
  const body = req.body;
  const validou = validaSignUp.validate(body);
  if (validou.error) {
    return res
      .status(422)
      .send(
        "Todos os campos são obrigatórios e os campos senhas devem ser iguais"
      );
  }
  delete body.confirmPassword;
  res.locals.body = body;
  next();
}
export async function validaBodySignIn(req, res, next) {
  const body = req.body;
  const validou = validaSignIn.validate(body);
  if (validou.error) {
    console.log(validou.error);
    return res.status(422).send("Todos os campos são obrigatórios");
  }
  res.locals.body = body;
  next();
}
