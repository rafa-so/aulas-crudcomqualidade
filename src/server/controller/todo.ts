import { NextApiRequest, NextApiResponse } from "next";

async function get(request: NextApiRequest, response: NextApiResponse) {
  return fetch("/api/todos").then(async (respostaDoServidor) => {
    const todosString = await respostaDoServidor.text();
    const todosFromServer = JSON.parse(todosString).todos;
    return todosFromServer;
  });
}

export const todoController = {
  get,
};