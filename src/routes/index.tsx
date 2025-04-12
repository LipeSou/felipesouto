import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DefaultLayout from "../layout/DefaultLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
