import { Request, Response } from "express";

class DBController {
  async add(req: Request, res: Response) {
    try {
      res.send("loginPage");
    } catch (err) {}
  }
  async delete(req: Request, res: Response) {
    try {
      res.send("signupPage");
    } catch (err) {}
  }
  async update(req: Request, res: Response) {
    try {
      res.send("signupPage");
    } catch (err) {}
  }
  async update2(req: Request, res: Response) {
    try {
    } catch (err) {}
  }
  async setCompleted(req: Request, res: Response) {
    try {
      res.send("signupPage");
    } catch (err) {}
  }
}

export default new DBController();
