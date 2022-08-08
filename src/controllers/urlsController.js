import { nanoid } from "nanoid";
import connection from "../dataBase/db.js";

export async function inserirUrl(_, res) {
  const body = res.locals.body;
  const token = res.locals.token;
  const shortUrl = nanoid();

  try {
    //buscar a sessao
    const { rows: usuarioId } = await connection.query(
      `SELECT * FROM sessoes WHERE token = $1`,
      [token]
    );
    await connection.query(
      `INSERT INTO urls("shortUrl",url,"usuarioId") VALUES($1,$2,$3);`,
      [shortUrl, body.url, usuarioId[0].usuarioId]
    );

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function buscaUrlPeloId(req, res) {
  const idUrl = req.params.id;

  try {
    const { rows: buscarUrl } = await connection.query(
      `SELECT urls.id,urls."shortUrl",urls.url FROM urls WHERE id = $1`,
      [idUrl]
    );

    if (buscarUrl.length === 0) {
      return res.status(404).send("Não existe nenhuma url com esse id");
    }
    res.send(buscarUrl);
  } catch (error) {
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
    if (urlRequerida.length === 0) {
      return res.status(404).send("URL não encontrada");
    }

    await connection.query(
      `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1;`,
      [urlRequerida[0].shortUrl]
    );
    res.redirect(302, `/${urlRequerida[0].shortUrl}`);
  } catch (error) {}
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
    res.sendStatus(500);
  }
}

export async function buscaDadosUsuario(req, res) {
  const token = res.locals.token;
  try {
    const { rows: buscarUsuario } = await connection.query(
      `SELECT * FROM sessoes WHERE token = $1`,
      [token]
    );

    if (buscarUsuario.length === 0) {
      return res.status(404).send("Esse usuário não está logado");
    }
    const { rows: dadosUsuario } = await connection.query(
      `SELECT usuarios.id,usuarios.name FROM usuarios WHERE id = $1;`,
      [buscarUsuario[0].usuarioId]
    );
    const { rows: urlsUsuario } = await connection.query(
      `SELECT * FROM urls WHERE "usuarioId" = $1;`,
      [buscarUsuario[0].usuarioId]
    );
    let visitCount = 0;
    urlsUsuario.map((urls) => (visitCount += urls.visitCount));

    const body = {
      id: dadosUsuario[0].id,
      name: dadosUsuario[0].name,
      visitCount,
      shortenedUrls: urlsUsuario.map((urls) => urls),
    };

    res.send(body);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function listarRanking(req, res) {
  try {
    const { rows: rankingUrls } = await connection.query(
      `SELECT usuarios.id,usuarios.name,COUNT( urls."linksCount") AS "linksCount" FROM usuarios JOIN urls ON urls."usuarioId" = usuarios.id GROUP BY usuarios.id,"linksCount";`
    );
    rankingUrls.length = 10;
    res.send(rankingUrls);
  } catch (error) {
    res.sendStatus(500);
  }
}
