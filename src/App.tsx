import { useAuth } from "./contexts/AuthProvider";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Home from "./screens/Home";
import NotFound from "./components/NotFound";

const App = () => {
  const { authToken } = useAuth();

  return (
    <Routes>
      <Route
        path="/signup"
        element={!authToken ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!authToken ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={authToken ? <Home /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;