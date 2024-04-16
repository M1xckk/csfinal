import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      audience="https://productsapp.kinde.com/api"
      clientId="c080d5a8b072492d9581141873432bfa"
      domain="https://productsapp.kinde.com"
      // redirectUri="http://localhost:5173"
      // logoutUri="http://localhost:5173"

      redirectUri="https://dsqrke7095d1g.cloudfront.net"
      logoutUri="https://dsqrke7095d1g.cloudfront.net"
    >
      <App />
    </KindeProvider>
  </React.StrictMode>
);
