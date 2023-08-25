import fs from "fs";
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = './core/db';

interface Todo {
    id: string,
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    }

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos
    }, null, 2));
    return todo;
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || '{}');

    if (!db.todos) return [];
    return db.todos;
}

function update(id: String, partialTodo: Partial<Todo>) {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos
    }, null, 2));

    return updatedTodo;
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

CLEAR_DB();
console.log(create("Primeira TODO"));
console.log(create("Segunda TODO"));
console.log(read());
const terceitaTODO = create("Terceira TODO");
console.log(read());
console.log(update(terceitaTODO.id, {
    content: "bla bla"
}))
