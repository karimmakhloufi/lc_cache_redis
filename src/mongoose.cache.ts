// @ts-nocheck
import { createClient } from "redis";
import mongoose from "mongoose";

export default async function applyMongooseCache() {
  await mongoose.connect("mongodb://mongo:27017/books", {
    user: "root",
    pass: "root",
    authSource: "admin",
  });

  const client = createClient({
    url: "redis://redis:6379",
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  const exec = mongoose.Query.prototype.exec;

  mongoose.Query.prototype.exec = async function () {
    console.log("query exec");
    const key = JSON.stringify({
      ...this.getQuery(),
      collection: this.mongooseCollection.name,
      op: this.op,
      options: this.options,
    });

    let cacheValue;

    try {
      cacheValue = await client.get(key);
    } catch (err) {
      console.log("error fetching redis key");
    }

    if (cacheValue) {
      console.log("from cache");
      return JSON.parse(cacheValue);
    } else {
      console.log("db query");
    }

    const result = await exec.apply(this, arguments);

    if (result) {
      await client.set(key, JSON.stringify(result));
    }
    return result;
  };
}
