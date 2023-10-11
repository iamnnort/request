import { methods, request } from "../src";

const runSimple = async () => {
  const req = request({
    baseUrl: "http://127.0.0.1:3001",
  });

  const users = await req({
    method: methods.GET,
    url: "/users",
  });

  console.log(users);
};

runSimple();
