import { Router } from "express";
import { signin, signup } from "../controllers/autenticacaoController.js";
import {
  validaBodySignIn,
  validaBodySignUp,
} from "../middlewares/autenticacaoMiddlewares.js";

const autenticacao = Router();

autenticacao.post("/signup", validaBodySignUp, signup);
autenticacao.post("/signin", validaBodySignIn, signin);

export default autenticacao;
