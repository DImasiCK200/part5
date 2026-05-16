import { getErrorMessage } from "react-error-boundary";

const Fallback = ({ error }) => {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <p style={{ color: "red" }}>{getErrorMessage(error)}</p>
    </div>
  );
};

export default Fallback;
