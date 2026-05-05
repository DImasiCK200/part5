import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const Login = ({ loginUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    await loginUser(username, password);

    setUsername("");
    setPassword("");
    navigate("/");
  };

  const style = { paddingTop: 10 };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div style={style}>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div style={style}>
          <TextField
            type="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </div>
  );

  return <>{loginForm()}</>;
};

export default Login;
