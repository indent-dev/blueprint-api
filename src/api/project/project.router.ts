import { Router } from "express";
import ProjectController from "./project.controller";

const projectRouter = Router();
const projectController = new ProjectController();
const baseUrl = "/project";

projectRouter.post(`${baseUrl}`, projectController.store);
projectRouter.get(`${baseUrl}`, projectController.show);

export default projectRouter;
