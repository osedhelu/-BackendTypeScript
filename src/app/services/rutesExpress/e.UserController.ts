import { _console } from "../../interfaces";
import { r, Ireq } from "../../_function";

export const ExpressUsers = (app: any): any => {
  app.post("/", (req: Ireq, res: any, next: any): void => {
      _console.error(req.body)
    r._200(res, { ok: true });
  });

  return app;
};
