import {
  Box,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/material";
import React from "react";
import {
  QRCodePng,
  appStorePng,
  googlePlayPng,
  facebookPng,
  instagramPng,
  twitterPng,
  linkedinPng,
} from "../../assets";
import SendIcon from "@mui/icons-material/Send";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { MotionConfig, motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const theme = useTheme();

  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is500 = useMediaQuery(theme.breakpoints.down(500));

  const labelStyles = {
    fontWeight: 600,
    cursor: "pointer",
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    transition: "all .25s ease",
    "&:hover": {
      color: "#f59e0b",
      transform: "translateX(4px)",
    },
  };

  const headingStyles = {
    fontWeight: 900,
    color: "#ffffff",
    fontSize: "1.15rem",
    letterSpacing: "-.02em",
  };

  return (
    <Box
      component="footer"
      sx={{
        background:
          "radial-gradient(circle at top left, rgba(245,158,11,0.25) 0%, rgba(17,24,39,1) 34%, rgba(2,6,23,1) 100%)",
        color: "#ffffff",
        pt: is700 ? 5 : 7,
        pb: 3,
        px: is700 ? 2 : 5,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow */}
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(245, 158, 11, 0.12)",
          top: "-120px",
          right: "-80px",
          filter: "blur(4px)",
        }}
      />

      <Stack
        sx={{
          maxWidth: "1500px",
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
        spacing={5}
      >
        {/* Upper footer */}
        <Stack
          direction={is900 ? "column" : "row"}
          spacing={is900 ? 4 : 5}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* Brand + Subscribe */}
          <Stack spacing={2.2} sx={{ width: is900 ? "100%" : "28%" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: "17px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
                  color: "#111827",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                }}
              >
                <ShoppingBagOutlinedIcon />
              </Box>

              <Stack>
                <Typography
                  sx={{
                    fontWeight: 950,
                    letterSpacing: ".18rem",
                    fontSize: is500 ? "1rem" : "1.25rem",
                    lineHeight: 1,
                  }}
                >
                  SMART BAZAAR
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 700,
                    letterSpacing: ".06rem",
                    fontSize: ".78rem",
                    mt: 0.5,
                  }}
                >
                  Premium Online Store
                </Typography>
              </Stack>
            </Stack>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.8,
                maxWidth: 360,
                fontWeight: 500,
              }}
            >
              Discover premium products, smooth shopping, secure checkout, and
              exclusive offers curated for modern online buyers.
            </Typography>

            <Stack spacing={1.2}>
              <Typography sx={{ ...headingStyles, fontSize: "1rem" }}>
                Subscribe for offers
              </Typography>

              <TextField
                placeholder="Enter your email"
                fullWidth
                sx={{
                  maxWidth: 380,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.14)",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      background: "rgba(255,255,255,0.12)",
                    },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.55)",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{
                        background: "#f59e0b",
                        color: "#111827",
                        width: 38,
                        height: 38,
                        "&:hover": {
                          background: "#fbbf24",
                        },
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Support */}
          <Stack spacing={1.4} sx={{ minWidth: 210 }}>
            <Typography sx={headingStyles}>Support</Typography>
            <Typography sx={labelStyles}>
              Colombo, Sri Lanka
            </Typography>
            <Typography sx={labelStyles}>
              support@smartbazaar.com
            </Typography>
            <Typography sx={labelStyles}>
              +94 76 020 9715
            </Typography>
            <Typography sx={labelStyles}>
              Mon - Sat: 9.00 AM - 7.00 PM
            </Typography>
          </Stack>

          {/* Account */}
          <Stack spacing={1.4} sx={{ minWidth: 170 }}>
            <Typography sx={headingStyles}>Account</Typography>

            <Typography component={Link} to="/profile" sx={labelStyles}>
              My Account
            </Typography>

            <Typography component={Link} to="/login" sx={labelStyles}>
              Login / Register
            </Typography>

            <Typography component={Link} to="/cart" sx={labelStyles}>
              Cart
            </Typography>

            <Typography component={Link} to="/wishlist" sx={labelStyles}>
              Wishlist
            </Typography>

            <Typography component={Link} to="/" sx={labelStyles}>
              Shop
            </Typography>
          </Stack>

          {/* Quick Links */}
          <Stack spacing={1.4} sx={{ minWidth: 170 }}>
            <Typography sx={headingStyles}>Quick Links</Typography>
            <Typography sx={labelStyles}>Privacy Policy</Typography>
            <Typography sx={labelStyles}>Terms Of Use</Typography>
            <Typography sx={labelStyles}>FAQ</Typography>
            <Typography sx={labelStyles}>Contact</Typography>
          </Stack>

          {/* Download App */}
          <Stack spacing={1.4} sx={{ minWidth: 240 }}>
            <Typography sx={headingStyles}>Download App</Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.55)",
                fontWeight: 600,
                fontSize: ".9rem",
              }}
            >
              Save $3 with App New User Only
            </Typography>

            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  p: 0.8,
                  borderRadius: "16px",
                  background: "#ffffff",
                }}
              >
                <img
                  src={QRCodePng}
                  height="100%"
                  width="100%"
                  style={{ objectFit: "contain" }}
                  alt="QR Code"
                />
              </Box>

              <Stack spacing={1}>
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "130px", cursor: "pointer" }}
                  src={googlePlayPng}
                  alt="Google Play"
                />

                <motion.img
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "130px", cursor: "pointer" }}
                  src={appStorePng}
                  alt="App Store"
                />
              </Stack>
            </Stack>

            <Stack mt={1} direction="row" spacing={2}>
              <MotionConfig whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 1 }}>
                <motion.img
                  style={{ cursor: "pointer", opacity: 0.9 }}
                  src={facebookPng}
                  alt="Facebook"
                />
                <motion.img
                  style={{ cursor: "pointer", opacity: 0.9 }}
                  src={twitterPng}
                  alt="Twitter"
                />
                <motion.img
                  style={{ cursor: "pointer", opacity: 0.9 }}
                  src={instagramPng}
                  alt="Instagram"
                />
                <motion.img
                  style={{ cursor: "pointer", opacity: 0.9 }}
                  src={linkedinPng}
                  alt="Linkedin"
                />
              </MotionConfig>
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom footer */}
        <Stack
          direction={is700 ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
          sx={{
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            &copy; Smart Bazaar {new Date().getFullYear()}. All rights reserved.
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Built for a premium shopping experience.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};