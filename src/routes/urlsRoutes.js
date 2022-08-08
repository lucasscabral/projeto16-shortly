import { Router } from "express";
import { validaReqUrl, validaToken } from "../middlewares/urlsMiddlewares.js";
import {
  inserirUrl,
  buscaUrlPeloId,
  redirecionaParaUrl,
  deletaUrlEncurtada,
  buscaDadosUsuario,
  listarRanking,
} from "../controllers/urlsController.js";

const url = Router();

url.post("/urls/shorten", validaReqUrl, inserirUrl);
url.get("/urls/:id", buscaUrlPeloId);
url.get("/urls/open/:shortUrl", redirecionaParaUrl);
url.delete("/urls/:id", validaToken, deletaUrlEncurtada);
url.get("/users/me", validaToken, buscaDadosUsuario);
url.get("/ranking", listarRanking);

export default url;
