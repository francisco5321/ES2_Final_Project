# GREENHERB - Sprint 1

Implementacao inicial da API REST da plataforma GREENHERB em Node.js, focada nos objetivos do Sprint 1 do enunciado:

- criacao de endpoints base em Node.js;
- autenticacao com JWT;
- testes unitarios da autenticacao;
- matriz de rastreabilidade inicial.

## Cenarios de teste cobertos na autenticacao

Os testes atualmente implementados cobrem os seguintes cenarios pedidos para o Sprint 1:

- username/email valido e password correta;
- password vazia;
- username/email nao existente;
- username/email com formato ou caracteres invalidos;
- ambos os campos vazios;
- refresh token valido e refresh token em falta;
- acesso a endpoint protegido com bearer token JWT valido;
- acesso a endpoint protegido sem token.

## Endpoints implementados

- `GET /health` - estado da API.
- `POST /auth/register` - regista um utilizador.
- `POST /auth/login` - autentica um utilizador.
- `POST /auth/refresh` - renova tokens JWT.
- `GET /users/me` - devolve o utilizador autenticado.
- `GET /users` - lista utilizadores, apenas para perfil `ADMIN`.

## Perfis suportados

- `TECHNICIAN`
- `MANAGER`
- `ADMIN`

## Como executar

1. Copiar `.env.example` para `.env`.
2. Instalar dependencias com `npm install`.
3. Iniciar a API com `npm run dev`.

## Como testar

- Executar `npm test`.

## Estrutura dos testes

- `tests/unit/authService.test.js` contem os testes unitarios da logica de autenticacao.
- `tests/integration/authRoutes.test.js` contem os testes de integracao dos endpoints de autenticacao e validacao do token JWT.
- `docs/matriz-rastreabilidade-sprint1.md` documenta a correspondencia entre regras de negocio e casos de teste.

## Notas de implementacao

- O repositorio de utilizadores e em memoria para simplificar o arranque do Sprint 1.
- Os refresh tokens sao guardados em memoria e invalidados na rotacao.
- A autenticacao usa `bcryptjs` para hashing de passwords e `jsonwebtoken` para emissao/verificacao de JWT.
