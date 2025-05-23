import "dotenv/config";
import app from "./app";

app.listen(process.env.PORT, () =>
  console.log(`___ Listening on port ${process.env.PORT}__`)
);
