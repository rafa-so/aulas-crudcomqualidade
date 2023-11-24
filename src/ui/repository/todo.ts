interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("/api/todos").then(async (respostaDoServidor) => {
    const todosString = await respostaDoServidor.text();
    const todosFromServer = JSON.parse(todosString).todos;

    const ALL_TODOS = todosFromServer;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPAges = Math.ceil(ALL_TODOS.length / limit);

    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);

    return {
      todos: paginatedTodos,
      total: ALL_TODOS.length,
      pages: totalPAges,
    };
  });
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}
