## Info

Request handler for Node.js - Fast - Interactive - Simple

## Installation

```bash
yarn add @iamnnort/request
```

## Usage

```javascript
import { RequestDataSource, HttpMethods } from '@iamnnort/request';

const dataSource = new RequestDataSource({
  baseUrl: '...',
  url: '/users'
});

const users = await dataSource.search();

const user = await dataSource.get();
```

## Parameters

| Parameter          | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `baseUrl`          | Main part of the server URL that will be used for the request              |
| `url`              | Server URL that will be used for the request                               |
| `urlParts`         | Additional parts of URL that will be used for the request                  |
| `method`           | Request method to be used when making the request                          |
| `params`           | URL parameters to be sent with the request                                 |
| `data`             | Data to be sent as the request body                                        |
| `headers`          | Custom headers to be sent                                                  |
| `serializer`       | Config that allows you to customize serializing                            |
| `serializer.array` | Array element separator (`"indices"`, `"brackets"`, `"repeat"`, `"comma"`) |
| `logger`           | Enable a logger                                                            |
| `debug`            | Enable a debug mode                                                        |

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
