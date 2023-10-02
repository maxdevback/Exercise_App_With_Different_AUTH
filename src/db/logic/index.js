import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { compare as comparePassword } from "bcrypt";

class DBLogic {
  db;
  constructor() {
    this.db = open({
      filename: path.join(path.dirname(process.argv[1]), "db", "exer.db"),
      driver: sqlite3.Database,
    }).then(async (db) => {
      console.log(db);
      await this._init(db.getDatabaseInstance());
      return db;
    });
  }
  async _init(db) {
    db.serialize(async () => {
      await db.run(
        "CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        username TEXT UNIQUE, \
        hashed_password BLOB, \
        salt BLOB, \
        name TEXT, \
        email TEXT UNIQUE, \
        email_verified INTEGER \
      )"
      );

      await db.run(
        "CREATE TABLE IF NOT EXISTS federated_credentials ( \
        id INTEGER PRIMARY KEY, \
        user_id INTEGER NOT NULL, \
        provider TEXT NOT NULL, \
        subject TEXT NOT NULL, \
        UNIQUE (provider, subject) \
      )"
      );

      await db.run(
        "CREATE TABLE IF NOT EXISTS exer ( \
        id INTEGER PRIMARY KEY, \
        owner_id INTEGER NOT NULL, \
        title TEXT NOT NULL, \
        completed INTEGER \
      )"
      );
    });
  }
  async getExes(ownerId) {
    console.log(this.db);
    const res = await (
      await this.db
    ).all("SELECT * FROM exer WHERE owner_id = ?", [ownerId]);
    return res.map((row) => {
      return {
        id: row.id,
        title: row.title,
        completed: row.completed == 1 ? true : false,
        url: "/" + row.id,
      };
    });
    // });
  }
  async getUserByUsername(username) {
    this.db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, row) {
        if (err) {
          throw err;
        }
        if (!row) {
          throw { message: "Incorrect username or password." };
        }
      }
    );
  }
  async addExes(ownerId, title, completed) {
    const res = await (
      await this.db
    ).run(
      "INSERT INTO exer (owner_id, title, completed) VALUES (?, ?, ?)",
      [ownerId, title, completed == true ? 1 : null],
      function (err) {
        if (err) {
          return next(err);
        }
        return res;
      }
    );
  }
  async getFederatedCredentials(provider, subject, displayName) {
    const res = await (
      await this.db
    ).get(
      "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
      [provider, subject]
    );
    console.log(res);
    if (!res) {
      const res2 = await (
        await this.db
      ).run("INSERT INTO users (name) VALUES (?)", [displayName]);
      console.log("EEEEEEEE", res2, provider, subject);
      await (
        await this.db
      ).run(
        "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
        [res2.lastID, provider, subject]
      );
      console.log("Err2");
      return {
        id: res2.lastID,
        name: subject,
      };
    } else {
      return await (
        await this.db
      ).get("SELECT * FROM users WHERE id = ?", [res.user_id]);
    }
  }
  async signup(username, hashedPassword) {
    //const db = await this.db();
    console.log("Here");
    const res = await (
      await this.db
    ).run("INSERT INTO users (username, hashed_password) VALUES (?,?)", [
      username,
      hashedPassword,
    ]);
    console.log(res);
    return { username, id: res.lastID };
    //   const state = await db.run(
    //     "INSERT INTO users (username, hashed_password) VALUES (?,?)",
    //     [username, hashedPassword]
    //   );
    //   console.log(state);
  }
  async updateExes(title, completed, owner_id, exes_id) {
    const res = await (
      await this.db
    ).run(
      "UPDATE exer SET title = ?, completed = ? WHERE id = ? AND owner_id = ?",
      [title, completed, exes_id, owner_id]
    );
    return res;
  }
  async deleteExes(owner_id, exes_id) {
    const res = await (
      await this.db
    ).run("DELETE FROM exer WHERE id = ? AND owner_id = ?", [
      exes_id,
      owner_id,
    ]);
    return res;
  }
  async clearCompleted(owner_id) {
    const res = await (
      await this.db
    ).run("DELETE FROM exer WHERE owner_id = ? AND completed = 1", [owner_id]);
    return res;
  }
  async login(username, password) {
    const res = await (
      await this.db
    ).get("SELECT * FROM users WHERE username = ?", [username]);
    if (!res) throw { message: "Incorrect username or password." };
    if (await comparePassword(password, res.hashed_password)) {
      return res;
    } else {
      throw { message: "Incorrect username or password." };
    }
  }
}

export default new DBLogic();
