import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  clearForgotPasswordError,
  clearForgotPasswordSuccessMessage,
  forgotPasswordAsync,
  resetForgotPasswordStatus,
  selectForgotPasswordError,
  selectForgotPasswordStatus,
  selectForgotPasswordSuccessMessage,
} from "../AuthSlice";

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const status = useSelector(selectForgotPasswordStatus);
  const error = useSelector(selectForgotPasswordError);
  const successMessage = useSelector(selectForgotPasswordSuccessMessage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getMessage = (message) => {
    if (!message) return "";
    if (typeof message === "string") return message;
    if (message.message) return message.message;
    return "Something went wrong. Please try again.";
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearForgotPasswordError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearForgotPasswordSuccessMessage());
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordStatus());
      dispatch(clearForgotPasswordError());
      dispatch(clearForgotPasswordSuccessMessage());
    };
  }, [dispatch]);

  const handleForgotPassword = async (data) => {
    dispatch(forgotPasswordAsync(data));
  };

  const isSuccess = status === "fullfilled";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: isSm ? 2 : 4,
        py: 5,
        background:
          "radial-gradient(circle at top left, rgba(255, 193, 7, 0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.15), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1050,
          overflow: "hidden",
          borderRadius: "34px",
          display: "grid",
          gridTemplateColumns: isMd ? "1fr" : "1.05fr 0.95fr",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 28px 90px rgba(15, 23, 42, 0.16)",
          background: "#ffffff",
        }}
      >
        {/* Left Premium Branding */}
        {!isMd && (
          <Box
            sx={{
              position: "relative",
              minHeight: 620,
              p: 5,
              color: "#fff",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, #050505 0%, #111827 52%, #c99522 100%)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.09)",
                top: -80,
                right: -70,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255, 193, 7, 0.2)",
                bottom: 50,
                left: -55,
              }}
            />

            <Stack height="100%" justifyContent="space-between" position="relative">
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 900,
                      letterSpacing: 1,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #facc15 45%, #111827 100%)",
                      color: "#050505",
                      boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
                    }}
                  >
                    SB
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 900,
                        letterSpacing: 4,
                        lineHeight: 1,
                      }}
                    >
                      SMART BAZAAR
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2.2,
                        opacity: 0.75,
                        mt: 0.7,
                      }}
                    >
                      PREMIUM ONLINE STORE
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ pt: 8 }}>
                  <Typography
                    sx={{
                      fontSize: 54,
                      fontWeight: 950,
                      lineHeight: 0.98,
                      letterSpacing: -2,
                    }}
                  >
                    Recover your account securely.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 3,
                      maxWidth: 430,
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.74)",
                    }}
                  >
                    Enter your registered email and we’ll send you a secure password
                    reset link instantly.
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  p: 2,
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <LockResetRoundedIcon sx={{ color: "#facc15" }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                    Secure password reset
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                    Reset link expires soon for better account protection.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Right Form */}
        <Box
          sx={{
            p: isSm ? 3 : 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isMd ? "100vh" : 620,
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
          }}
        >
          <Stack
            component="form"
            noValidate
            onSubmit={handleSubmit(handleForgotPassword)}
            spacing={2.3}
            sx={{
              width: "100%",
              maxWidth: 440,
            }}
          >
            <Box>
              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "20px",
                  display: "grid",
                  placeItems: "center",
                  mb: 2.2,
                  background:
                    "linear-gradient(135deg, rgba(250, 204, 21, 0.22), rgba(17, 24, 39, 0.08))",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                }}
              >
                {isSuccess ? (
                  <MarkEmailReadRoundedIcon sx={{ fontSize: 31, color: "#111827" }} />
                ) : (
                  <LockResetRoundedIcon sx={{ fontSize: 31, color: "#111827" }} />
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: isSm ? 31 : 38,
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: -1.4,
                  lineHeight: 1.05,
                }}
              >
                {isSuccess ? "Check your email" : "Forgot password?"}
              </Typography>

              <Typography
                sx={{
                  mt: 1.4,
                  color: "#64748b",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                }}
              >
                {isSuccess
                  ? "We sent a password reset link to your registered email address."
                  : "No worries. Enter your registered email and we’ll send a reset link to your inbox."}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: "14px" }}>
                {getMessage(error)}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ borderRadius: "14px" }}>
                {getMessage(successMessage)}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email address"
              placeholder="example@email.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  minHeight: 58,
                },
              }}
            />

            <LoadingButton
              loading={status === "pending"}
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                height: 56,
                borderRadius: "16px",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                background:
                  "linear-gradient(135deg, #111827 0%, #050505 55%, #c99522 140%)",
                boxShadow: "0 16px 35px rgba(15, 23, 42, 0.22)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #000000 0%, #111827 55%, #b8860b 140%)",
                  boxShadow: "0 20px 42px rgba(15, 23, 42, 0.28)",
                },
              }}
            >
              Send password reset link
            </LoadingButton>

            <Button
              component={Link}
              to="/login"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                alignSelf: "flex-start",
                px: 0,
                mt: 0.5,
                color: "#111827",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  background: "transparent",
                  color: "#c99522",
                },
              }}
            >
              Back to login
            </Button>

            <Typography
              sx={{
                pt: 1.5,
                color: "#94a3b8",
                fontSize: 12.5,
                lineHeight: 1.7,
              }}
            >
              Tip: Please check your Spam or Promotions folder if the email does not
              appear in your inbox.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};