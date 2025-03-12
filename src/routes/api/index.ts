import Elysia from "elysia";
import roll from "./roll";

export default () => new Elysia({ prefix: "/api" }).use(roll);
