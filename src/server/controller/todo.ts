import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";

async function get(req: NextApiRequest, response: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    response.status(400).json({
      error: {
        message: "`Page` must me a number",
      },
    });
  }

  if (query.limit && isNaN(limit)) {
    response.status(400).json({
      error: {
        message: "`limit` must me a number",
      },
    });
  }

  const output = todoRepository.get({ page, limit });

  response.status(200).json({
    todos: output.todos,
    pages: output.pages,
    total: output.total,
  });
}

export const todoController = {
  get,
};
