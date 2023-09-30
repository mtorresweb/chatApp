import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { uploadUserAvatar } from "../api/cloudinaryApi";
import MyAlert from "../components/MyAlert";
import useAxios from "../helpers/useAxios";
import { useEffect } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const createUser = useAxios({
    method: "post",
    url: "user/register",
  });

  const send = async (userData) => {
    await uploadUserAvatar(userData);
    await createUser.fetchData(userData);
  };

  useEffect(() => {
    if (createUser.response) {
      sessionStorage.setItem("userInfo", JSON.stringify(createUser.response));
      navigate("/chats");
    }
  }, [createUser]);

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
        <Typography component="h1" variant="h5">
          ChatApp Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit(send)} sx={{ mt: 1 }}>
          <TextField
            {...register("name")}
            margin="normal"
            required
            fullWidth
            name="name"
            label="User Name"
            type="text"
            id="username"
            autoComplete="username"
          />
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
            type="email"
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
          <Button variant="contained" component="label" sx={{ mt: 3, mb: 2 }}>
            Upload Image
            <input type="file" hidden name="pic" {...register("pic")} />
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {createUser.loading ? "Loading..." : "Sign Up"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/" variant="body2" className="link">
                Log In
              </Link>
            </Grid>
          </Grid>
        </Box>
        <MyAlert
          alert={createUser.alert}
          handleClose={() => createUser.resetAlert()}
        />
      </Box>
    </Container>
  );
};

export default SignUp;
