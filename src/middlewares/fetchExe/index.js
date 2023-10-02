import DBLogic from "../../db/logic/index.js";

export const fetchExes = async (req, res, next) => {
  try {
    const exer = await DBLogic.getExes(req.user.id);
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
