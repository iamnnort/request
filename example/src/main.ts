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
          password: 'it-must-be-redacted',
          data: JSON.stringify({ data: 'it-must-be-compressed' }),
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
};

main();
