<h1 align="center">Book Collection API</h1>
<p align="center">Uma API desenvolvida em NodeJS para colocar em prática conhecimentos adquiridos.</p>
<p align="center">
  <img src="https://img.shields.io/badge/8.0.0-NestJS-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/4.3.5-Typescript-blue" alt="Typescript Version" />
  <img src="https://img.shields.io/badge/15.0-Postgres-informational" alt="Postgres Version" />
  <img src="https://img.shields.io/badge/4.4.0-Prisma-blueviolet" alt="Prisma Version" />
  <img src="https://img.shields.io/badge/28.0.3-Jest-success" alt="Jest Version" />
</p>

## Descrição

Depois de um curso na Rocketseat de NodeJS e outro na Udemy de NestJS, decidi colocar em prática meus conhecimentos nesse pequeno projeto. O usuário pode se registrar, fazer login e gerenciar sua coleção de livros. A API foi feita com esses conceitos em mente:

- 🔒 Autenticação

A autenticação é uma parte **essencial** da maioria dos aplicativos. O JSON Web Token ( JWT ) foi a estratégia utilizada nesse projeto.

- 📚 CRUD dos Livros

CRUD são as quatro operações básicas (criação, consulta, atualização e destruição de dados) utilizadas em bases de dados relacionais. Sua coleção é gerenciada através dessas operações.

- 🎲 Postgres e Prisma

Utilizei o Postgres como banco de dados e o Prisma para facilitar as consultas, criação de tabelas, relacionamentos e migrations.

- 🧪 Testes automátizados

O ponto que eu estava mais ansioso para estudar. Consegui fazer uma cobertura de 100% da aplicação com testes unitários e e2e garantindo assim seu funcionamento e qualidade.

- 📃 Documentação

E por fim utilizei o Swagger para a documentação do projeto. O Nest oferece um módulo bem completo para documentar cada rota direto no código através dos decorators.

## Rodando o projeto
- Primeiro crie um arquivo **.env** na raiz do projeto utilizando o **.env.example** como base.
- Instale as dependências
```powershell
yarn
```
- Se estiver usando o docker, crie um container para o Postgres
```powershell
docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
- Dispare as migrations para criar o banco de dados
```powershell
yarn prisma migrate dev
```
- Inicie a aplicação
```powershell
yarn start:dev
```
- Para visualizar a documentação acesse a seguinte URL:
```
http://localhost:3000/api
```

## Testando
- Todos os testes
```powershell
yarn test
```
- Testes unitários
```powershell
yarn test:unit
```
- Testes e2e
```powershell
yarn test:e2e
```
- Testes com cobertura
```powershell
yarn test:cov
```
## Insomnia
Na raiz do projeto deixei o arquivo **insomnia-collection.json** que pode ser importado no **Insomnia** com as rotas e variáveis de ambiente configuradas.
