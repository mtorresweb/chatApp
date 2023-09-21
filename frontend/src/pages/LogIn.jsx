import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userLoginApi } from "../api/userApi";

const LogIn = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  const send = async (credentials) => {
    setLoading(true);

    let data = await userLoginApi(credentials);

    if (data) {
      navigate("/chats");
    }

    setSuccess(false);
    setLoading(false);
  };

  const { register, handleSubmit } = useForm();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ChatApp Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(send)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            {...register("email")}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            {...register("password")}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Loading..." : "Log In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/signUp" variant="body2" className="link">
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
        {success ? <></> : <Alert severity="error">Error while logging</Alert>}
      </Box>
    </Container>
  );
};

export default LogIn;
