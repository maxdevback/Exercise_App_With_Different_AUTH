import DBLogic from "../../db/logic/index.js";

class DBController {
  async add(req, res) {
    try {
      res.send("loginPage");
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
  async postExes(req, res) {
    try {
      console.log(req.body);
      await DBLogic.addExes(req.user.id, req.body.title, req.body.completed);
      console.log(req.ow);
      return res.redirect("/" + (req.body.filter || ""));
    } catch (err) {
      console.log(err);
      res.render("error", {
        message: err,
      });
    }
  }
  async update(req, res) {
    try {
      await DBLogic.updateExes(
        req.body.title,
        req.body.completed !== undefined ? 1 : null,
        req.user.id,
        req.params.id
      );
      res.redirect("/" + (req.body.filter || ""));
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
  active(req, res, next) {
    res.locals.exer = res.locals.exer.filter((todo) => !todo.completed);
    res.locals.filter = "active";
    res.render("index", { user: req.user });
  }

  completed(req, res) {
    try {
      res.locals.exer = res.locals.exer.filter((todo) => todo.completed);
      res.locals.filter = "completed";
      res.render("index", { user: req.user });
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
  async delete(req, res) {
    try {
      await DBLogic.deleteExes(req.user.id, req.params.id);
      return res.redirect("/" + (req.body.filter || ""));
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
  async clearCompleted(req, res) {
    try {
      await DBLogic.clearCompleted(req.user.id);
      res.redirect("/");
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
}

export default new DBController();
