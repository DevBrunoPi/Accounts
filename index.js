const inquirer = require("inquirer");
const chalk = require("chalk");

const fs = require("fs");
const { json } = require("stream/consumers");

Operacao();

function Operacao() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      switch (action) {
        case "Criar Conta":
          CriarConta();
          break;
        case "Consultar Saldo":
          ConsultarSaldo();
          break;
        case "Depositar":
          Deposito();
          break;
        case "Sacar":
          break;
        case "Sair":
          console.log(chalk.bgWhite.black("Obrigado por usar o Accounts!"));
          process.exit;
          break;
      }
    })
    .catch((err) => console.log(err));
}

// Criar conta
function CriarConta() {
  console.log(chalk.bgGreen.black("Parabens por escolher o Accounts!"));
  console.log(chalk.green("Defina as opções da sua conta: "));
  ConstruirConta();
}

// Construir a Conta
function ConstruirConta() {
  inquirer
    .prompt([
      {
        name: "NomeConta",
        message: "Digite o nome da sua conta",
      },
    ])
    .then((answer) => {
      const NomeConta = answer["NomeConta"];
      console.info(NomeConta);

      if (!fs.existsSync("contas")) {
        fs.mkdirSync("contas");
      }

      if (fs.existsSync(`contas/${NomeConta}.json`)) {
        console.log(chalk.bgRed.black("Esta conta já existe!"));
        ConstruirConta();
        return;
      }

      fs.writeFileSync(`contas/${NomeConta}.json`, '{"Saldo": 0}'),
        function (err) {
          console.log(err);
        };

      console.log(chalk.green("Parabens, sua conta foi criada!"));
      Operacao();
    })
    .catch((err) => console.log(err));
}

//Depositar valor na conta
function Deposito() {
  inquirer
    .prompt([
      {
        name: "NomeConta",
        message: "Qual a sua conta?",
      },
    ])
    .then((answer) => {
      const NomeConta = answer["NomeConta"];
      if (!ContaExiste(NomeConta)) {
        return Deposito();
      }

      inquirer
        .prompt([
          {
            name: "QtdDeposito",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const QtdDeposito = answer["QtdDeposito"];

          AddSaldo(NomeConta, QtdDeposito);
        });
    })
    .catch((err) => console.log(err));
}
// Checar se conta existe
function ContaExiste(NomeConta) {
  if (!fs.existsSync(`contas/${NomeConta}.json`)) {
    console.log(chalk.red("Está conta não existe!"));
    return false;
  }
  return true;
}

// Adicionar Saldo
function AddSaldo(NomeConta, QtdDeposito) {
  const DadosConta = GetConta(NomeConta);
  if (!QtdDeposito) {
    console.log(chalk.red("Digite um Valor!"));
    return Deposito();
  } else {
    DadosConta.Saldo = parseFloat(QtdDeposito) + parseFloat(DadosConta.Saldo);

    fs.writeFileSync(
      `contas/${NomeConta}.json`,
      JSON.stringify(DadosConta),
      function (err) {
        console.log(err);
      }
    );

    console.log(
      chalk.green(`Foi depositado o valor de R$:${QtdDeposito} na sua conta.`)
    );
    return Operacao();
  }
}

function GetConta(NomeConta) {
  const ContaJSON = fs.readFileSync(`contas/${NomeConta}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(ContaJSON);
}

//Mostrar o Saldo da conta

function ConsultarSaldo() {
  inquirer
    .prompt([{ name: "NomeConta", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const NomeConta = answer["NomeConta"];

      if (!ContaExiste(NomeConta)) {
        return ConsultarSaldo();
      }

      const DadosConta = GetConta(NomeConta);

      console.log("Saldo atual: ", chalk.blue(`R$:${DadosConta.Saldo}`));
      Operacao();
    })
    .catch((err) => console.log(err));
}
