Web-only response schemas live here until the API serves the endpoint. Once it does, the schema moves to `packages/shared` so the API and the web app share one contract.

`validate()` only checks; it returns the original data untouched, so unknown fields survive.
