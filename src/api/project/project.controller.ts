import { Request, Response, NextFunction } from "express";
import ProjectService from "./project.service";
import HttpException from "../../utils/httpException";
const projectService = new ProjectService();

export default class ProjectController {
  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.createProject(req.body);
      res.send(project);
    } catch (error) {
      next(new HttpException(error.statusCode || 500, error.message));
    }
  };
}
