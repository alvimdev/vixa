```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Endpoints operacionais

- `GET /v1` retorna `{ "ok": true }` e pode ser usado pelo cron que mantém a instância ativa.
- `GET /v1/health` é público e verifica PostgreSQL e Redis. Retorna `200` quando ambos estão disponíveis ou `503` quando a API está degradada. A resposta inclui uptime, uso de memória, runtime, ambiente, versão/deploy quando configurados e a latência de cada dependência, sem expor credenciais ou mensagens internas de erro.

## Logs

Os logs são JSON estruturado em stdout. Configure `LOG_LEVEL` (`debug`, `info`, `warn` ou `error`) e, opcionalmente, `APP_VERSION` e `GIT_COMMIT` para incluí-los no healthcheck. No Render, `RENDER_GIT_COMMIT` é exposto automaticamente quando disponível.

## Testes

```sh
npm test
```
