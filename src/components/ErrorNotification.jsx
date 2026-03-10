import Notification from "./Notification";

const errorNotificationStyle = {
  color: "red",
  background: "lightred",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
};

const ErrorNotification = ({ message }) => {
  return (
    <Notification
      message={message}
      notificationStyle={errorNotificationStyle}
    />
  );
};

export default ErrorNotification;
