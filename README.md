# 🛠️ HelpDesk Backend

API RESTful desenvolvida para gerenciamento de chamados de suporte técnico (Helpdesk), com controle de acessos por perfil de usuário e autenticação segura via JWT.

---

## 📌 Sumário

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura e Segurança](#-arquitetura-e-segurança)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
  - [Opção 1: Com Docker (Recomendado)](#opção-1-com-docker-recomendado)
  - [Opção 2: Localmente (XAMPP / MySQL Workbench)](#opção-2-localmente-xampp--mysql-workbench)
- [Autores](#️-autores)

---

## 🚀 Tecnologias Utilizadas

- **Linguagem:** Java (v21)
- **Framework:** Spring Boot
- **Módulos Spring:**
  - Spring Data JPA (Persistência)
  - Spring Security (Autenticação e Autorização)
  - Spring Web (Criação de APIs REST)
- **Banco de Dados:** MySQL
- **Autenticação:** JSON Web Token (JWT)
- **Conteinerização:** Docker & Docker Compose
- **Gerenciador de Dependências:** Maven

---

## ⚡ Funcionalidades

- **Autenticação & Autorização:**
  - Login e geração de tokens JWT.
  - Diferenciação de permissões por perfis (*Roles*): **Cliente**, **Técnico** e **Admin**.
- **Gestão de Usuários:**
  - Cadastro, atualização e listagem de usuários e técnicos.
- **Gestão de Chamados:**
  - Abertura de chamados/tickets.
  - Atribuição de chamados a técnicos responsáveis.
  - Atualização de status (ex: *Aberto*, *Em Andamento*, *Encerrado*).
  - Definição de níveis de prioridade (ex: *Baixa*, *Média*, *Alta*).

---

## 🔐 Arquitetura e Segurança

A aplicação utiliza o **Spring Security** em conjunto com **JWT** para garantir que apenas requisições autenticadas e autorizadas acessem os endpoints protegidos:
1. O usuário realiza o login via `/login` informando credenciais válidas.
2. A API retorna um token JWT.
3. Para acessar as demais rotas protegidas, o token deve ser informado no cabeçalho (*Header*) da requisição:
   `Authorization: Bearer <seu_token_jwt>`

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [JDK 21+](https://www.oracle.com/java/technologies/downloads/)
- [Git](https://git-scm.com/)
- **Opção A (Docker):** [Docker Desktop](https://www.docker.com/)
- **Opção B (Manual):** [XAMPP](https://www.apachefriends.org/) ou [MySQL Workbench](https://www.mysql.com/products/workbench/)

---

## 🔧 Como Rodar o Projeto

Clone o repositório em sua máquina:

```bash
git clone https://github.com/BrunnoRosa/HELPDESK-BACKEND.git
cd HELPDESK-BACKEND

Opção 1: Com Docker (Recomendado)
Caso utilize o Docker, suba os containers da aplicação e do banco de dados MySQL rodando:

```bash
docker-compose up -d

Opção 2: Localmente (XAMPP / MySQL Workbench)
  1. Inicie o banco de dados:

    - Se estiver usando XAMPP: Abra o XAMPP Control Panel e inicie o módulo MySQL.

    - Se estiver usando MySQL Workbench / serviço local: Certifique-se de que o              serviço do MySQL está rodando na porta 3306.

  2. Crie o Banco de Dados:

      - Crie um schema/database no MySQL com o nome definido no seu arquivo                    application.properties (ex: helpdesk).

Execute a aplicação via Maven:

```bash
./mvnw spring-boot:run

✒️ Autores
Desenvolvido por Brunno Rosa e Geovane Ferreira.
