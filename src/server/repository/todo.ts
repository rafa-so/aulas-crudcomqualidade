import { read } from "@db-crud-todo";

interface todoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface todoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

function get({
  page,
  limit,
}: todoRepositoryGetParams = {}): todoRepositoryGetOutput {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const ALL_TODOS = read();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  // eslint-disable-next-line no-console
  console.info("[SERVER > REPOSITORY]: ", {
    currentPage,
    currentLimit,
    startIndex,
    endIndex,
    paginatedTodos,
    totalPages,
    ALL_TODOS,
  });

  return {
    todos: paginatedTodos,
    total: ALL_TODOS.length,
    pages: totalPages,
  };
}

export const todoRepository = {
  get,
};
