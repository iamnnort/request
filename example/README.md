# Example

Minimal app that uses `@iamnnort/request` from the parent package. The dependency uses `link:..`, so after you rebuild the lib the example picks up changes automatically.

## Usage

```typescript
import { HttpMethods, LoggerLevels, RequestDataSource } from '@iamnnort/request';

const main = async () => {
  class DataSource extends RequestDataSource {
    constructor() {
      super({
        baseUrl: 'https://httpbin.org',
        logger: {
          name: 'Api',
          level: LoggerLevels.INFO,
        },
      });
    }

    get() {
      return this.common({
        method: HttpMethods.GET,
        url: '/status/200',
      });
    }

    getParams() {
      return this.common({
        method: HttpMethods.GET,
        url: '/get',
        params: {
          foo: 'bar',
        },
      });
    }

    postData() {
      return this.common({
        method: HttpMethods.POST,
        url: '/post',
        data: {
          foo: 'bar',
        },
      });
    }
  }

  const dataSource = new DataSource();

  await dataSource.get();
  await dataSource.getParams();
  await dataSource.postData();
};

main();
```

## Run

From the repository root:

```bash
yarn start
```

Or step by step:

```bash
yarn build
cd example
yarn install
yarn start
```
