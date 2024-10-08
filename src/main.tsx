import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import PWABadge from "./PWABadge.tsx";

import routers from "./routers.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={routers} />
    <PWABadge />
  </>
);
