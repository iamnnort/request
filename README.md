# Info

Request – proxy for promise based HTTP client [https://www.npmjs.com/package/axios](axios).

## Installation

```
yarn install @iamnnort/request
```

## Usage

```
import { request } from '@iamnnort/request';

const req = request({
  baseURL: '...'
})

const data = await req({
  method: 'get',
  url: '...',
  params: {},
})
```
