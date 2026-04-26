# AEM Dashboard Angular

Angular 14 dashboard application with web and Electron desktop support.

## Live Demo

https://sultansyah.web.id/

## Web Development

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Web Build

```bash
npm run build
```

The production web build uses /api and is intended to be served behind an HTTPS reverse proxy, because if we deploy it to a server with an HTTPS domain, it cannot fetch data from an API hosted on an HTTP domain.

## Electron Development

```bash
npm run electron
```

## Electron Build

```bash
npm run electron:build
```

Electron enables local authentication fallback through PouchDB. The app tries the login API first; when local fallback is enabled and API login is rejected, credentials are validated against the local PouchDB cache.

## Tests

```bash
npm test
```
