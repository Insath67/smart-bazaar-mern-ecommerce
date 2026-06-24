import {
  Box,
  FormHelperText,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ecommerceOutlookAnimation } from "../../../assets";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  selectLoggedInUser,
  signupAsync,
  selectSignupStatus,
  selectSignupError,
  clearSignupError,
  resetSignupStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export const Signup = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectSignupStatus);
  const error = useSelector(selectSignupError);
  const loggedInUser = useSelector(selectLoggedInUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const theme = useTheme();

  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    } else if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error);
    }
  }, [error]);

  useEffect(() => {
    if (status === "fulfilled" || status === "fullfilled") {
      toast.success("Welcome! Verify your email to start shopping on Smart Bazaar.");
      reset();
    }

    return () => {
      dispatch(clearSignupError());
      dispatch(resetSignupStatus());
    };
  }, [status, reset, dispatch]);

  const handleSignup = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(signupAsync(cred));
  };

  return (
    <Stack
      width="100vw"
      height="100vh"
      direction="row"
      sx={{
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #ffffff 45%, #fef3c7 140%)",
      }}
    >
      {/* Left premium visual section */}
      {!is900 && (
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
            background:
              "radial-gradient(circle at top left, #f59e0b 0%, #111827 38%, #020617 100%)",
            color: "#ffffff",
            px: 6,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-120px",
              left: "-120px",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.25)",
              filter: "blur(5px)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: "-140px",
              right: "-120px",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              filter: "blur(3px)",
            }}
          />

          <Stack
            spacing={2.2}
            sx={{
              maxWidth: 560,
              width: "100%",
              position: "relative",
              zIndex: 2,
              transform: "translateY(35px)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
                  color: "#111827",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
                }}
              >
                <ShoppingBagOutlinedIcon />
              </Box>

              <Stack>
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 950,
                    letterSpacing: ".2rem",
                  }}
                >
                  SMART BAZAAR
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontWeight: 700,
                    letterSpacing: ".08rem",
                    fontSize: ".78rem",
                  }}
                >
                  Premium Online Store
                </Typography>
              </Stack>
            </Stack>

            <Typography
              sx={{
                fontSize: "2.75rem",
                fontWeight: 950,
                lineHeight: 1.05,
                letterSpacing: "-.04em",
              }}
            >
              Create account.
              <br />
              Shop smarter.
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: 470,
              }}
            >
              Join Smart Bazaar to manage your wishlist, cart, orders, and premium
              deals in one clean shopping experience.
            </Typography>

            <Box
              sx={{
                width: "34%",
                maxWidth: 210,
                minWidth: 160,
                mt: -0.5,
                ml: 6,
                opacity: 0.95,
                pointerEvents: "none",
              }}
            >
              <Lottie animationData={ecommerceOutlookAnimation} />
            </Box>
          </Stack>
        </Stack>
      )}

      {/* Right signup form section */}
      <Stack
        flex={1}
        justifyContent="center"
        alignItems="center"
        sx={{
          px: is480 ? 2 : 4,
          py: 0,
          height: "100vh",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: is480 ? "100%" : is600 ? "92vw" : "31rem",
            p: is480 ? 3 : 3.5,
            my: "auto",
            borderRadius: "30px",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Stack spacing={1} alignItems="center" mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, #111827 0%, #000000 60%, #f59e0b 160%)",
                color: "#ffffff",
                fontWeight: 950,
                fontSize: "1rem",
                boxShadow: "0 18px 35px rgba(0,0,0,0.22)",
              }}
            >
              SB
            </Box>

            <Typography
              sx={{
                fontSize: is480 ? "2rem" : "2.45rem",
                fontWeight: 950,
                color: "#0f172a",
                letterSpacing: "-.05em",
                textAlign: "center",
              }}
            >
              Smart Bazaar
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Create your account and start shopping.
            </Typography>
          </Stack>

          <Stack
            spacing={1.7}
            component="form"
            noValidate
            onSubmit={handleSubmit(handleSignup)}
          >
            <motion.div whileHover={{ y: -3 }}>
              <TextField
                fullWidth
                {...register("name", {
                  required: "Username is required",
                })}
                placeholder="Username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#f8fafc",
                    fontWeight: 700,
                  },
                }}
              />

              {errors.name && (
                <FormHelperText sx={{ mt: 1 }} error>
                  {errors.name.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <TextField
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Email address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#f8fafc",
                    fontWeight: 700,
                  },
                }}
              />

              {errors.email && (
                <FormHelperText sx={{ mt: 1 }} error>
                  {errors.email.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <TextField
                type="password"
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message:
                      "At least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number required",
                  },
                })}
                placeholder="Password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#f8fafc",
                    fontWeight: 700,
                  },
                }}
              />

              {errors.password && (
                <FormHelperText sx={{ mt: 1 }} error>
                  {errors.password.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <TextField
                type="password"
                fullWidth
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords do not match",
                })}
                placeholder="Confirm password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#f8fafc",
                    fontWeight: 700,
                  },
                }}
              />

              {errors.confirmPassword && (
                <FormHelperText sx={{ mt: 1 }} error>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
              <LoadingButton
                fullWidth
                loading={status === "pending"}
                type="submit"
                variant="contained"
                sx={{
                  height: "3.1rem",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #111827 0%, #000000 100%)",
                  fontWeight: 900,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.18)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #000000 0%, #111827 100%)",
                    boxShadow: "0 20px 42px rgba(0,0,0,0.25)",
                  },
                }}
              >
                Sign up
              </LoadingButton>
            </motion.div>

            <Stack
              direction={is480 ? "column" : "row"}
              justifyContent="space-between"
              alignItems={is480 ? "flex-start" : "center"}
              spacing={1.5}
              pt={0.5}
            >
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.03 }}>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    textDecoration: "none",
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: ".93rem",
                  }}
                >
                  Forgot password?
                </Typography>
              </motion.div>

              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.03 }}>
                <Typography
                  component={Link}
                  to="/login"
                  sx={{
                    textDecoration: "none",
                    color: "#475569",
                    fontWeight: 700,
                    fontSize: ".93rem",
                  }}
                >
                  Already a member?{" "}
                  <span style={{ color: "#f59e0b", fontWeight: 900 }}>
                    Login
                  </span>
                </Typography>
              </motion.div>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};