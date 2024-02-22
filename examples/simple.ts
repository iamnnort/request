import { RequestDataSource } from '../src';

const runSimple = async () => {
  const dataSource = new RequestDataSource({
    debug: true,
    logger: true,
    baseUrl: 'http://127.0.0.1:3000',
    url: '/users',
  });

  const users = await dataSource.search();

  console.log(users);
};

runSimple();
