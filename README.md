# @iamnnort/request

Request handler for Node.js - Fast - Interactive - Simple

## Installation

```bash
npm install @iamnnort/request
# or
yarn add @iamnnort/request
```

## Usage

```typescript
import { LoggerLevels, RequestDataSource } from '@iamnnort/request';

const dataSource = new RequestDataSource({
  baseUrl: 'https://dummyjson.com',
  url: '/todos',
  logger: {
    name: 'Todo Api',
    level: LoggerLevels.DEBUG,
  },
});

// Search
const todos = await dataSource.search({
  params: {
    page: 1,
  },
});

// Get by id
const todo = await dataSource.get(1);

// Create
const newTodo = await dataSource.create({
  data: {
    todo: 'Test todo',
    completed: false,
    userId: 1,
  },
});

// Update
const updatedTodo = await dataSource.update(1, {
  data: {
    completed: true,
  },
});

// Delete
await dataSource.remove(1);
```

## Logging

Set the `logger` option to enable it.

```typescript
import { LoggerLevels, RequestDataSource } from '@iamnnort/request';

const dataSource = new RequestDataSource({
  baseUrl: 'https://dummyjson.com',
  url: '/todos',
  logger: {
    name: 'Todo Api',
    level: LoggerLevels.DEBUG,
  },
});
```

Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.

Logs include the HTTP method, full URL with query parameters, request body, status code, and duration.

When the log level is `trace` or `debug`, response body data is also included in the output.

```
DEBUG (Todo Api): GET https://dummyjson.com/todos?page=1
INFO (Todo Api): GET https://dummyjson.com/todos?page=1 200 OK (150ms)
```

## Configuration

### Base Config

| Parameter              | Type                     | Description                                                        |
| ---------------------- | ------------------------ | ------------------------------------------------------------------ |
| `baseUrl`              | `string`                 | Main part of the server URL that will be used for the request      |
| `url`                  | `string \| number`       | Server URL that will be used for the request                       |
| `urlParts`             | `(string \| number)[]`   | Additional parts of URL that will be used for the request          |
| `baseUrlName`          | `string`                 | Key to look up the base URL from `baseUrlMap`                      |
| `baseUrlMap`           | `Record<string, string>` | Map of named base URLs                                             |
| `headers`              | `object`                 | Custom headers to be sent                                          |
| `auth`                 | `object`                 | HTTP Basic auth credentials                                        |
| `bearerToken`          | `string`                 | Bearer token for Authorization header                              |
| `apiKey`               | `string`                 | API key sent via `x-api-key` header                                |
| `timeout`              | `number`                 | Request timeout in milliseconds                                    |
| `responseType`         | `string`                 | Response type (e.g. `json`, `text`, `stream`)                      |
| `logger`               | `object`                 | Logger configuration                                               |
| `logger.name`          | `string`                 | Name used as the logger label                                      |
| `logger.level`         | `string`                 | Log level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`)     |
| `serializer`           | `object`                 | Config that allows you to customize serializing                    |
| `serializer.arrayFormat` | `string`               | Array format (`indices`, `brackets`, `repeat`, `comma`)            |

### Request Config

| Parameter    | Type      | Description                                      |
| ------------ | --------- | ------------------------------------------------ |
| `params`     | `object`  | URL parameters to be sent with the request       |
| `data`       | `object`  | Data to be sent as the request body              |
| `urlencoded` | `boolean` | Send data as `application/x-www-form-urlencoded` |
| `multipart`  | `boolean` | Send data as `multipart/form-data`               |
| `xml`        | `boolean` | Send data as `text/xml`                          |

## Methods

| Method       | HTTP Method | Description                                |
| ------------ | ----------- | ------------------------------------------ |
| `search`     | `GET`       | Search for entities                        |
| `searchOne`  | `GET`       | Search for a single entity                 |
| `bulkSearch` | `GET`       | Paginated search returning async generator |
| `get`        | `GET`       | Get entity by id                           |
| `create`     | `POST`      | Create entity                              |
| `bulkCreate` | `POST`      | Create multiple entities                   |
| `update`     | `PUT`       | Update entity by id                        |
| `bulkUpdate` | `PUT`       | Update multiple entities                   |
| `remove`     | `DELETE`    | Remove entity by id                        |
| `common`     | any         | Execute a custom request                   |

## License

MIT © [Nikita Pavets](https://github.com/iamnnort)
