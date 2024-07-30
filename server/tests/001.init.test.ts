// @ts-ignore
import { test, expect, describe } from "bun:test";
import { mongodb, mongoUnit, StatusCodes, supertest } from "../deps";
import app from "../app";
import { a_user, c_user, sa_user } from "../consts";
import { useMongoDB } from "../database";
import Role from "../../src/models/role.model";

describe("INIT", () => {
  test("clear", () => {});

  test("fake mongodb", async () => {
    await mongoUnit
      .start({
        port: 5544,
      })
      .then(() => {
        const fake_mongo_url = mongoUnit.getUrl();
        console.log("fake mongo is started: ", fake_mongo_url);
        process.env.MONGO_URL_TEST = fake_mongo_url;
        process.env.MONGO_NAME_TEST = "test"; // default
      });

    await useMongoDB(async (db) => {
      const roleCollection = db.collection<Role>("roles");
      await roleCollection.insertMany([
        {
          _id: new mongodb.ObjectId(sa_user.role_id),
          name: "Super Admin",
          is_active: true,
        },
        {
          _id: new mongodb.ObjectId(a_user.role_id),
          name: "Admin",
          is_active: true,
        },
        {
          _id: new mongodb.ObjectId(c_user.role_id),
          name: "Client",
          is_active: true,
        },
      ]);
    });

    expect(true).toEqual(true);
  });

  test("supertest", async () => {
    await supertest(app)
      .get("/api")
      .expect("Content-Type", /json/)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.message).toEqual("Hello World !!!");
      });
  });
});
