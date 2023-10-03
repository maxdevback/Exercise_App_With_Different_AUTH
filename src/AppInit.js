import { App } from "./App.js";
import path from "path";
import routes from "./routes/index.js";

export const InitApp = (express) => {
  App.set("views", path.join(path.dirname(process.argv[1]), "views"));
  App.set("view engine", "ejs");
  App.use(express.static(path.join(path.dirname(process.argv[1]), "public")));
  App.use(routes);

  const port = process.env.PORT || 3000;
  App.listen(port, () => {
    console.log(`App has been started at ${port} port`);
  });
};
