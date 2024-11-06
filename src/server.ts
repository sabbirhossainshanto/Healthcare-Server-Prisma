import { Server } from "http";
import app from "./app";
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`PH Healthcare app running on port ${port}`);
  });
}

main();
