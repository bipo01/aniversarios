import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from "express-session";
import env from "dotenv";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "aniversarios",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

app.get("/", async (req, res) => {
    if (req.session.user) {
        req.session.userDontExist = false;
        req.session.userExist = false;
        req.session.passWrong = false;

        const result = await db.query(
            "SELECT * FROM aniversariantes WHERE user_id = $1 ORDER BY pessoa ASC",
            [req.session.user.id]
        );
        const data = result.rows;
        return res.render("home.ejs", { data });
    }

    return res.redirect("/login");
});

app.get("/login", (req, res) => {
    req.session.userExist = false;
    return res.render("login.ejs", {
        userDontExist: req.session.userDontExist,
        passWrong: req.session.passWrong,
    });
});

app.get("/register", (req, res) => {
    req.session.userDontExist = false;
    req.session.passWrong = false;
    return res.render("register.ejs", { userExist: req.session.userExist });
});

app.post("/login", async (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    const result = await db.query(
        "SELECT * FROM aniverusers WHERE usuario = $1",
        [usuario]
    );
    const data = result.rows[0];

    if (!data) {
        req.session.userDontExist = true;
        return res.redirect("/login");
    }

    if (senha === data.senha) {
        req.session.user = data;
        return res.redirect("/");
    } else {
        req.session.userDontExist = false;
        req.session.passWrong = true;
        return res.redirect("/login");
    }
});

app.post("/register", async (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    const result = await db.query(
        "SELECT * FROM aniverusers WHERE usuario = $1",
        [usuario]
    );
    const data = result.rows[0];

    if (!data) {
        req.session.userExist = false;
        const user = await db.query(
            "INSERT INTO aniverusers (usuario, senha) VALUES($1,$2) RETURNING *",
            [usuario, senha]
        );

        req.session.user = user.rows[0];

        return res.redirect("/");
    }

    req.session.userExist = true;
    return res.redirect("/register");
});

app.post("/add", (req, res) => {
    const pessoa = req.body.pessoa;
    const dataaniver = req.body.dataaniver;

    db.query(
        "INSERT INTO aniversariantes (pessoa, dataaniver, user_id) VALUES($1,$2,$3)",
        [pessoa, dataaniver, req.session.user.id]
    );

    return res.redirect("/");
});

app.post("/delete", (req, res) => {
    const idAtual = req.body.idAtual;
    db.query("DELETE FROM aniversariantes WHERE id = $1", [idAtual]);
    return res.redirect("/");
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.redirect("/");
    });
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
