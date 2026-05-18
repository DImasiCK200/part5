import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useNotificationActions } from "../notificationStore";
import { useUserActions } from "../userStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { showNotification } = useNotificationActions();
  const { login } = useUserActions();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);

      setUsername("");
      setPassword("");

      showNotification("Successful login!", "success");

      navigate("/");
    } catch (err) {
      showNotification(err.response.data.error, "error");
    }
  };

  const style = { paddingTop: 10 };

  return (
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
};

export default Login;
