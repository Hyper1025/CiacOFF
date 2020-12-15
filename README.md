## Funções

| Função |Checker|
| ------------- | ------------- |
| Monitorar quedas|✅|
| Reportar quedas no twitter,com horário de queda e retorno|✅|

## Começando

Este projeto requer NodeJS, [baixe a última versão aqui.](https://nodejs.org/en/download/)

-   Crie um aplicativo em  [https://apps.twitter.com/](https://apps.twitter.com/)
-   Pegue a Consumer Key (API Key) e a Consumer Secret (API Secret) do Keys and Access Tokens
-   Certifique-se de definir o nível de acesso correto para seu aplicativo
-   Se você quiser usar a autenticação baseada no usuário, pegue a chave e o segredo do token de acesso também

Guarde as informações:

-   `consumer_key`
-   `consumer_secret`
-   `access_token_key`
-   `access_token_secret`

### Instalando

Clone este projeto
```bash
> git clone https://github.com/Hyper1025/CiacOFF.git
> cd CiacOFF
```

Instale as dependências:
```bash
> npm install 
```
### Configuração

Você deve criar um arquivo na pasta raiz do bot chamado **.env** com no seguinte formato:

```env
CONSUMER_KEY=
CONSUMER_SECRET=
ACCESS_TOKEN=
TOKEN_SECRET=
```
Preencha com as informações de chaves obtidas na hora da criação do bot.

### Uso
Execute o bot

```bash
> npm start
```
---