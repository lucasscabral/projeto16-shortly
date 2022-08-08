import connection from "../dataBase/db.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export async function signup(_, res) {
  const nome = res.locals.body.name;
  const email = res.locals.body.email;
  const password = res.locals.body.password;

  try {
    const { rows: existeEmail } = await connection.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [email]
    );

    if (existeEmail.length > 0) {
      return res.status(409).send("Esse email já está em uso");
    }
    const passwordCryptografada = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO usuarios(name,email,password) VALUES($1,$2,$3)`,
      [nome, email, passwordCryptografada]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
export async function signin(_, res) {
  const { email, password } = res.locals.body;

  try {
    const { rows: existeEmail } = await connection.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [email]
    );

    if (existeEmail.length === 0) {
      return res.status(401).send("Email ou senha inválidos");
    }
    const comparaSenha = bcrypt.compareSync(password, existeEmail[0].password);

    if (comparaSenha) {
      const token = uuid();
      await connection.query(
        `INSERT INTO sessoes("usuarioId",token) VALUES($1,$2)`,
        [existeEmail[0].id, token]
      );
      const { rows: usuarioLogado } = await connection.query(
        `SELECT usuarios.id,usuarios.name,sessoes.token FROM usuarios JOIN sessoes ON sessoes."usuarioId" = usuarios.id WHERE email = $1;`,
        [existeEmail[0].email]
      );

      res.status(200).send(usuarioLogado[usuarioLogado.length - 1]);
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
