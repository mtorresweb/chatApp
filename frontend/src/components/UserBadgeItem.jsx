import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Button
      sx={{
        width: "100%",
      }}
      variant="contained"
      endIcon={<Delete />}
      onClick={() => handleFunction(user)}
    >
      {user.name}
      {admin && <Typography component="span" sx={{ ml: 1, fontSize: '0.8rem' }}>Admin</Typography>}
    </Button>
  );
};

export default UserBadgeItem;
