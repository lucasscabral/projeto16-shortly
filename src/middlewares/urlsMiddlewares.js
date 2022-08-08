import { validaUrl } from "../schemas/urlSchema.js";

export async function validaReqUrl(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const validouUrl = validaUrl.validate(req.body);
  if (validouUrl.error)
    return res.status(422).send("Informe uma url existente");
  res.locals.body = req.body;
  res.locals.token = token;

  next();
}

export async function validaToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  res.locals.token = token;

  next();
}
