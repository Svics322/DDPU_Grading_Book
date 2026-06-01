import { createAdminUser } from "../server/adminCreateUser.js";

export default async function handler(request, response) {
  const result = await createAdminUser({
    method: request.method,
    headers: request.headers,
    body: request.body,
    env: process.env,
  });

  Object.entries(result.headers || {}).forEach(([name, value]) => {
    response.setHeader(name, value);
  });

  if (result.body === null || result.body === undefined) {
    response.status(result.status).end();
    return;
  }

  response.status(result.status).json(result.body);
}
