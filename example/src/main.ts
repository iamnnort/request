import { HttpMethods, LoggerLevels, RequestDataSource } from '@iamnnort/request';
import { startServer, stopServer } from './server';

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
          password: 'it-must-be-redacted',
          data: JSON.stringify({ data: 'it-must-be-compressed' }),
        },
      });
    }

    postSignedData() {
      return this.common({
        method: HttpMethods.POST,
        url: '/post',
        data: {
          foo: 'bar',
        },
      });
    }

    getJson() {
      return this.common({
        method: HttpMethods.GET,
        url: '/json',
      });
    }

    getWarning() {
      return this.common({
        method: HttpMethods.GET,
        url: '/status/400',
      });
    }

    getError() {
      return this.common({
        method: HttpMethods.GET,
        url: '/status/500',
      });
    }
  }

  const SECRET_KEY = 'my-secret-key';

  class SignedDataSource extends RequestDataSource {
    constructor() {
      super({
        baseUrl: `http://localhost:3000`,
        logger: {
          name: 'Signed Api',
          level: LoggerLevels.INFO,
        },
        signer: {
          secretKey: SECRET_KEY,
        },
      });
    }

    postData() {
      return this.common({
        method: HttpMethods.POST,
        url: '/webhooks',
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

  await dataSource.getJson();

  try {
    await dataSource.getWarning();
  } catch (error) {
    //
  }

  try {
    await dataSource.getError();
  } catch (error) {
    //
  }

  const server = await startServer(SECRET_KEY);

  const signedDataSource = new SignedDataSource();

  await signedDataSource.postData();

  await stopServer(server);
};

main();
