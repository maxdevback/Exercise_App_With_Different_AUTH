import { Request, Response, NextFunction } from "express";
import DBLogic from "../../db/logic";

export const fetchExer = (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const exer: any = DBLogic.getExes(req.user.id);
    res.locals.exer = exer;
    res.locals.activeCount = exer.filter((todo) => {
      return !todo.completed;
    }).length;
    res.locals.completedCount = exer.length - res.locals.activeCount;
    next();
  } catch (err) {
    next(err);
  }
};
