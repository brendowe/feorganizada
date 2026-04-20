# Fé Organizada

O objetivo é facilitar a organização de membros, eventos, ministérios e outros serviços oferecendo uma base sólida para futuras integrações com o front-end.

## Estrutura do projeto

```text
feorganizada/
├── postman/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── prisma.config.ts
├── public/
│   ├── sql/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
│   └── unit/
│       ├── models/
│       └── services/
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
- JWT (jsonwebtoken)
- Jest
- Cors
- Helmet
- Nodemon
- Sucrase
- Prisma ORM
- Swagger-UI-Express
- Swagger-JSDoc
- Joi (validação)


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

#### Configure as variáveis de ambiente

O back-end precisa de um arquivo .env na pasta raiz com as informações sensíveis.

```env
PORT=3000
SALTROUNDS=12
SECRET_KEY='Sua chave secreta'
DATABASE_URL='mysql://usuario:senha@host:3306/feorganizada'
```

#### Banco de Dados (Prisma)

##### Usar migrations Prisma

```bash
npx prisma migrate dev --name init
```

#### Rode o servidor

`npm run dev` (desenvolvimento com nodemon)
ou
`npm start` (produção)

O servidor estará disponível em `http://localhost:3000/api`

## Documentação da API

### Acesso ao Swagger

1. Abra `http://localhost:3000/api-docs` no navegador
2. Todos os endpoints aparecem com:
   - Descrição detalhada
   - Parâmetros documentados
   - Exemplos pré-preenchidos de payload
   - Respostas esperadas

### Fluxo de Autenticação no Swagger

1. **Faça Login**
   - Abra a rota `POST /{url}/login`
   - Preencha os campos (exemplos pré-preenchidos)
   - Execute a requisição
   - O token é capturado automaticamente

2. **Autorize as Rotas Protegidas**
   - O token é salvo e utilizado automaticamente
   - Nenhuma necessidade de copiar/colar manualmente
   - Todas as rotas com cadeado (🔒) enviam o JWT automaticamente

### Endpoints

Todos os endereços podem ser acessados em `http://localhost:3000/api/endpoint`

#### <mark>Autenticação

| Método | Endpoint      | Descrição                                   | Autenticação |
| ------ | ------------- | ------------------------------------------- | ------------ |
| POST   | `/igrejas`    | Cadastro inicial da igreja e usuário master | Não          |
| POST   | `/:url/login` | Login do usuário vinculado à igreja         | Não          |

##### Exemplo de cadastro de Igreja (POST `/igrejas`)

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
    "email": "carlossilva@gmail.com"
  }
}
```

**Observações:**

- A URL e o EMAIL do master são identificadores únicos
- Se já estiverem cadastrados, você receberá um erro 409 (Conflict)
- Exemplos pré-preenchidos estão disponíveis no Swagger

#### <mark>Administração (Master)

| Método | Endpoint           | Descrição                                    | Autenticação  |
| ------ | ------------------ | -------------------------------------------- | ------------- |
| POST   | `/:url/adm/:id`    | Cadastro de administrador vinculado à igreja | JWT ⚠️ Master |
| PATCH  | `/:url/adm/:login` | Atualizar senha de administrador             | JWT ⚠️ Master |

**Observações:**

- Apenas usuário **master** pode acessar
- Requer token JWT válido no header `Authorization: Bearer <token>`

#### <mark>Ministérios

| Método | Endpoint                          | Descrição                       | Autenticação |
| ------ | --------------------------------- | ------------------------------- | ------------ |
| GET    | `/:url/ministerios`               | Listar ministérios da igreja    | JWT          |
| POST   | `/:url/ministerios`               | Cadastro de ministério          | JWT          |
| GET    | `/:url/ministerios/:ministerioId` | Listar membros de um ministério | JWT          |
| POST   | `/:url/ministerios/:ministerioId` | Vincular membro a um ministério | JWT          |

**Observações:**

- Todos os endpoints exigem **JWT** válido
- Exemplos de payload pré-preenchidos no Swagger

#### <mark>Membros

| Método | Endpoint                     | Descrição                             | Autenticação |
| ------ | ---------------------------- | ------------------------------------- | ------------ |
| GET    | `/:url/membros`              | Listar membros da igreja              | JWT          |
| POST   | `/:url/membros`              | Cadastro de membro                    | JWT          |
| GET    | `/:url/membros/:id`          | Buscar membro por ID                  | JWT          |
| GET    | `/:url/aniversariantes/:mes` | Listar aniversariantes por mês (1-12) | JWT          |
| DELETE | `/:url/membros/:id`          | Deletar membro                        | JWT          |

**Observações:**

- Todos os endpoints exigem **JWT** válido
- Exemplos de payload pré-preenchidos no Swagger

## Postman

Este projeto possui uma coleção do Postman com todos os endpoints da API organizados por domínio

### Importar coleção

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo na pasta postman: `fe-organizada.postman_collection.json`

Todas as rotas possuem modelos para cadastrar igreja, membros ou administrador.

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

## Prisma - Gerenciamento de Banco de Dados

### Gerar/Atualizar Migrations

```bash
npx prisma migrate dev --name nome_da_migracao
```

### Visualizar Dados (Prisma Studio)

```bash
npx prisma studio
```

### Validar Schema

```bash
npx prisma validate
```

### Importante: Mapeamento de Nomes

O schema usa `@@map()` e `@map()` para manter nomes em snake_case:

- Tabelas: `Igreja`, `IgrejaEndereco` → `igreja`, `igreja_endereco`
- Colunas: `igrejaId` → `igreja_id`

Isso garante compatibilidade com bancos de dados legados e padrão de nomenclatura SQL.

## Versões do projeto

### v2.1.0 (atual)

- Integração com Swagger/OpenAPI
- Prisma ORM para migrations
- Refatoração de todo o código
- Deletar um membro agora é feito em cascata
- Removida a dependência constante do connection nos models
- Validação de dados com JOI
- Documentação atualizada

### v2.0.1

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

- Endpoints para eventos e atividades
- Black list para JWT
- Integração com serviços de e-mail
- Imagem no Docker
- Front-end para consumir os dados


## 💡 Observações

- O foco do projeto é demonstrar habilidades em back-end.
- Nunca compartilhe o arquivo .env com suas informações privadas no GitHub.

## Contribuições

Se você tem alguma sugestão ou indicação sinta-se a vontade para comentar ou me enviar uma mensagem. Toda dica é bem-vinda.
