import Alert, { AlertProps } from "@mui/material/Alert";

interface ErrorAlertProps {
  severity: AlertProps["severity"];
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ severity, message }) => {
  return (
    <div
      style={{
        maxWidth: "50vh",
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <Alert severity={severity}>{message}</Alert>
    </div>
  );
};

export default ErrorAlert;
