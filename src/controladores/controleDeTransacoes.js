const bancodedados = require("../bancodedados");
const validadores = require('./validadores');

module.exports = {
  depositar(req, res) {

    const { numero_conta, valor } = req.body;

    // Verificar se foram informados o número da conta e o valor do depósito 
    if (!numero_conta || valor === undefined || valor <= 0) {
      res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
      return;
    }

    // Verificar se a conta bancária existe
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }

    // Faz o depósito
    conta.saldo += valor;

    // Registra a transação do depósito
    const data = new Date().toLocaleString();
    const registroDeposito = {
      data,
      numero_conta,
      valor,
    };
    bancodedados.depositos.push(registroDeposito);

    res.status(204).send();
  },

  sacar(req, res) {

    const { numero_conta, valor, senha } = req.body;

    // Verifica se foram informados o número da conta, o valor do saque e a senha 
    if (!numero_conta || valor === undefined || valor <= 0 || !senha) {
      res.status(400).json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" });
      return;
    }

    // Verifica se a conta bancária existe
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }

    // Verifica se a senha está correta
    if (senha !== conta.usuario.senha) {
      res.status(401).json({ mensagem: "Senha incorreta!" });
      return;
    }

    // Verifica se tem saldo disponível para saque
    if (conta.saldo < valor) {
      res.status(400).json({ mensagem: "Saldo insuficiente!" });
      return;
    }

    // Faz o saque
    conta.saldo -= valor;

    // Registra a transação de saque
    const data = new Date().toLocaleString();
    const registroSaque = {
      data,
      numero_conta,
      valor,
    };
    bancodedados.saques.push(registroSaque);

    res.status(204).send();
  },

  transferir(req, res) {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    // Verifica se foram informados os números das contas, o valor da transferência e a senha 
    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || valor <= 0 || !senha) {
      res.status(400).json({ mensagem: "Os números das contas, o valor e a senha são obrigatórios!" });
      return;
    }

    // Verifica se as contas bancárias de origem e destino existem
    const contaOrigem = bancodedados.contas.find((conta) => conta.numero === numero_conta_origem);
    const contaDestino = bancodedados.contas.find((conta) => conta.numero === numero_conta_destino);

    if (!contaOrigem || !contaDestino) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }

    // Verifica se a senha da conta de origem está correta
    if (senha !== contaOrigem.usuario.senha) {
      res.status(401).json({ mensagem: "Senha incorreta!" });
      return;
    }

    // Verifica se tem saldo disponível na conta de origem para a transferência
    if (contaOrigem.saldo < valor) {
      res.status(400).json({ mensagem: "Saldo insuficiente!" });
      return;
    }

    // Faz a transferência
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    // Registra a transação de transferência
    const data = new Date().toLocaleString();
    const registroTransferencia = {
      data,
      numero_conta_origem,
      numero_conta_destino,
      valor,
    };
    bancodedados.transferencias.push(registroTransferencia);

    res.status(204).send();
  },
};
