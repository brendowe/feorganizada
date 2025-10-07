# 📖 Fé Organizada

Back-end do projeto para gerenciamento de igrejas.  
O objetivo é facilitar a organização de membros, eventos, ministérios e outros serviços oferecendo uma base sólida para futuras integrações com o front-end.

## 🏗️ Estrutura do projeto

feorganizada/
├── public  
│   ├── sql/              
├── src/  
│   ├── config/              
│   ├── controllers/        
│   ├── models/            
│   ├── routes/           
│   ├── services/            
│   ├── app.js               
│   └── server.js            
├── .env                     
├── .editorconfig            
├── .eslintrc.json          
├── eslint.config.mjs        
├── .prettierrc             
├── package.json             
└── package-lock.json        

## ⚡ Tecnologias usadas

### Back-end
- Node.js
- Express 
- MySQL
- MySQL2
- Bcrypt
- JWT

## 🔑 Configuração de variáveis de ambiente

O back-end precisa de um arquivo .env na pasta raiz com as informações sensíveis.

`PORT=3000`  
`SALTROUNDS=12`  
`SECRET_KEY='Sua chave secreta'`  
`HOST='Seu Host'`  
`USER='Seu usuário'`  
`PASSWORD='Sua senha'`  
`DATABASE='feorganizada'`  

## 🚀 Como rodar o projeto

### Faça uma cópia do projeto
#### Clonar via Git  
`git clone https://github.com/brendowe/feorganizada.git`  
#### Ou baixar o zip  
- Clique em Code
- Download ZIP no GitHub
- Extraia o arquivo em uma pasta na sua máquina
  
### <mark>Back-end</mark>
#### Abra o terminal e navegue até a pasta do projeto:
`cd feorganizada`
#### Instale as dependências
`npm install`
#### Rode o servidor
`npm start`
O servidor estará disponível em `http://localhost:3000/api`

### <mark>Banco de Dados</mark>

#### Você irá precisar do MySQL
`https://www.mysql.com/`
#### Estrutura do banco
Na raiz do projeto dentro da pasta `public/sql` terá um arquivo chamado `feorganizada_structure.sql`  
Importe ele em seu projeto para utilizar a estrutura

### Endpoint
No momento o projeto consta apenas com o endpoint POST de cadastro que pode ser acessado em `http://localhost:3000/api/cadastro`    

O back-end espera um arquivo json dessa maneira

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

## Atualizações futuras

- Pretendo introduzir novos endpoints para login, cadastro de adm, gerenciamento de membros e outros.
- Introduzir Validação de dados com JOI
- Testes unitários com Jest
- Arquivo do Postman com os endpoints
- Um front-end para consumir os dados

Se você tem alguma sugestão sinta-se a vontade para comentar ou me enviar uma mensagem. Toda dica é bem-vinda.

## 💡 Observações

- O foco do projeto é demonstrar habilidades em back-end.
- Nunca compartilhe o arquivo .env com suas informações privadas no GitHub.