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
import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const createUser = useAxios({
    method: "post",
    url: "user/register",
  });

  const send = async (userData) => {
    try {
      setIsUploading(true);
      await uploadUserAvatar(userData);
      setIsUploading(false);
      await createUser.fetchData(userData);
    } catch (error) {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (createUser.response) {
      sessionStorage.setItem("userInfo", JSON.stringify(createUser.response));
      navigate("/chats");
    }
  }, [createUser]);

  const { register, handleSubmit } = useForm();
  
  // Combined loading state that checks both upload and registration
  const isLoading = isUploading || createUser.loading;
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0].name);
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
            <Button variant="contained" component="label">
              Upload Image
              <input 
                type="file" 
                hidden 
                name="pic" 
                {...register("pic")} 
                onChange={handleImageChange}
              />
            </Button>
            {selectedImage && (
              <Typography 
                variant="body2" 
                sx={{ ml: 2, color: 'text.secondary', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {selectedImage}
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign Up"}
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