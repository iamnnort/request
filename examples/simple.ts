import { methods, request } from "../src";

const runSimple = async () => {
  const req = request({
    debug: true,
    logger: true,
    baseUrl: "http://127.0.0.1:3000",
  });

  const users = await req({
    method: methods.GET,
    url: "/users",
  });

  console.log(users);
};

runSimple();
