# Matriz de Rastreabilidade - Sprint 1

## Resumo

| Dimensao | Cobertura |
| --- | --- |
| Area funcional | Autenticacao e controlo de acesso |
| Endpoints cobertos | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /users/me` |
| Testes unitarios | 11 |
| Testes de integracao | 5 |
| Testes de sistema implementados | 3 |
| Tecnicas aplicadas | Particionamento de Equivalencia, fluxo nominal, validacao de token JWT, tratamento de erro interno |
| Codigos HTTP documentados | `200`, `201`, `400`, `401`, `409`, `500` |

## Testes Unitarios

| ID | Regra de negocio avaliada | Endpoint / componente | Tecnica | Codigo HTTP esperado | Resultado esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- |
| `TU-01` | `RN-AUTH-01` Registo de utilizador com dados validos | `POST /auth/register` | Particionamento de Equivalencia | `201` | O utilizador e criado com sucesso e sao devolvidos `accessToken` e `refreshToken`. | Nenhuma; repositorio em memoria limpo. |
| `TU-02` | `RN-AUTH-02` Email repetido deve ser rejeitado | `POST /auth/register` | Particionamento de Equivalencia | `409` | A operacao falha com `User already exists.` | Ja existe um utilizador registado com o mesmo email. |
| `TU-03` | `RN-AUTH-03` Perfil tem de pertencer ao enum permitido | `POST /auth/register` | Particionamento de Equivalencia | `400` | A operacao falha quando o perfil nao e `TECHNICIAN`, `MANAGER` ou `ADMIN`. | Nenhuma. |
| `TU-04` | `RN-AUTH-04` Login com credenciais validas | `POST /auth/login` | Particionamento de Equivalencia | `200` | O login devolve o utilizador autenticado e um novo par de tokens. | Utilizador previamente registado. |
| `TU-05` | `RN-AUTH-05` Password vazia deve ser rejeitada no login | `POST /auth/login` | Particionamento de Equivalencia | `400` | A autenticacao falha com `Password is required.` | Utilizador previamente registado. |
| `TU-06` | `RN-AUTH-06` Login com password incorreta | `POST /auth/login` | Particionamento de Equivalencia | `401` | A autenticacao falha com `Invalid credentials.` | Utilizador previamente registado. |
| `TU-07` | `RN-AUTH-07` Login com email nao existente | `POST /auth/login` | Particionamento de Equivalencia | `401` | A autenticacao falha com `Invalid credentials.` | O utilizador indicado nao existe no sistema. |
| `TU-08` | `RN-AUTH-08` Email com formato invalido | `POST /auth/login` | Particionamento de Equivalencia | `400` | A autenticacao falha com `Email is invalid.` | Nenhuma. |
| `TU-09` | `RN-AUTH-09` Ambos os campos vazios no login | `POST /auth/login` | Particionamento de Equivalencia | `400` | A autenticacao falha com `Email and password are required.` | Nenhuma. |
| `TU-10` | `RN-AUTH-10` Renovacao com refresh token valido | `POST /auth/refresh` | Particionamento de Equivalencia | `200` | Sao devolvidos novos tokens e o refresh token anterior deixa de ser reutilizavel. | Utilizador autenticado com refresh token emitido. |
| `TU-11` | `RN-AUTH-11` Renovacao sem refresh token | `POST /auth/refresh` | Particionamento de Equivalencia | `400` | A API responde com `Refresh token is required.` | Nenhuma. |

## Testes de Integracao

| ID | Regra de negocio avaliada | Endpoint(s) exercitado(s) | Tecnica | Codigo HTTP esperado | Resultado esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- |
| `TI-01` | `RN-AUTH-12` Endpoint protegido requer bearer token | `GET /users/me` | Particionamento de Equivalencia | `401` | A API responde com erro de autorizacao se o token estiver ausente. | Aplicacao iniciada. |
| `TI-02` | `RN-AUTH-13` Endpoint protegido aceita token JWT valido | `POST /auth/register` + `GET /users/me` | Fluxo nominal | `200` | A API devolve os dados do utilizador autenticado quando recebe um bearer token JWT valido. | Aplicacao iniciada e utilizador criado no proprio teste. |
| `TI-03` | `RN-AUTH-14` Endpoint protegido rejeita token JWT invalido | `GET /users/me` | Validacao de token JWT | `401` | A API rejeita o acesso quando recebe um bearer token JWT invalido ou expirado. | Aplicacao iniciada. |
| `TI-04` | `RN-AUTH-15` Endpoint protegido devolve os dados do utilizador autenticado apos registo | `POST /auth/register` + `GET /users/me` | Fluxo nominal | `201` e `200` | A API responde com sucesso no registo e na consulta de `/users/me`. | Aplicacao iniciada e utilizador criado no proprio teste. |
| `TI-05` | `RN-AUTH-16` Erro interno inesperado deve ser tratado pela API | `GET /users/me` | Tratamento de erro interno | `500` | A API responde com `Internal server error.` quando ocorre uma falha interna nao tratada. | Aplicacao iniciada, utilizador autenticado e falha interna simulada no repositorio. |

## Testes de Sistema

| ID | Regra de negocio avaliada | Endpoint(s) exercitado(s) | Tecnica | Codigo HTTP esperado | Resultado esperado | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `TS-01` | `RN-AUTH-17` Fluxo completo de autenticacao | `POST /auth/register` + `POST /auth/login` + `GET /users/me` | Fluxo end-to-end | `201`, `200`, `200` | O utilizador e registado, autenticado e consegue consultar o proprio perfil com o token recebido. | Implementado. |
| `TS-02` | `RN-AUTH-18` Fluxo de renovacao de sessao | `POST /auth/register` + `POST /auth/refresh` + `GET /users/me` | Fluxo end-to-end | `201`, `200`, `200` | O utilizador obtem novos tokens atraves do refresh e continua a aceder ao endpoint protegido. | Implementado. |
| `TS-03` | `RN-AUTH-19` Controlo de acesso em fluxo realista | `GET /users/me` | Fluxo end-to-end | `401` | O sistema impede acesso a recurso protegido quando o token esta ausente ou invalido. | Implementado. |

## Observacoes

- A numeracao dos casos de teste segue o padrao pedido no enunciado: `TU` para unidade e `TI` para integracao.
- Nesta iteracao, os testes unitarios focam-se na logica de autenticacao, incluindo os cenarios de email valido e invalido, credenciais validas, campos vazios e utilizador inexistente.
- Os codigos `200`, `400` e `500` ficam agora explicitamente documentados na matriz; adicionalmente, tambem estao documentados `201`, `401` e `409`.
- Os testes de sistema do Sprint 1 foram implementados como fluxos end-to-end separados dos testes de integracao.
- A matriz pode ser convertida facilmente para Word, Excel ou Google Sheets sem perder a estrutura de avaliacao.
