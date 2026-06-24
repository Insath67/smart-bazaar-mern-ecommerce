import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resetCurrentOrder,
  selectCurrentOrder,
} from "../features/order/OrderSlice";
import { selectUserInfo } from "../features/user/UserSlice";
import { orderSuccessAnimation } from "../assets";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentOrder = useSelector(selectCurrentOrder);
  const userDetails = useSelector(selectUserInfo);

  const { id } = useParams();

  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (!currentOrder) {
      navigate("/");
    }
  }, [currentOrder, navigate]);

  const handleResetOrder = () => {
    dispatch(resetCurrentOrder());
  };

  const orderId = currentOrder?._id || id;
  const orderTotal = currentOrder?.total;
  const paymentMode = currentOrder?.paymentMode || "COD";

  const address =
    currentOrder?.address && typeof currentOrder.address === "object"
      ? currentOrder.address
      : null;

  const hasAddressDetails =
    address?.street ||
    address?.city ||
    address?.state ||
    address?.country ||
    address?.postalCode ||
    address?.phoneNumber;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #fef3c7 140%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: is480 ? 2 : 4,
        py: is480 ? 3 : 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(245, 158, 11, 0.14)",
          top: "-130px",
          left: "-130px",
          filter: "blur(5px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.08)",
          bottom: "-160px",
          right: "-160px",
          filter: "blur(5px)",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: is480 ? "26px" : "36px",
          overflow: "hidden",
          border: "1px solid rgba(15,23,42,0.08)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 90px rgba(15, 23, 42, 0.14)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Stack direction={is900 ? "column" : "row"}>
          {/* Left success visual */}
          <Stack
            flex={1}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              p: is480 ? 3 : 5,
              background:
                "radial-gradient(circle at top left, #f59e0b 0%, #111827 42%, #020617 100%)",
              color: "#ffffff",
              minHeight: is900 ? "auto" : "560px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                bottom: "-100px",
                right: "-90px",
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ alignSelf: "flex-start", position: "relative", zIndex: 2 }}
            >
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
                  fontWeight: 950,
                }}
              >
                SB
              </Box>

              <Stack>
                <Typography
                  sx={{
                    fontSize: is480 ? "1rem" : "1.25rem",
                    fontWeight: 950,
                    letterSpacing: ".18rem",
                    lineHeight: 1,
                  }}
                >
                  SMART BAZAAR
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.68)",
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

            <Box
              sx={{
                width: is480 ? "12rem" : "17rem",
                height: is480 ? "12rem" : "17rem",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Lottie animationData={orderSuccessAnimation} />
            </Box>

            <Stack
              spacing={1}
              textAlign="center"
              alignItems="center"
              sx={{ position: "relative", zIndex: 2 }}
            >
              <Chip
                icon={<CheckCircleOutlineOutlinedIcon />}
                label="Order Confirmed"
                sx={{
                  background: "rgba(255,255,255,0.13)",
                  color: "#ffffff",
                  fontWeight: 900,
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                }}
              />

              <Typography
                sx={{
                  fontSize: is480 ? "2rem" : "2.7rem",
                  fontWeight: 950,
                  letterSpacing: "-.055em",
                  lineHeight: 1.05,
                }}
              >
                Thank you for shopping!
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.74)",
                  fontWeight: 600,
                  lineHeight: 1.7,
                  maxWidth: 430,
                }}
              >
                Your order has been placed successfully. We are preparing it for
                delivery.
              </Typography>
            </Stack>
          </Stack>

          {/* Right order details */}
          <Stack
            flex={1}
            justifyContent="center"
            spacing={3}
            sx={{
              p: is480 ? 3 : 5,
            }}
          >
            <Stack spacing={1}>
              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 800,
                  fontSize: is480 ? ".95rem" : "1rem",
                }}
              >
                Hey {userDetails?.name || "Customer"} 👋
              </Typography>

              <Typography
                sx={{
                  fontSize: is480 ? "2rem" : "2.6rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.055em",
                  lineHeight: 1.05,
                }}
              >
                Your order is confirmed.
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  lineHeight: 1.7,
                }}
              >
                Keep this order ID for reference. You can also track the order
                status from your orders page.
              </Typography>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                borderRadius: "24px",
                border: "1px solid rgba(15,23,42,0.08)",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                overflow: "hidden",
              }}
            >
              <Stack spacing={2.2} sx={{ p: is480 ? 2.2 : 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, #111827 0%, #000000 70%, #f59e0b 160%)",
                      color: "#ffffff",
                      boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                    }}
                  >
                    <ReceiptLongOutlinedIcon />
                  </Box>

                  <Stack>
                    <Typography
                      sx={{
                        fontWeight: 950,
                        color: "#0f172a",
                        fontSize: "1.15rem",
                      }}
                    >
                      Order Details
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        fontSize: ".9rem",
                      }}
                    >
                      Smart Bazaar purchase receipt
                    </Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                  <Stack
                    direction={is600 ? "column" : "row"}
                    justifyContent="space-between"
                    spacing={0.7}
                  >
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Order ID
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: 950,
                        wordBreak: "break-all",
                        textAlign: is600 ? "left" : "right",
                      }}
                    >
                      #{orderId}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Payment Method
                    </Typography>
                    <Chip
                      label={paymentMode}
                      size="small"
                      sx={{
                        background:
                          paymentMode === "CARD" ? "#eff6ff" : "#fef3c7",
                        color: paymentMode === "CARD" ? "#1d4ed8" : "#92400e",
                        fontWeight: 950,
                      }}
                    />
                  </Stack>

                  {orderTotal && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                        Total Amount
                      </Typography>
                      <Typography
                        sx={{
                          color: "#0f172a",
                          fontWeight: 950,
                          fontSize: "1.2rem",
                        }}
                      >
                        ${orderTotal}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {hasAddressDetails && (
                  <>
                    <Divider />

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalShippingOutlinedIcon sx={{ color: "#64748b" }} />
                        <Typography sx={{ fontWeight: 950, color: "#0f172a" }}>
                          Delivery Address
                        </Typography>
                      </Stack>

                      {(address?.street ||
                        address?.city ||
                        address?.state ||
                        address?.country ||
                        address?.postalCode) && (
                        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                          {[address?.street, address?.city, address?.state, address?.country]
                            .filter(Boolean)
                            .join(", ")}
                          {address?.postalCode ? ` ${address.postalCode}` : ""}
                        </Typography>
                      )}

                      {address?.phoneNumber && (
                        <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                          Phone: {address.phoneNumber}
                        </Typography>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>

            <Stack direction={is480 ? "column" : "row"} spacing={1.5}>
              <motion.div
                style={{ flex: 1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  component={Link}
                  to="/orders"
                  onClick={handleResetOrder}
                  endIcon={<ArrowForwardOutlinedIcon />}
                  sx={{
                    height: "3.25rem",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    color: "#ffffff",
                    fontWeight: 950,
                    textTransform: "none",
                    boxShadow: "0 16px 32px rgba(0,0,0,0.18)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #000000 0%, #111827 100%)",
                    },
                  }}
                >
                  View My Orders
                </Button>
              </motion.div>

              <motion.div
                style={{ flex: 1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  component={Link}
                  to="/"
                  onClick={handleResetOrder}
                  startIcon={<HomeOutlinedIcon />}
                  sx={{
                    height: "3.25rem",
                    borderRadius: "16px",
                    background: "#ffffff",
                    color: "#111827",
                    border: "1px solid rgba(15,23,42,0.12)",
                    fontWeight: 950,
                    textTransform: "none",
                    boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                    "&:hover": {
                      background: "#f8fafc",
                    },
                  }}
                >
                  Continue Shopping
                </Button>
              </motion.div>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <ShoppingBagOutlinedIcon
                sx={{ color: "#f59e0b", fontSize: "1.1rem" }}
              />
              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: ".9rem",
                }}
              >
                Smart Bazaar will notify you once your order status changes.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};