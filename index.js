// Inicializa as dependências

require('dotenv').config(); // Biblioteca "dotenv" carrega variáveis ​​de ambiente de um arquivo .env
const Twitter = require('twitter-lite'); // Biblioteca cliente/servidor para a API do Twitter.
const checkInternetConnected = require('check-internet-connected'); // Biblioteca que verifica se estamos conectados à Internet ou não
const ora = require('ora'); // Cria animações no console (Só funciona no terminal)
const figlet = require('figlet'); // Cria textos com fontes bem legais tipo os vistos aqui: http://patorjk.com/software/taag/
const colors = require('colors');

// Esquema de cores para o console
colors.setTheme({
  info: 'Blue',
  help: 'cyan',
  warn: 'yellow',
  success: 'Green',
  error: 'red'
});

// variáveis
var dataAtual = new Date(); // Data atual
var internetStatus = true; // Status da internet, por padrão vem como funcionando (verdadeiro)
var dataDeQueda; // Data de queda
var oraConsoleLogOnline = false; //
var oraConsoleLogOffline = false; //
var aguardandoRede = ora('Aguardando rede');

// Nome do script que será impresso na tela ao inicializar
console.log(figlet.textSync('CiacOff!', { font: "3D-ASCII" }));

// Construtor do client para o twitter
console.log(`[❕] ${DateTimeFormat(dataAtual)} - Inicializando construtor client twitter`);
const client = new Twitter({
  subdomain: "api", // "api" é o padrão (alteração para outros subdomínios)
  version: "1.1", // Versão da API (mudança para outros subdomínios)
  consumer_key: process.env.CONSUMER_KEY, // Chaves da API
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET,
});

// Construtor da configuração de testes de rede
console.log(`[❕] ${DateTimeFormat(dataAtual)} - Inicializando construtor testes internet`);
const config = {
  timeout: 5000, // tempo para timeout
  retries: 5,// número de tentativas
  domain: 'https://google.com',// domínio para checar DNS resolve
}

// Função que realiza os tweets
console.log(`[❕] ${DateTimeFormat(dataAtual)} - Inicializando funções`);
async function tweet(message) {
  const tweet = await client.post("statuses/update", {
    status: message,
  });
}

// Função que formata a data
function DateTimeFormat(date) {

  if (date === null) {
    date = Date;
  }

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min + ":" + sec;

}

// Finaliza inicialização, e cria um separadorzinho
console.log(`[✅] ${DateTimeFormat(dataAtual)} - Inicializado testes`);
console.log(figlet.textSync('----------', { horizontalLayout: 'default' }));

// Loop para para realizar as funções
setInterval(() => {
  // cria um log no console animado, com um spinner que diz "Testando conexão"
  var statusTest = ora('Testando conexão').start();

  // Testamos o estado da conexão
  checkInternetConnected(config)
    .then((result) => {
      // Atualiza o horário
      dataAtual = new Date;

      // Verifica se o aguardandoRede está girando.
      // Se estiver, quer dizer que a internet havia caído, e estava esperando por reconexão
      if (aguardandoRede.isSpinning) {
        // Ao reconectar, para a animação
        aguardandoRede.stop();
      } // Do contrário, só ignora para evitar erros

      // Previne que seja gerado vários "Onlines" no console
      // Verificamos se o log do online já está no console, através da variável `oraConsoleLogOnline`
      // Caso ainda não tenha sido feito (false), enviamos o evento para o console
      if (oraConsoleLogOnline == false) {
        // a linha a baixo é responsável pos fazer o log do evento online acontecer
        statusTest.succeed(`${DateTimeFormat(dataAtual)} - Online`);
      } else {
        // A instância stop, para o "statusTest" para e limpa a linha do console
        // Assim só temos uma pequena animação gerada ao carregar o "statusTest", com a sua mensagem pré definida de "Testando conexão"
        statusTest.stop();
      }
      // Aqui dizemos que o log de online já foi escrito...
      // Agora, para que o "statusTest" de ONLINE possa ser escrito novamente, a internet terá de cair, para ele receber o status false, e então entrar no if aqui de cima
      // Nota: A animação de teste ainda ocorre enquanto o checkInternetConnected estiver rodando
      oraConsoleLogOnline = true;

      // verificamos o status prévio da internet salvo na variável "internetStatus" com um if statement
      // se for falso, quer dizer que estava-mos sem internet até a execução desse código
      // ou seja, devemos avisar no twitter de que estávamos sem internet e que a conexão voltou, junto ao horário de queda
      if (internetStatus == false) {

        // para isso, usamos um try, junto com a função tweet, declarada lá em cima
        try {
          // Como a conexão retornou, redefinimos as duas variáveis das animações
          // oraConsoleLogOnline, do `statusTest` com a mensagem de ✔ online
          // oraConsoleLogOffline, do `statusTest` com a mensagem de ✖ offline
          oraConsoleLogOnline = false;
          oraConsoleLogOffline = false;
          // log do console
          console.log(`🌎 ${DateTimeFormat(dataAtual)} - Retornou ${result}`.success); // conexão de internet está online
          //faz o tweet
          tweet(`Atualização:\n😔 CiacOFF: ${DateTimeFormat(dataDeQueda)}\n🥰 CiacON: ${DateTimeFormat(dataAtual)}\n\nOs dados aqui apresentados não representam o status da rede como uma totalidade. Caso esteja enfrentando instabilidades, entre em contato com a provedora`)
            .then(internetStatus = true) // Ao acabar de fazer o tweet, alteramos o status da variável "internetStatus" para verdadeiro,           
          // e então joga pro log o evento
          console.log(`🐦 ${DateTimeFormat(dataAtual)} - Post`.help);
        } catch (error) {
          // Caso haja erro, o escrevemos no console
          console.log(colors.red(error.message))
        }
      } // Fim do if  
    })
    .catch((ex) => {
      // Atualiza o horário
      dataAtual = new Date;

      if (oraConsoleLogOffline == false) {
        statusTest.fail(`${DateTimeFormat(dataAtual)} - Offline`);
      } else {
        statusTest.stop();
      }
      oraConsoleLogOffline = true;

      // se a execução cair aqui, quer dizer que obtivemos um erro ao tentar resolver o DNS do domínio declarado lá em cima.
      // Ou seja, estamos sem internet, pois não atingimos o servidor DNS

      // Para criar o log e o evento, sem realizar uma sobrescrição doa valores de data, e horário de queda
      // precisamos verificar se a conexão estava ativa
      if (internetStatus == true) {
        // Sendo assim jogamos o status da rede para o log, avisando de que ela acabou de ficar offline
        console.log(`‼ ${DateTimeFormat(dataAtual)} - ${ex}`.error);
        // Inicia a animação de aguardando rede
        aguardandoRede.start();
        // Atribuímos ao "downDate" a data e hora atual, passando o "dataAtual",
        // que foi previamente atualizado com o horário da última consulta
        dataDeQueda = dataAtual;
        // Também atribuímos o status atual da rede como falso, 
        // para não entrarmos aqui novamente e termos ums sobrescrição de valores nas variáveis
        internetStatus = false;
      }
    });
}, 5000) // intervalo de 5000ms


// Lixinho reciclável:

//try {
//  tweet(`Olá mundo! 🌎`)
//} catch (error) {
//  console.log(error);
//}

//client
//  .get("account/verify_credentials")
//  .then(results => {
//    console.log("results", results);
//  })
//  .catch(console.error);

// Adicionar novamente na função `DateTimeFormat` caso queira retorno de ano, dia e mês
/*
var year = date.getFullYear();
var month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;
var day  = date.getDate();
day = (day < 10 ? "0" : "") + day;
return day + "/" + month + "/" + year + " - " + hour + ":" + min + ":" + sec + " ";
*/