import { nanoid } from "nanoid";
import connection from "../dataBase/db.js";

export async function inserirUrl(_, res) {
  const body = res.locals.body;
  const token = res.locals.token;
  const shortUrl = nanoid();

  try {
    await connection.query(
      `INSERT INTO urls("shortUrl",url,"usuarioToken") VALUES($1,$2,$3);`,
      [shortUrl, body.url, token]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function buscaUrlPeloId(req, res) {
  const idUrl = req.params.id;
  console.log(idUrl);
  try {
    const { rows: buscarUrl } = await connection.query(
      `SELECT urls.id,urls."shortUrl",urls.url FROM urls WHERE id = $1`,
      [idUrl]
    );
    console.log(buscarUrl);
    if (buscarUrl.length === 0) {
      return res.status(404).send("Não existe nenhuma url com esse id");
    }
    res.send(buscarUrl);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function redirecionaParaUrl(req, res) {
  const shortUrl = req.params.shortUrl;

  try {
    const { rows: urlRequerida } = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1`,
      [shortUrl]
    );
    console.log(urlRequerida);
    if (urlRequerida.length === 0) {
      return res.status(404).send("URL não encontrada");
    }

    await connection.query(
      `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1;`,
      [urlRequerida[0].shortUrl]
    );
    res.redirect(302, `/${urlRequerida[0].url}`);
  } catch (error) {
    console.log(error);
  }
}

export async function deletaUrlEncurtada(req, res) {
  const token = res.locals.token;
  const idUrl = req.params.id;

  try {
    const { rows: buscarIdUrl } = await connection.query(
      `SELECT * FROM urls WHERE id = $1;`,
      [idUrl]
    );
    if (buscarIdUrl.length === 0) {
      return res.status(404).send("Esse id de url não existe");
    }

    const { rows: buscarUrl } = await connection.query(
      `SELECT * FROM urls WHERE id = $1 AND "usuarioToken" = $2`,
      [idUrl, token]
    );
    if (buscarUrl.length === 0) {
      return res.status(401).send("Esse url não pertence há esse usuário");
    }

    await connection.query(`DELETE FROM urls WHERE id = $1`, [idUrl]);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
