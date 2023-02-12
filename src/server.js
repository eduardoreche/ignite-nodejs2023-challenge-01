import http from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const SERVER_PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  console.log(method, url);

  const route = routes.find((r) => method === r.method && r.path.test(url));

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(SERVER_PORT);
console.log(`Server is running at port ${SERVER_PORT} 🚀`);
