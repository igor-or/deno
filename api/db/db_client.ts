import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

let db: Database;

export async function connect() {
  const client = new MongoClient();
  // Connect using srv url
  await client.connect(CONN_STRING);

  db = client.database("deno");
}

export function getDb() {
  return db;
}
