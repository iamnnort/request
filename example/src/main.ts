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
