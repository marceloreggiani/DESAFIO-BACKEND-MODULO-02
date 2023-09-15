const bancodedados = require("../bancodedados");

// Verifica se todos os campos foram preenchidos
function verificaTodosCamposPreenchidos(nome, cpf, data_nascimento, telefone, email, senha) {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return { erro: "Todos os campos são obrigatórios!" };
    }
}

module.exports = {
    verificaTodosCamposPreenchidos,
};

