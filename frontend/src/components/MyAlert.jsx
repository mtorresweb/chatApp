import { Alert, Snackbar } from "@mui/material";

const MyAlert = ({ alert, handleClose }) => {
  return (
    <Snackbar open={alert.active} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        severity={alert.severity}
        variant="filled"
        sx={{ width: "90%" }}
        onClose={handleClose}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default MyAlert;
