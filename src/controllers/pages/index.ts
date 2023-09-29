import { Request, Response } from "express";

class PagesController {
  async loginPage(req: Request, res: Response) {
    try {
      res.send("loginPage");
    } catch (err) {}
  }
  async signupPage(req: Request, res: Response) {
    try {
      res.render("signup");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
  async active(req: Request, res: Response) {
    try {
      res.send("signupPage");
    } catch (err) {}
  }
  async completed(req: Request, res: Response) {
    try {
      res.send("signupPage");
    } catch (err) {}
  }
}

export default new PagesController();
