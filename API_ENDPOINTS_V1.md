# API Endpoints V1 - uaipy.ui

Este documento mapeia todos os endpoints da API v1 utilizados no frontend React da aplicação uaipy.ui.

## Configuração Base

- **Base URL**: Configurada via `VITE_API_URL` (variável de ambiente)
- **Autenticação**: Bearer Token via cabeçalho `Authorization`
- **Content-Type**: `application/json` (padrão), exceto onde especificado

---

## 🔐 **Authentication Service** (`AuthService.ts`)

### POST /auth/register
- **Descrição**: Registrar novo usuário
- **Método**: `POST`
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "email": "string",
    "password": "string", 
    "username": "string"
  }
  ```
- **Resposta**: Dados do usuário registrado

### POST /auth/token
- **Descrição**: Autenticar usuário e obter token de acesso
- **Método**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Payload**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Resposta**:
  ```json
  {
    "access_token": "string",
    "token_type": "string"
  }
  ```

---

## 📊 **Projects Service** (`ProjectsService.ts`)

### GET /projects
- **Descrição**: Listar todos os projetos
- **Método**: `GET`
- **Resposta**: `Project[]`

### POST /projects
- **Descrição**: Criar novo projeto
- **Método**: `POST`
- **Payload**:
  ```json
  {
    "name": "string",
    "description": "string", // opcional
    "user_id": "string"
  }
  ```
- **Resposta**: `Project`

### GET /projects/{id}
- **Descrição**: Obter projeto por ID
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do projeto
- **Resposta**: `Project`

### PUT /projects/{id}
- **Descrição**: Atualizar projeto existente
- **Método**: `PUT`
- **Parâmetros**: `id` (string) - ID do projeto
- **Payload**:
  ```json
  {
    "name": "string",
    "description": "string", // opcional
    "user_id": "string"
  }
  ```
- **Resposta**: `Project`

### DELETE /projects/{id}
- **Descrição**: Excluir projeto
- **Método**: `DELETE`
- **Parâmetros**: `id` (string) - ID do projeto
- **Resposta**: `void`

---

## 🖥️ **Devices Service** (`DevicesService.ts`)

### GET /devices
- **Descrição**: Listar dispositivos por projeto
- **Método**: `GET`
- **Query Parameters**: `project_id` (string) - ID do projeto
- **Resposta**: `Device[]`

### POST /devices
- **Descrição**: Criar novo dispositivo
- **Método**: `POST`
- **Payload**: `Device` (sem id, created_at, updated_at, serial_number)
- **Resposta**: `Device`

### GET /devices/{id}
- **Descrição**: Obter dispositivo por ID
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `Device`

### PUT /devices/{id}
- **Descrição**: Atualizar dispositivo existente
- **Método**: `PUT`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Payload**: `Device` (sem id, created_at, updated_at, serial_number)
- **Resposta**: `Device`

### DELETE /devices/{id}
- **Descrição**: Excluir dispositivo
- **Método**: `DELETE`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `void`

### GET /devices/{deviceId}/recent-sensor-data
- **Descrição**: Obter dados recentes dos sensores do dispositivo
- **Método**: `GET`
- **Parâmetros**: `deviceId` (string) - ID do dispositivo
- **Query Parameters**: `limit` (number, padrão: 10) - Limite de registros
- **Resposta**: `Report[]`

### GET /devices/{id}/sensor-data/averages/daily
- **Descrição**: Obter médias diárias dos sensores do dispositivo
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `SensorAverageType[]`

### GET /devices/{id}/sensor-data/averages/weekly
- **Descrição**: Obter médias semanais dos sensores do dispositivo
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `SensorAverageType[]`

### GET /devices/{id}/sensor-data/averages/monthly
- **Descrição**: Obter médias mensais dos sensores do dispositivo
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `SensorAverageType[]`

### GET /devices/{id}/sensor-data/averages/annual
- **Descrição**: Obter médias anuais dos sensores do dispositivo
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Resposta**: `SensorAverageType[]`

### POST /devices/{id}/report/email
- **Descrição**: Gerar e enviar relatório por email
- **Método**: `POST`
- **Parâmetros**: `id` (string) - ID do dispositivo
- **Query Parameters**: `to_email` (string) - Email de destino
- **Resposta**: `void`

---

## 🔧 **Sensors Service** (`SensorService.ts`)

### POST /sensors
- **Descrição**: Criar novo sensor
- **Método**: `POST`
- **Payload**: `SensorType` (sem id)
- **Resposta**: `SensorType`

### GET /sensors/
- **Descrição**: Listar sensores por dispositivo
- **Método**: `GET`
- **Query Parameters**: `device_id` (string) - ID do dispositivo
- **Resposta**: `SensorType[]`

### GET /sensors/{id}
- **Descrição**: Obter sensor por ID
- **Método**: `GET`
- **Parâmetros**: `id` (string) - ID do sensor
- **Resposta**: `SensorType`

### PUT /sensors/{id}
- **Descrição**: Atualizar sensor existente
- **Método**: `PUT`
- **Parâmetros**: `id` (string) - ID do sensor
- **Payload**: `Partial<SensorType>`
- **Resposta**: `SensorType`

### DELETE /sensors/{id}
- **Descrição**: Excluir sensor
- **Método**: `DELETE`
- **Parâmetros**: `id` (string) - ID do sensor
- **Resposta**: Dados do sensor excluído

### GET /devices/{deviceId}/sensor-data/averages/daily
- **Descrição**: Obter médias diárias dos sensores (via SensorService)
- **Método**: `GET`
- **Parâmetros**: `deviceId` (string) - ID do dispositivo
- **Resposta**: Dados de média diária

### GET /devices/{deviceId}/sensor-data/averages/weekly
- **Descrição**: Obter médias semanais dos sensores (via SensorService)
- **Método**: `GET`
- **Parâmetros**: `deviceId` (string) - ID do dispositivo
- **Resposta**: Dados de média semanal

### GET /devices/{deviceId}/sensor-data/averages/monthly
- **Descrição**: Obter médias mensais dos sensores (via SensorService)
- **Método**: `GET`
- **Parâmetros**: `deviceId` (string) - ID do dispositivo
- **Resposta**: Dados de média mensal

---

## 📈 **Reports Service** (`ReportsService.ts`)

### GET /reports
- **Descrição**: Obter todos os relatórios de dados dos sensores
- **Método**: `GET`
- **Resposta**: `SensorData[]`

---

## 📊 **Analytics Service** (`AnalyticsService.ts`)

### GET /analytics/users/statistics
- **Descrição**: Obter estatísticas do usuário
- **Método**: `GET`
- **Resposta**:
  ```json
  {
    "user_id": "string",
    "username": "string",
    "total_projects": number,
    "total_devices": number,
    "total_sensors": number,
    "total_sensor_data": number,
    "projects": "Project[]"
  }
  ```

---

## 📝 **Resumo dos Endpoints**

### Métodos HTTP utilizados:
- **GET**: 17 endpoints
- **POST**: 6 endpoints  
- **PUT**: 3 endpoints
- **DELETE**: 3 endpoints

### Total de endpoints: **29 endpoints**

### Distribuição por serviço:
- **Authentication**: 2 endpoints
- **Projects**: 5 endpoints
- **Devices**: 10 endpoints
- **Sensors**: 8 endpoints
- **Reports**: 1 endpoint
- **Analytics**: 1 endpoint

### Padrões identificados:
- Uso de path parameters para IDs (`/resource/{id}`)
- Query parameters para filtros (`?project_id=`, `?device_id=`, `?limit=`)
- Seguimento de padrões REST (GET, POST, PUT, DELETE)
- Endpoints de agregação para médias temporais (daily, weekly, monthly, annual)
- Integração com sistema de relatórios por email

---

*Documento gerado automaticamente em: $(date)*