import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";

const UserBadgeItem = ({ user, handleRemove }) => {
  return (
    <Button
      sx={{
        width: "100%",
      }}
      variant="contained"
      endIcon={<Delete />}
      onClick={() => handleRemove(user)}
    >
      {user.name}
    </Button>
  );
};

export default UserBadgeItem;
