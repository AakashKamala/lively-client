import { useAuth } from "../contexts/AuthProvider";
import Active from "../components/Active";
import Login from "./Login";

const Home = () => {
    const { authToken } = useAuth();

    return (
        <div>
            {authToken ? <Active /> : <Login />}
        </div>
    );
};

export default Home;
