# API Endpoints V1 - Resumo Rápido

## Tabela de Endpoints

| Método | Endpoint | Serviço | Descrição |
|--------|----------|---------|-----------|
| POST | `/auth/register` | Auth | Registrar usuário |
| POST | `/auth/token` | Auth | Login/obter token |
| GET | `/projects` | Projects | Listar projetos |
| POST | `/projects` | Projects | Criar projeto |
| GET | `/projects/{id}` | Projects | Obter projeto por ID |
| PUT | `/projects/{id}` | Projects | Atualizar projeto |
| DELETE | `/projects/{id}` | Projects | Excluir projeto |
| GET | `/devices` | Devices | Listar dispositivos (filtro: project_id) |
| POST | `/devices` | Devices | Criar dispositivo |
| GET | `/devices/{id}` | Devices | Obter dispositivo por ID |
| PUT | `/devices/{id}` | Devices | Atualizar dispositivo |
| DELETE | `/devices/{id}` | Devices | Excluir dispositivo |
| GET | `/devices/{deviceId}/recent-sensor-data` | Devices | Dados recentes dos sensores |
| GET | `/devices/{id}/sensor-data/averages/daily` | Devices | Médias diárias |
| GET | `/devices/{id}/sensor-data/averages/weekly` | Devices | Médias semanais |
| GET | `/devices/{id}/sensor-data/averages/monthly` | Devices | Médias mensais |
| GET | `/devices/{id}/sensor-data/averages/annual` | Devices | Médias anuais |
| POST | `/devices/{id}/report/email` | Devices | Enviar relatório por email |
| POST | `/sensors` | Sensors | Criar sensor |
| GET | `/sensors/` | Sensors | Listar sensores (filtro: device_id) |
| GET | `/sensors/{id}` | Sensors | Obter sensor por ID |
| PUT | `/sensors/{id}` | Sensors | Atualizar sensor |
| DELETE | `/sensors/{id}` | Sensors | Excluir sensor |
| GET | `/devices/{deviceId}/sensor-data/averages/daily` | Sensors | Médias diárias (duplicado) |
| GET | `/devices/{deviceId}/sensor-data/averages/weekly` | Sensors | Médias semanais (duplicado) |
| GET | `/devices/{deviceId}/sensor-data/averages/monthly` | Sensors | Médias mensais (duplicado) |
| GET | `/reports` | Reports | Listar relatórios |
| GET | `/analytics/users/statistics` | Analytics | Estatísticas do usuário |

## Estatísticas

- **Total de endpoints únicos**: 26
- **GET**: 16 endpoints
- **POST**: 6 endpoints  
- **PUT**: 3 endpoints
- **DELETE**: 3 endpoints

## Padrões de URL

### Recursos principais:
- `/auth/*` - Autenticação
- `/projects/*` - Gerenciamento de projetos
- `/devices/*` - Gerenciamento de dispositivos
- `/sensors/*` - Gerenciamento de sensores
- `/reports` - Relatórios
- `/analytics/*` - Analíticas

### Padrões identificados:
- IDs como path parameters: `/{id}`
- Query parameters para filtros: `?project_id=`, `?device_id=`, `?limit=`
- Endpoints aninhados para recursos relacionados: `/devices/{id}/sensor-data/averages/*`
- Endpoints de ação: `/devices/{id}/report/email`