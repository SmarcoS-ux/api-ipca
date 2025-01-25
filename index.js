import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

import historicoInflacao from './dados/dados.js';
import { calcularCorrecao, calcularPercentual } from './services/functions.js';

app.get("/", (req, res) => {
    res.send({ "status": "Conexão OK" });
});

app.get("/historico", (req, res) => {
    res.json(historicoInflacao);
});

app.get("/calcularCorrecao", (req, res) => {
    const dtInicial = req.query.dtInicial;
    const dtFinal = req.query.dtFinal;
    const valor = req.query.valor.replace(".", "");
    const formatValor = valor.replace(",", ".");

    const valorCorrigido = calcularCorrecao(dtInicial, dtFinal, formatValor, historicoInflacao);
    const percentual = calcularPercentual(dtInicial, dtFinal, formatValor, historicoInflacao).toFixed(2);
    res.status(200).send({ "valorCorrigido": valorCorrigido.toFixed(2), "percentualIntervalo": percentual});
});

app.listen(4000, () => {
    console.log("Servidor rodando: Porta: 4000");
});