import { Box, Button, Modal, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
  borderRadius: "10px",
};

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      {children ? (
        <Box onClick={handleOpen}>{children}</Box>
      ) : (
        <VisibilityIcon
          onClick={handleOpen}
          sx={{ ":hover": { cursor: "pointer" } }}
        />
      )}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} maxWidth={"80vw"}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {user.name}
            </Typography>
            <img
              alt="user image"
              src={user.pic}
              style={{ width: "80%", borderRadius: "10px" }}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Email: {user.email}
            </Typography>

            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProfileModal;
