import { Router } from "https://deno.land/x/oak/mod.ts";
import { Document, ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

import { getDb } from "../db/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("todos").find().toArray();
  const transformedTodos: any = todos.map(
    (todo: Document) => {
      return { id: todo._id.toString(), text: todo.text };
    },
  );
  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  const data = await ctx.request.body().value;

  const newTodo: Todo = {
    text: data.text,
  };

  const id = await getDb().collection("todos").insertOne(newTodo);

  newTodo.id = id;

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const data = await ctx.request.body().value;
  const tid = ctx.params.todoId;

  await getDb().collection("todos").updateOne({ _id: new ObjectId(tid) }, {
    $set: { text: data.text },
  });

  ctx.response.body = { message: "Updated todo!" };
});

router.delete("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  await getDb().collection("todos").deleteOne({ _id: new ObjectId(tid) });
  ctx.response.body = { message: "Deleted todo!" };
});

export default router;
