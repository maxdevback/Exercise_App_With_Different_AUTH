class AuthController {
  async signup(req, res) {
    try {
      res.render("signup");
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
  async signupPost(req, res) {
    const hashedPassword = await hashPassword(req.body.password, 10);
    const user = await DBLogic.signup(req.body.username, hashedPassword);

    req.login(user, function (err) {
      res.redirect("/");
    });
  }
  async logout(req, res) {
    try {
      req.logout((err) => {
        if (err) throw err;
      });
      res.redirect("/");
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
}

export default new AuthController();
