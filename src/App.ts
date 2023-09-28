import express from "express";
import path from "path";

import routes from "./routes";

export const App = express();

App.use(express.static(path.join(__dirname, "public")));
App.use(routes);

App.listen(3000, () => {
  console.log("App has been started at 3000 port");
});
