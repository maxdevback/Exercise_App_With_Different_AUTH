import "dotenv/config";
import { initPassport } from "./passport.js";
import { InitApp } from "./AppInit.js";
import express from "express";

export const App = express();

initPassport(express);
InitApp(express);
