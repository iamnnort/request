# Example

Minimal app that uses `@iamnnort/request` from the parent package. The dependency uses `link:..`, so after you rebuild the lib the example picks up changes automatically.

The example demonstrates:

- GET / POST requests via [httpbin.org](https://httpbin.org)
- Structured logging with request/response data redaction
- Client error (4xx) and server error (5xx) handling
- HMAC request signing with a local Express server that validates the signature

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
