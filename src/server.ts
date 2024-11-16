import { Server } from "http";
import app from "./app";
import config from "./config";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`PH Healthcare app running on port ${config.port}`);
  });
}

main();
