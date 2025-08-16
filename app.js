const express = require("express");
const app = express();
const { Todo } = require("./models");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

// Home route
app.get("/", async (request, response) => {
  try {
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();

    if (request.accepts("html")) {
      return response.render("index", { overdue, dueToday, dueLater });
    } else {
      return response.json({ overdue, dueToday, dueLater });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// Add todo
app.post("/todos", async (request, response) => {
  try {
    const { title, dueDate } = request.body;
    if (!title || !dueDate) {
      return response.status(400).json({ error: "Title & dueDate required" });
    }

    const todo = await Todo.create({ title, dueDate, completed: false });

    if (request.accepts("html")) {
      return response.redirect("/"); // redirect to home page
    } else {
      return response.status(200).json(todo);
    }
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

// Mark complete
app.put("/todos/:id/complete", async (req, res) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    if (isNaN(todoId)) return res.status(400).json({ error: "Invalid ID" });

    const updatedTodo = await Todo.markAsComplete(todoId);
    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

    if (req.accepts("html")) {
      return res.redirect("/");
    } else {
      return res.status(200).json(updatedTodo);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete todo
app.delete("/todos/:id", async (request, response) => {
  try {
    const todoId = parseInt(request.params.id, 10);
    if (!todoId) return response.status(400).json(false);

    const deleted = await Todo.destroy({ where: { id: todoId } });

    if (request.accepts("html")) {
      return response.redirect("/");
    } else {
      return deleted ? response.status(200).json(true) : response.status(404).json(false);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json(false);
  }
});

module.exports = app;
