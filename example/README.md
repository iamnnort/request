# Example

Minimal app that uses `@iamnnort/request` from the parent package. The dependency uses `link:..`, so after you rebuild the lib the example picks up changes automatically.

## Usage

```typescript
import { RequestDataSource } from '@iamnnort/request';

const main = async () => {
  const dataSource = new RequestDataSource({
    name: 'Todo Api',
    baseUrl: 'https://dummyjson.com',
    url: '/todos',
  });

  await dataSource.search({
    params: {
      page: 1,
    },
  });

  await dataSource.update(1, {
    data: {
      completed: false,
    },
  });
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
