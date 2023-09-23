## Info

Request handler for Node.js - Fast - Interactive - Simple

## Installation

```bash
yarn install @iamnnort/request
```

## Usage

```javascript
import { request, methods } from "@iamnnort/request";

const req = request({
  baseURL: "...",
});

const data = await req({
  method: methods.GET,
  url: "...",
});
```

## Parameters

| Parameter          | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `serializer`       | Parameter serializer configuration                                         |
| `serializer.array` | Array element separator (`"indices"`, `"brackets"`, `"repeat"`, `"comma"`) |

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
