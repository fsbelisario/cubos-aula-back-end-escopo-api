# Aula escopo API

---

## Mini Instagram

### O que o usuário pode fazer:
* Login
* Cadastro
* Ver dados do perfil
* Editar dados do perfil
* Ver postagens de outras pessoas
    * Ver quantidade de curtidas de postagens de outras pessoas
* Curtir postagens de outras pessoas
* Ver comentários de postagens de outras pessoas
* Comentar postagens de outras pessoas

### O que não será possível fazer:
* Ver a localização de uma postagem
* Ver pessoas que curtiram uma postagem
* Curtir um comentário
* Comentar em outros comentários

---

## End-points da API

### POST - Login
#### Dados recebidos
* Nome de usuário
* Senha
#### Dados retornados
* Sucesso / Erro
* Token (com id ou nome de usuário)
#### Objetivos gerais
* [X] Validar nome de usuário e senha
* [X] Buscar o usário no BD através do nome de usuário
* [X] Verificar se a senha informada está correta
* [X] Gerar o token de autenticação
* [X] Retornar token ou erro

---

### POST - Cadastro
#### Dados recebidos
* Nome de usuário
* Senha
#### Dados retornados
* Sucesso / Erro
#### Objetivos gerais
* [X] Validar nome de usuário e senha
* [X] Verificar se o nome de usuário já existe no BD
* [X] Criptografar a senha
* [X] Cadastrar o usuário no BD
* [X] Retornar sucesso ou erro

---

### GET - Perfil
#### Dados recebidos
* Token (com id ou nome de usuário)
#### Dados retornados
* URL da foto do usuário
* Nome
* Nome de usuário
* Site
* Bio
* E-mail
* Telefone
* Gênero
#### Objetivos gerais
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Retornar as informações do perfil ou erro

---

### PUT - Perfil
#### Dados recebidos
* Token (com id ou nome de usuário)
* URL da foto do usuário
* Nome
* Nome de usuário
* Site
* Bio
* E-mail
* Telefone
* Gênero
#### Dados retornados
* Sucesso / Erro
#### Objetivos gerais
* [X] Exigir ao menos 1 campo para atualizar
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Criptografar a senha (se for informada)
* [X] Verificar se o e-mail e/ou nome de usuário já existem no BD (se forem informados)
* [X] Atualizar as informações do usuário no BD
* [X] Retornar sucesso ou erro

---

### POST - Postagens
#### Dados recebidos
* Token (com id ou nome de usuário)
* Texto
* Fotos []
#### Dados retornados
* Sucesso / Erro
#### Objetivos gerais
* [X] Exigir ao menos 1 foto
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Cadastrar postagem no BD para o usuário logado
* [X] Cadastrar foto(s) no BD
* [X] Retornar sucesso ou erro

---

### GET - Postagens
#### Dados recebidos
* Token (com id ou nome de usuário)
* Offset
#### Dados retornados
* Postagens []
    * ID
    * Foi curtido pelo usuário?
    * Usuário
        * URL da foto
        * Nome de usuário
        * É perfil oficial?
    * Fotos []
    * Texto
    * Quantidade de curtidas
    * Comentários []
        * Nome de usuário
        * Texto
    * Data da postagem
#### Objetivos gerais
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Retornar postagens de outras pessoas ou erro

---

### POST - Curtir postagem
#### Dados recebidos
* Token (com id ou nome de usuário)
* ID da postagem
#### Dados retornados
* Sucesso / Erro
#### Objetivos gerais
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Buscar o cadastro da postagem pelo ID informado
* [X] Verificar se usuário já curtiu a postagem
* [X] Cadastrar a curtida da postagem no BD
* [X] Retornar sucesso ou erro

---

### POST - Comentar postagem
#### Dados recebidos
* Token (com id ou nome de usuário)
* ID da postagem
* Texto
#### Dados retornados
* Sucesso / Erro
#### Objetivos gerais
* [X] Validar o token
* [X] Buscar o cadastro do usuário com a informação do token
* [X] Buscar o cadastro da postagem pelo ID informado
* [X] Validar o texto de comentário
* [X] Cadastrar o comentário da postagem no BD
* [X] Retornar sucesso ou erro