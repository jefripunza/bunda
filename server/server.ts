import { figlet } from "./deps";
import { SERVER_PORT } from "./environments";
import app from "./app";

app.listen(SERVER_PORT, () => {
  const banner = figlet.textSync("##### OCTOMACTION", {
    font: "3D-ASCII",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 120,
    whitespaceBreak: true,
  });
  console.log(banner);
  console.log(
    `Server is up and running on port http://localhost:${SERVER_PORT}`
  );
});
