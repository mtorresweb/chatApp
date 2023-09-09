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
import axios from "axios";
import { useEffect, useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
  }, []);

  const send = async (userData) => {
    setLoading(true);

    if (userData.pic[0]) {
      const picData = new FormData();
      picData.append("file", userData.pic[0]);
      picData.append("upload_preset", "chat app");
      picData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      try {
        let response = await axios.post(
          import.meta.env.VITE_CLOUDINARY_URL,
          picData
        );
        userData.pic = response.data.url;
        setLoading(false);
      } catch {
        setLoading(false);
        setSuccess(false);
      }
    } else {
      delete userData.pic;
    }
    try {
      let { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        userData
      );

      setLoading(false);
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      console.log("success", data);
      navigate("/chats");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setSuccess(false);
    }
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
