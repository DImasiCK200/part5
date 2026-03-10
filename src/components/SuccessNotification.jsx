import Notification from "./Notification";

const successNotificationStyle = {
  color: "green",
  background: "lightgreen",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
};

const SuccessNotification = ({ message }) => {
  return (
    <Notification
      message={message}
      notificationStyle={successNotificationStyle}
    />
  );
};

export default SuccessNotification;
