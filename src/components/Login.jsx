import { useState } from "react";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser, setSuccessNotification, setErrorNotification }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userDb = await loginService.login({ username, password });

      setSuccessNotification("Successful login!");

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(userDb));
      blogService.setToken(userDb.token);

      setUser(userDb);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setErrorNotification(err.response.data.error);
      console.log(err.response.data.error);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  return <>{loginForm()}</>;
};

export default Login;
