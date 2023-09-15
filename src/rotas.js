const express = require("express");
const rotas = express.Router(); 
const controleDeContas = require("./controladores/controleDeContas");
const controleDeTransacoes = require("./controladores/controleDeTransacoes");
const validadores = require('./controladores/validadores');

rotas.get("/contas", controleDeContas.listarContas);
rotas.post("/contas", controleDeContas.criarConta);
rotas.put("/contas/:numeroConta/usuario", controleDeContas.atualizarUsuario);
rotas.delete("/contas/:numeroConta", controleDeContas.excluirConta);

rotas.post("/transacoes/depositar", controleDeTransacoes.depositar);
rotas.post("/transacoes/sacar", controleDeTransacoes.sacar);
rotas.post("/transacoes/transferir", controleDeTransacoes.transferir);

rotas.get("/contas/saldo", controleDeContas.consultarSaldo);
rotas.get("/contas/extrato", controleDeContas.consultarExtrato);

module.exports = rotas; 
