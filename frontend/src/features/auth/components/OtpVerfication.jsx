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
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import LockClockRoundedIcon from "@mui/icons-material/LockClockRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  clearOtpVerificationError,
  clearResendOtpError,
  clearResendOtpSuccessMessage,
  resendOtpAsync,
  resetOtpVerificationStatus,
  resetResendOtpStatus,
  selectLoggedInUser,
  selectOtpVerificationError,
  selectOtpVerificationStatus,
  selectResendOtpError,
  selectResendOtpStatus,
  selectResendOtpSuccessMessage,
  verifyOtpAsync,
} from "../AuthSlice";

export const OtpVerfication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const loggedInUser = useSelector(selectLoggedInUser);

  const resendOtpStatus = useSelector(selectResendOtpStatus);
  const resendOtpError = useSelector(selectResendOtpError);
  const resendOtpSuccessMessage = useSelector(selectResendOtpSuccessMessage);

  const otpVerificationStatus = useSelector(selectOtpVerificationStatus);
  const otpVerificationError = useSelector(selectOtpVerificationError);

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
    if (!loggedInUser) {
      navigate("/login");
    } else if (loggedInUser?.isVerified) {
      if (loggedInUser?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [loggedInUser, navigate]);

  const handleSendOtp = () => {
    if (!loggedInUser?._id) {
      toast.error("User not found. Please login again.");
      return;
    }

    dispatch(resendOtpAsync({ user: loggedInUser._id }));
  };

  const handleVerifyOtp = (data) => {
    if (!loggedInUser?._id) {
      toast.error("User not found. Please login again.");
      return;
    }

    const cred = {
      userId: loggedInUser._id,
      otp: data.otp,
    };

    dispatch(verifyOtpAsync(cred));
  };

  useEffect(() => {
    if (resendOtpError) {
      toast.error(getMessage(resendOtpError));
      dispatch(clearResendOtpError());
    }
  }, [resendOtpError, dispatch]);

  useEffect(() => {
    if (resendOtpSuccessMessage) {
      toast.success(getMessage(resendOtpSuccessMessage));
      dispatch(clearResendOtpSuccessMessage());
    }
  }, [resendOtpSuccessMessage, dispatch]);

  useEffect(() => {
    if (otpVerificationError) {
      toast.error(getMessage(otpVerificationError));
      dispatch(clearOtpVerificationError());
    }
  }, [otpVerificationError, dispatch]);

  useEffect(() => {
    if (otpVerificationStatus === "fullfilled") {
      toast.success("Email verified! We are happy to have you here");

      dispatch(resetResendOtpStatus());
      dispatch(resetOtpVerificationStatus());

      if (loggedInUser?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [otpVerificationStatus, loggedInUser, navigate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetResendOtpStatus());
      dispatch(resetOtpVerificationStatus());
      dispatch(clearOtpVerificationError());
      dispatch(clearResendOtpError());
      dispatch(clearResendOtpSuccessMessage());
    };
  }, [dispatch]);

  const otpSent = resendOtpStatus === "fullfilled";

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
          "radial-gradient(circle at top left, rgba(255, 193, 7, 0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(0,0,0,0.13), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1050,
          minHeight: isMd ? "auto" : 620,
          overflow: "hidden",
          borderRadius: "34px",
          display: "grid",
          gridTemplateColumns: isMd ? "1fr" : "1.05fr 0.95fr",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 28px 90px rgba(15, 23, 42, 0.16)",
          background: "#ffffff",
        }}
      >
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
                    Verify your email securely.
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
                    We’ll send a one-time verification code to protect your Smart
                    Bazaar account before you continue shopping.
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
                <VerifiedUserRoundedIcon sx={{ color: "#facc15" }} />

                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                    Secure OTP verification
                  </Typography>

                  <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                    Your code expires soon for better account protection.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        )}

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
            onSubmit={handleSubmit(handleVerifyOtp)}
            spacing={2.3}
            sx={{
              width: "100%",
              maxWidth: 440,
              minHeight: isSm ? 610 : 560,
              justifyContent: "center",
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
                {otpSent ? (
                  <PasswordRoundedIcon sx={{ fontSize: 31, color: "#111827" }} />
                ) : (
                  <MarkEmailReadRoundedIcon sx={{ fontSize: 31, color: "#111827" }} />
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
                {otpSent ? "Enter verification code" : "Verify your email"}
              </Typography>

              <Typography
                sx={{
                  mt: 1.4,
                  color: "#64748b",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                }}
              >
                {otpSent
                  ? "Enter the 4-digit OTP sent to your registered email address."
                  : "We will send a one-time password to your registered email address."}
              </Typography>
            </Box>

            <Alert
              severity="info"
              icon={<MarkEmailReadRoundedIcon />}
              sx={{
                borderRadius: "16px",
                background: "rgba(59, 130, 246, 0.08)",
                color: "#334155",
                "& .MuiAlert-icon": {
                  color: "#111827",
                },
              }}
            >
              Verification email:{" "}
              <strong>{loggedInUser?.email || "your registered email"}</strong>
            </Alert>

            <Box
              sx={{
                minHeight: 86,
                display: "flex",
                alignItems: "center",
              }}
            >
              {otpSent ? (
                <TextField
                  fullWidth
                  label="OTP code"
                  placeholder="Enter 4-digit code"
                  type="number"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 4,
                      message: "Please enter a 4 digit OTP",
                    },
                    maxLength: {
                      value: 4,
                      message: "OTP must be 4 digits",
                    },
                  })}
                  error={Boolean(errors.otp)}
                  helperText={errors.otp?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockClockRoundedIcon sx={{ color: "#94a3b8" }} />
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
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: 58,
                    borderRadius: "16px",
                    border: "1px dashed rgba(15, 23, 42, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    color: "#94a3b8",
                    background: "rgba(248,250,252,0.8)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Click Get OTP to receive your verification code.
                </Box>
              )}
            </Box>

            <Box
              sx={{
                minHeight: 128,
                display: "flex",
                alignItems: "center",
              }}
            >
              {!otpSent ? (
                <LoadingButton
                  type="button"
                  loading={resendOtpStatus === "pending"}
                  onClick={handleSendOtp}
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
                  Get OTP
                </LoadingButton>
              ) : (
                <Stack spacing={1.5} sx={{ width: "100%" }}>
                  <LoadingButton
                    loading={otpVerificationStatus === "pending"}
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
                    Verify OTP
                  </LoadingButton>

                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendOtpStatus === "pending"}
                    sx={{
                      height: 48,
                      color: "#111827",
                      fontWeight: 800,
                      textTransform: "none",
                      "&:hover": {
                        background: "rgba(201, 149, 34, 0.08)",
                        color: "#c99522",
                      },
                    }}
                  >
                    Resend OTP
                  </Button>
                </Stack>
              )}
            </Box>

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
              Tip: Please check your Spam or Promotions folder if the OTP does not
              appear in your inbox.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};