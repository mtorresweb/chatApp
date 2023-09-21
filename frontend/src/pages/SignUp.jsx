import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { userRegisterApi } from "../api/userApi";
import { uploadUserAvatarApi } from "../api/cloudinaryApi";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  const createUser = async (userData) => {
    let data = await userRegisterApi(userData);

    return data ? true : false;
  };

  const uploadUserAvatar = async (userData) => {
    if (userData.pic[0]) {
      const picData = new FormData();

      picData.append("file", userData.pic[0]);
      picData.append("upload_preset", uploadPreset);
      picData.append("cloud_name", cloudName);

      let data = await uploadUserAvatarApi(picData);
      userData.pic = data.url;

      return data ? true : false;
    }
    delete userData.pic;
    return true;
  };

  const send = async (userData) => {
    setLoading(true);

    const avatarOK = await uploadUserAvatar(userData);
    const userOK = await createUser(userData);
    setLoading(false);

    if (avatarOK && userOK) {
      navigate("/chats");
    }

    setSuccess(false);
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
            {loading ? "Loading..." : "Sign Up"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/" variant="body2" className="link">
                Log In
              </Link>
            </Grid>
          </Grid>
        </Box>
        {success ? (
          <></>
        ) : (
          <Alert severity="error">Error uploading image or creating user</Alert>
        )}
      </Box>
    </Container>
  );
};

export default SignUp;
