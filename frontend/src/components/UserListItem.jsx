import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleClick, small }) => {
  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "20px",
        padding: small ? "10px" : "30px 10px",
        borderRadius: "5px",
        ":hover": { backgroundColor: "#278ff7" },
        backgroundColor: "#f0eeee",
        width: "250px",
        overflow: "hidden",
      }}
    >
      <Avatar src={user.pic} />
      <Box>
        <Typography>{user.name}</Typography>
        <Typography>{user.email}</Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
