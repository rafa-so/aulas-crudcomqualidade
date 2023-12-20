import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";

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
  onError: () => void;
  onSuccess: (todo: Todo) => void;
}
function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  if (!content) {
    onError();
    return;
  }

  const todo = {
    id: "123",
    content,
    date: new Date().toISOString(),
    done: false,
  };

  onSuccess(todo);
  return;
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
