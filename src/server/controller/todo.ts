import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";
import { z } from "zod";

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

const TodoCreateBodySchema = z.object({
  content: z.string(),
});
async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a content to create a TODO",
        description: body.error.issues,
      },
    });
    return;
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);
  res.status(201).json({
    todo: createdTodo,
  });
}

export const todoController = {
  get,
  create,
};
