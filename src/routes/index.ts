import Elysia from "elysia";
import api from "./api";
import { user } from "./api/user";

export const routes = new Elysia().use(api).use(user);

export default routes;
