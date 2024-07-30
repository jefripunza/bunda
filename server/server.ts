import { figlet } from "./deps";
import { SERVER_PORT } from "./environments";
import app from "./app";

app.listen(SERVER_PORT, () => {
  const banner = figlet.textSync("# OCTOMACTION #");
  console.log(banner);
  console.log(
    `Server is up and running on port http://localhost:${SERVER_PORT}`
  );
});
