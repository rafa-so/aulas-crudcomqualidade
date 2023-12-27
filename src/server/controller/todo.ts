import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";
import { z } from "zod";
import { NextResponse } from "next/server";

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

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;
  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a string ID",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);
    res.status(200).json({ todo: updatedTodo });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: {
          message: err.message,
        },
      });
    }
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
};
