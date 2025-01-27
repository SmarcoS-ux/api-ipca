import express from 'express';
import cors from 'cors';

const app = express();

import swaggerUi  from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "API de Cálculos IPCA",
            version: "1.0.0",
            description: "API para realização de cálculos e históricos de inflação"
        },
        servers: [
            {
                url: "https://app-ipca.netlify.app",
                description: "Servidor do FrontEnd"
            },
            {
                url: "http://localhost:3000",
                description: "Servidor local de testes"
            }
        ]
    },
    apis: ["./index.js"],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const allowedOrigins = [
    "https://app-ipca.netlify.app",
    "http://192.168.100.230:3000",
    "http://localhost:3000"
];
app.use(cors({
    origin: (origin, callback) => {
        if(origin || allowedOrigins.includes(origin)){
            callback(null, true);
        } else{
            callback(new Error("Acesso Negado."));
        }
    },
    credentials: true
}));

import historicoInflacao from './dados/dados.js';
import { calcularCorrecao, calcularPercentual } from './services/functions.js';

app.get("/", (req, res) => {
    res.send({ "status": "API DE CÁLCULOS DE IPCA" });
});

app.get("/historico", (req, res) => {
    res.json(historicoInflacao);
});
/**
* @swagger
* /historico:
*    get:
*        summary: Retorna o histórico registrado de inflação
*        description: Esta rota é respossável por retornar ao frontend o histórico de ipca
*        responses:
*            200:
*                description: Sucesso
*                content:
*                   application/json:
*                        schema:
*                            type: object
*                            properties:
*                                id:
*                                   type: int
*                                   example: 1
*                                ano:
*                                    type: int
*                                    example: 2023
*                                mes:
*                                    type: int
*                                    example: 12
*                                ipca:
*                                    type: float
*                                    example: 2.56
*/

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
/**
* @swagger
* /calcularCorrecao:
*   get:
*        summary: Retorna o cálculo do IPCA
*        description: Esta rota é responsável por retornar o Cálculo e Percentual do IPCA entre um período informado.
*        parameters:
*            - in: query
*              name: dtInicial
*              required: true
*              description: Data Início do período a ser calculado
*              schema:
*                type: string
*                example: "02/2023"
*            - in: query
*              name: dtFinal
*              required: true,
*              description: "Data Final do período a ser calculado"
*              schema:
*                type: string
*                example: "05/2024"
*            - in: query
*              name: valor
*              required: true
*              description: Valor a ser calculado no período informado
*              schema:
*                type: float
*                example: 112.56  
*        responses:
*            200:
*                description: Sucesso
*                content:
*                    application/json:
*                        schema:
*                            type: object
*                            properties:
*                                valorCorrigido:
*                                    type: float
*                                    example: 150.23
*                                percentualIntervalo:
*                                    type: float
*                                    example: 2.05
*
*/