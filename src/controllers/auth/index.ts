import { Request, Response } from "express";

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      res.send("signup");
    } catch (err) {}
  }
  async logout(req: Request, res: Response) {
    res.send("logout");
  }
}

export default new AuthController();
