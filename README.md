# Fé Organizada

Back-end do projeto para gerenciamento de igrejas.
O objetivo é facilitar a organização de membros, eventos, ministérios e outros serviços oferecendo uma base sólida para futuras integrações com o front-end.

## Estrutura do projeto

```text
feorganizada/
├── postman/
├── public/
│   ├── sql/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── package.json
└── package-lock.json
```

## Tecnologias usadas

### Back-end
- Node.js
- Express
- MySQL
- MySQL2
- Bcrypt
- JWT
- Jest
- Cors
- Helmet
- Nodemon
- Sucrase

## Configuração de variáveis de ambiente

O back-end precisa de um arquivo .env na pasta raiz com as informações sensíveis.

`PORT=3000`
`SALTROUNDS=12`
`SECRET_KEY='Sua chave secreta'`
`HOST='Seu Host'`
`USER='Seu usuário'`
`PASSWORD='Sua senha'`
`DATABASE='feorganizada'`

## Como rodar o projeto

### Faça uma cópia do projeto
#### Clonar via Git
`git clone https://github.com/brendowe/feorganizada.git`
#### Ou baixar o zip
- Clique em Code
- Download ZIP no GitHub
- Extraia o arquivo em uma pasta na sua máquina

### Back-end
#### Abra o terminal e navegue até a pasta do projeto:
`cd feorganizada`
#### Instale as dependências
`npm install`
#### Rode o servidor
`npm start`
O servidor estará disponível em `http://localhost:3000/api`

### Banco de Dados

#### Você irá precisar do MySQL
`https://www.mysql.com/`
#### Estrutura do banco
Na raiz do projeto dentro da pasta `public/sql` terá um arquivo chamado `feorganizada_structure.sql`
Importe ele em seu projeto para utilizar a estrutura

### Endpoints
Todos os endereços podem ser acessados acessado em `http://localhost:3000/api/endpoint`

#### <mark>Autenticação

| Método | Endpoint | Descrição |
|------|---------|-----------|
| POST | `/auth/cadastro` | Cadastro inicial da igreja e usuário master |
| POST | `/auth/:url/login` | Login do usuário vinculado à igreja |


O back-end espera um arquivo json dessa maneira para o cadastro

```json
{
  "nomeIgreja": "Igreja Esperança Viva",
  "url": "esperanca-viva-sp",
  "enderecoIgreja": {
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Jardim das Flores",
    "rua": "Rua das Oliveiras",
    "complemento": "Próximo à praça central"
  },
  "telefoneIgreja": "(11) 91234-5678",
  "nome": "Carlos Silva",
  "nascimento": "1985-07-23",
  "endereco": {
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Vila Nova",
    "rua": "Rua dos Lírios",
    "complemento": "Apartamento 101"
  },
  "telefone": "(11) 99876-5432",
  "master": {
    "login": "carlossilva",
    "senha": "senhaSegura123",
    "email": "carlossilva@email.com"
  }
}
```
#### A URL e o EMAIL do master são os identificadores únicos. Caso já estejam cadastrados você verá algo assim
`"A url esperanca-viva-sp já está em uso"` ou `"O email carlossilva@email.com já está em uso"`
#### Se tudo estiver ok verá essa mensagem
`"Igreja cadastrada com sucesso"`

#### <mark>Administração (Master)

| Método | Endpoint | Descrição |
|------|---------|-----------|
| POST | `/master/adm/:url` | Cadastro de administrador vinculado à igreja |
| PATCH | `/master/:url/adm/:login` | Atualizar senha de administrador |

---


- Endpoints protegidos por **JWT**
- Apenas o usuário **master** têm permissão de acesso

#### <mark>Ministérios

| Método | Endpoint | Descrição |
|------|---------|-----------|
| POST | `/:url/ministerios` | Cadastro de ministério |
| GET | `/:url/ministerios` | Listar ministérios da igreja |
| POST | `/:url/ministerios/:ministerioId` | Vincular membro a um ministério |
| GET | `/:url/ministerios/:ministerioId` | Listar membros de um ministério |

---

- Todos os endpoints exigem **JWT**

#### <mark>Membros

| Método | Endpoint | Descrição |
|------|---------|-----------|
| POST | `/:url/membros` | Cadastro de membro |
| GET | `/:url/membros` | Listar membros da igreja |
| GET | `/:url/membros/:id` | Buscar membro por ID |
| GET | `/:url/aniversariantes/:mes` | Listar aniversariantes por mês |

---

- Todos os endpoints exigem **JWT**

## Postman

Este projeto possui uma coleção do Postman com todos os endpoints da API organizados por domínio

### Importar coleção
1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo na pasta postman: `fe-organizada.postman_collection.json`

Todas as rotas possuem modelos para cadastrar igreja, membros ou adm.

## Testes unitários

Os testes foram realizados com a ferramenta Jest.

Para testar basta abrir o terminal do vscode e digitar os seguintes comandos

### Para rodar todos os testes

`npm test`

### Para verificar a cobertura de testes

`npm run test:coverage`

### Para rodar um testes específico

`npm test admModel.test.js`

Basta substituir o admModel.test.js pelo arquivo que deseja rodar

## Versões do projeto

### v2.0.1 (atual)

- Adição de coleção do Postman

### v2.0.0
- Implementação de autenticação com JWT
- Adição de endpoints de autenticação, administração, ministérios e membros
- Refatoração da arquitetura (services/controllers)
- Melhor organização das rotas
- Melhorias de segurança
- Implementação de testes unitários
- Implementação de Helmet e CORS

### v1.0.0
- Endpoint inicial de cadastro de igreja
- Estrutura inicial do banco de dados



## Atualizações futuras

- Introduzir Validação de dados com JOI
- Novos testes unitários
- Um front-end para consumir os dados

Se você tem alguma sugestão sinta-se a vontade para comentar ou me enviar uma mensagem. Toda dica é bem-vinda.

## 💡 Observações

- O foco do projeto é demonstrar habilidades em back-end.
- Nunca compartilhe o arquivo .env com suas informações privadas no GitHub.
