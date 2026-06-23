import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { connectDB } from "./db.js";

describe("connectDB", () => {
  it("throws a clear error when MONGODB_URI is missing", async () => {
    await assert.rejects(
      () =>
        connectDB({
          env: {},
          mongooseClient: { connect: async () => {} },
          taskModel: { init: async () => {} },
        }),
      /MONGODB_URI is required/
    );
  });

  it("throws a clear error when MONGODB_URI does not include a database name", async () => {
    await assert.rejects(
      () =>
        connectDB({
          env: { MONGODB_URI: "mongodb+srv://user:pass@example.mongodb.net" },
          mongooseClient: { connect: async () => {} },
          taskModel: { init: async () => {} },
        }),
      /MONGODB_URI must include a database name/
    );
  });

  it("connects to MongoDB and initializes the Task model", async () => {
    const calls = [];
    const connection = {
      connection: {
        host: "localhost",
        name: "todo-app",
      },
    };

    const result = await connectDB({
      env: { MONGODB_URI: "mongodb://localhost:27017/todo-app" },
      mongooseClient: {
        connect: async (uri) => {
          calls.push(["connect", uri]);
          return connection;
        },
      },
      taskModel: {
        init: async () => {
          calls.push(["init"]);
        },
      },
    });

    assert.equal(result, connection);
    assert.deepEqual(calls, [
      ["connect", "mongodb://localhost:27017/todo-app"],
      ["init"],
    ]);
  });
});
