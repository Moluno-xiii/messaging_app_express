import "dotenv/config";
import httpServer from "./app";

httpServer.listen(process.env.PORT, () =>
  console.log(`___ Listening on port ${process.env.PORT}__`)
);
