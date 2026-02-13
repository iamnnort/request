import { LoggerLevels, RequestDataSource } from '@iamnnort/request';

const main = async () => {
  const dataSource = new RequestDataSource({
    baseUrl: 'https://dummyjson.com',
    url: '/todos',
    logger: {
      name: 'Todo Api',
      level: LoggerLevels.DEBUG,
    },
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
