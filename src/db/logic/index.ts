import { Database } from "sqlite3";
import path from "path";

class DBLogic {
  db: Database;
  constructor() {
    this.db = new Database(path.join(__dirname, "..", "exer.db"), (err) => {
      if (err) throw err;
    });
  }
  async _init() {
    this.db.serialize(() => {
      this.db.run(
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

      this.db.run(
        "CREATE TABLE IF NOT EXISTS federated_credentials ( \
        id INTEGER PRIMARY KEY, \
        user_id INTEGER NOT NULL, \
        provider TEXT NOT NULL, \
        subject TEXT NOT NULL, \
        UNIQUE (provider, subject) \
      )"
      );

      this.db.run(
        "CREATE TABLE IF NOT EXISTS exer ( \
        id INTEGER PRIMARY KEY, \
        owner_id INTEGER NOT NULL, \
        title TEXT NOT NULL, \
        completed INTEGER \
      )"
      );
    });
  }
  async getExes(ownerId: string) {
    this.db.all(
      "SELECT * FROM exer WHERE owner_id = ?",
      [ownerId],
      function (err, rows) {
        if (err) {
          throw err;
        }

        return rows.map((row: any) => {
          return {
            id: row.id,
            title: row.title,
            completed: row.completed == 1 ? true : false,
            url: "/" + row.id,
          };
        });
      }
    );
  }
  async getUserByUsername(username: string) {
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
  async getFederatedCredentials(
    provider: string,
    subject: string,
    displayName: string
  ) {
    this.db.get(
      "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
      [provider, subject],
      (err, row) => {
        if (err) return err;
        if (!row) {
          this.db.run(
            "INSERT INTO users (name) VALUES (?)",
            [displayName],
            (err) => {
              if (err) return err;
              this.db.run(
                "INSERT INTO federated_credentials (provider, subject) VALUES (?, ?, ?)",
                [subject, provider],
                function (err) {
                  if (err) {
                    return err;
                  }
                  const user = {
                    //id: // TODO: stop,
                    name: displayName,
                  };
                  return user;
                }
              );
            }
          );
        } else {
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [row.user_id],
            function (err, row) {
              if (err) {
                return cb(err);
              }
              if (!row) {
                return cb(null, false);
              }
              return cb(null, row);
            }
          );
        }
      }
    );
  }
}

export default new DBLogic();
