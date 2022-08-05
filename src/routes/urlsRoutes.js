import { Router } from "express";
import {
  validaReqUrl,
  validaIdDelete,
} from "../middlewares/urlsMiddlewares.js";
import {
  inserirUrl,
  buscaUrlPeloId,
  redirecionaParaUrl,
  deletaUrlEncurtada,
} from "../controllers/urlsController.js";

const url = Router();

url.post("/urls/shorten", validaReqUrl, inserirUrl);
url.get("/urls/:id", buscaUrlPeloId);
url.get("/urls/open/:shortUrl", redirecionaParaUrl);
url.delete("/urls/:id", validaIdDelete, deletaUrlEncurtada);
// url.get();
// url.get();

export default url;
