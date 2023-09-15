const bancodedados = require("../bancodedados");
const validadores = require('./validadores');

module.exports = {
  listarContas(req, res) {
    const { senha_banco } = req.query;

    if (senha_banco === bancodedados.banco.senha) {
      res.status(200).json(bancodedados.contas);
    } else {
      res.status(400).json({ mensagem: "A senha do banco informada é inválida!" });
    }
  },

  criarConta(req, res) {
    const {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    } = req.body;

    const erro = validadores.verificaTodosCamposPreenchidos(nome, cpf, data_nascimento, telefone, email, senha);
    if (erro) {
      return res.status(400).json({ mensagem: erro.erro });
    }

    // Valida se já existe uma conta com os mesmos CPF ou e-mail
    const contaExistente = bancodedados.contas.find(
      (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
    );

    if (contaExistente) {
      res.status(400).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
      return;
    }


    const novaConta = {
      numero: (bancodedados.contas.length + 1).toString(),
      saldo: 0,
      usuario: {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
      },
    };

    bancodedados.contas.push(novaConta);

    res.status(201).send();
  },

  atualizarUsuario(req, res) {
    const { numeroConta } = req.params;
    const {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    } = req.body;

    const erro = validadores.verificaTodosCamposPreenchidos(nome, cpf, data_nascimento, telefone, email, senha);
    if (erro) {
      return res.status(400).json({ mensagem: erro.erro });
    }

    // Confirma se o número da conta é válido
    const conta = bancodedados.contas.find((conta) => conta.numero === numeroConta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }

    // Confere se o CPF já existe
    const cpfExistente = bancodedados.contas.find(
      (conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta
    );

    if (cpfExistente) {
      res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
      return;
    }

    conta.usuario = {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    };

    res.status(204).send();
  },

  excluirConta(req, res) {
    const { numeroConta } = req.params;

    // Confirma se o número da conta é válido
    const conta = bancodedados.contas.find((conta) => conta.numero === numeroConta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }

    // Verifica se a conta possui saldo
    if (conta.saldo === 0) {
      bancodedados.contas = bancodedados.contas.filter(
        (conta) => conta.numero !== numeroConta
      );
      res.status(204).send();
    } else {
      res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }
  },

  consultarSaldo(req, res) {
    const { numero_conta, senha } = req.query;

    // Confirma se o número da conta é válido
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }


    // Valida a senha
    if (senha !== conta.usuario.senha) {
      res.status(401).json({ mensagem: "Senha incorreta!" });
      return;
    }

    res.status(200).json({ saldo: conta.saldo });
  },

  consultarExtrato(req, res) {
    const { numero_conta, senha } = req.query;

    // Valida se o número da conta é válido
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
      return;
    }


    // Valida a senha
    if (senha !== conta.usuario.senha) {
      res.status(401).json({ mensagem: "Senha incorreta!" });
      return;
    }

    const extrato = {
      depositos: bancodedados.depositos.filter((deposito) => deposito.numero_conta === numero_conta),
      saques: bancodedados.saques.filter((saque) => saque.numero_conta === numero_conta),
      transferenciasEnviadas: bancodedados.transferencias.filter(
        (transferencia) => transferencia.numero_conta_origem === numero_conta
      ),
      transferenciasRecebidas: bancodedados.transferencias.filter(
        (transferencia) => transferencia.numero_conta_destino === numero_conta
      ),
    };

    res.status(200).json(extrato);
  },
};
