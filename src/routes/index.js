import { Router } from "express";
import autenticacao from "./autenticacaoRoutes.js";
import url from "./urlsRoutes.js";

const router = Router();

router.use(autenticacao);
router.use(url);

export default router;
