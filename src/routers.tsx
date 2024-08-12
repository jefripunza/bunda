import { createBrowserRouter } from "react-router-dom";

import WelcomePage from "./pages/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "*",
    element: <div>Page not found!</div>,
  },
]);

export default router;
