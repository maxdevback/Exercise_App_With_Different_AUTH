class PagesController {
  async loginPage(req, res) {
    try {
      res.render("login");
    } catch (err) {}
  }
  async signupPage(req, res) {
    try {
      res.render("signup");
    } catch (err) {
      res.render("error", {
        message: err,
      });
    }
  }
}

export default new PagesController();
