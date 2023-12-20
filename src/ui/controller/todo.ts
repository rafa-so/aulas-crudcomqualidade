import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z } from "zod";

interface TodoControllerGetParams {
  page: number;
}

async function get({ page }: TodoControllerGetParams) {
  // Fazer a lógica de pegar os dados
  return todoRepository.get({
    page: page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
) {
  return todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (message?: string) => void;
  onSuccess: (todo: Todo) => void;
}
function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  const parsedParams = z.string().nonempty().safeParse(content);
  if (!parsedParams) {
    onError("Você precisa de um conteúdo!!");
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((todo) => {
      onSuccess(todo);
    })
    .catch(() => {
      onError();
    });

  return;
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
