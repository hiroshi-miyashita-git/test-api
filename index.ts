"use strict";
import express, { json, Request, Response, NextFunction } from "express";
import helmet                                   from "helmet";
const PORT = process.env.PORT || 3000;
const app = express();
app.set("trust proxy", 1);
app.use(helmet());

async function allRequestHandler(req: Request, res: Response, next: NextFunction){
  try {
    if (req.path === "/" || req.path === "/favicon.ico"){
      res.status(200).send();
      return;
    }
    if (req.method !== "POST"){
      res.status(405).send();
      return;
    }
  } catch (err){
    res.status(500).send(JSON.stringify({"msg":"error"}));
    return;
  }
  next();
};

async function postMethodHandler(req: Request, res: Response){
  try {
    res.status(200).send(JSON.stringify(req.body));
  } catch (err){
    res.status(500).send(JSON.stringify({"msg":"error"}));
  }
  return;
};

app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.charset = 'utf-8';
    res.removeHeader("X-Powered-By");
    res.type("application/json; charset=utf-8");
    res.setHeader("X-Process-Start-Time",process.hrtime.bigint().toString());
    decodeURIComponent(req.path);
  } catch (err){
    return res.redirect(`http://${req.get("Host")}`);
  }
  next();
});

app.use(json());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).send(JSON.stringify({"msg":"error"}));
    return;
  }
  next();
});

app.route("/*")
  .all(allRequestHandler)
  .post(postMethodHandler)
;

// app.listen(PORT, () => {
//    console.log(`Node.js express is started. [Exec env: ${process.env.ENV} Listening port: ${PORT}]`);
// });
export default app;
