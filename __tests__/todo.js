const request = require("supertest");
const db = require("../models");
const app = require("../app");

let server, agent;

// eslint-disable-next-line no-undef
describe("Todo test suite", () => {
  // eslint-disable-next-line no-undef
  beforeAll(async () => {
    server = app.listen(3000);
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
  });

  // eslint-disable-next-line no-undef
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  // eslint-disable-next-line no-undef
  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
    });

    // eslint-disable-next-line no-undef
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line no-undef
    expect(response.header["content-type"]).toContain(
      "application/json"
    );
    // eslint-disable-next-line no-undef
    expect(response.body.title).toBe("Buy milk");
  });

  // eslint-disable-next-line no-undef
  test("Mark a todo as complete", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Complete me",
      dueDate: new Date().toISOString(),
    });

    const todoID = createResponse.body.id;

    // eslint-disable-next-line no-undef
    expect(createResponse.body.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/complete`)
      .send();

    // eslint-disable-next-line no-undef
    expect(markCompleteResponse.statusCode).toBe(200);
    // eslint-disable-next-line no-undef
    expect(markCompleteResponse.body.completed).toBe(true);
  });

  // eslint-disable-next-line no-undef
  test("Deletes a todo by ID and returns true", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Item to delete",
      dueDate: new Date().toISOString(),
    });

    const todoId = createResponse.body.id;

    const deleteResponse = await agent.delete(`/todos/${todoId}`);

    // eslint-disable-next-line no-undef
    expect(deleteResponse.statusCode).toBe(200);
    // eslint-disable-next-line no-undef
    expect(deleteResponse.body).toBe(true);
  });
});
