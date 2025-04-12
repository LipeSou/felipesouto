import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter basename="/felipesouto">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
