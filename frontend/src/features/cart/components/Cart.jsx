import React, { useEffect } from "react";
import { CartItem } from "./CartItem";
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
import {
  resetCartItemRemoveStatus,
  selectCartItemRemoveStatus,
  selectCartItems,
} from "../CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SHIPPING, TAXES } from "../../../constants";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export const Cart = ({ checkout }) => {
  const items = useSelector(selectCartItems) || [];

  const subtotal = items.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = subtotal + SHIPPING + TAXES;

  const navigate = useNavigate();
  const theme = useTheme();

  const is1000 = useMediaQuery(theme.breakpoints.down(1000));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is500 = useMediaQuery(theme.breakpoints.down(500));

  const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  useEffect(() => {
    if (cartItemRemoveStatus === "fulfilled") {
      toast.success("Product removed from cart");
    } else if (cartItemRemoveStatus === "rejected") {
      toast.error("Error removing product from cart, please try again later");
    }
  }, [cartItemRemoveStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetCartItemRemoveStatus());
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: checkout ? "auto" : "100vh",
        background: checkout
          ? "transparent"
          : "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
        py: checkout ? 0 : is700 ? 3 : 6,
        px: checkout ? 0 : is700 ? 2 : 4,
      }}
    >
      <Stack
        spacing={checkout ? 3 : 4}
        sx={{
          maxWidth: checkout ? "100%" : "1350px",
          mx: "auto",
        }}
      >
        {!checkout && (
          <Stack
            direction={is700 ? "column" : "row"}
            justifyContent="space-between"
            alignItems={is700 ? "flex-start" : "center"}
            spacing={2}
          >
            <Stack spacing={0.8}>
              <Chip
                label="Smart Bazaar Cart"
                sx={{
                  width: "fit-content",
                  background: "#111827",
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              />

              <Typography
                sx={{
                  fontSize: is500 ? "2rem" : "2.8rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.055em",
                  lineHeight: 1,
                }}
              >
                Shopping Cart
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: ".98rem",
                }}
              >
                Review your selected products before checkout.
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBackOutlinedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: "999px",
                px: 2.5,
                py: 1.2,
                color: "#111827",
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.1)",
                boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                "&:hover": {
                  background: "#111827",
                  color: "#ffffff",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        )}

        <Stack
          direction={checkout || is1000 ? "column" : "row"}
          spacing={checkout ? 3 : 4}
          alignItems="flex-start"
        >
          {/* Cart items */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              width: "100%",
              borderRadius: checkout ? "24px" : "32px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: checkout
                ? "0 12px 35px rgba(15,23,42,0.06)"
                : "0 24px 70px rgba(15,23,42,0.10)",
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: is500 ? 2 : 3,
                borderBottom: "1px solid rgba(15,23,42,0.08)",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 70%, #f59e0b 160%)",
                    color: "#ffffff",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Box>

                <Stack>
                  <Typography
                    sx={{
                      fontWeight: 950,
                      color: "#0f172a",
                      fontSize: "1.15rem",
                    }}
                  >
                    Cart Items
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: ".9rem",
                    }}
                  >
                    {totalItems} item{totalItems > 1 ? "s" : ""} selected
                  </Typography>
                </Stack>
              </Stack>

              <Chip
                label={`$${subtotal}`}
                sx={{
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 950,
                  fontSize: ".95rem",
                }}
              />
            </Stack>

            <Stack
              spacing={2}
              sx={{
                p: is500 ? 2 : 3,
              }}
            >
              {items.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    borderRadius: "22px",
                    overflow: "hidden",
                    border: "1px solid rgba(15,23,42,0.08)",
                    background: "#ffffff",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
                  }}
                >
                  <CartItem
                    id={item._id}
                    title={item.product.title}
                    brand={item.product.brand.name}
                    category={item.product.category.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    thumbnail={item.product.thumbnail}
                    stockQuantity={item.product.stockQuantity}
                    productId={item.product._id}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Order summary */}
          <Paper
            elevation={0}
            sx={{
              width: checkout || is1000 ? "100%" : "380px",
              position: checkout || is1000 ? "static" : "sticky",
              top: "100px",
              borderRadius: checkout ? "24px" : "32px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
              boxShadow: checkout
                ? "0 12px 35px rgba(15,23,42,0.06)"
                : "0 24px 70px rgba(15,23,42,0.10)",
              overflow: "hidden",
            }}
          >
            <Stack spacing={2.2} sx={{ p: is500 ? 2.2 : 3 }}>
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontSize: checkout ? "1.4rem" : "1.7rem",
                    fontWeight: 950,
                    letterSpacing: "-.04em",
                    color: "#0f172a",
                  }}
                >
                  Order Summary
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: ".92rem",
                  }}
                >
                  Shipping and taxes are calculated here.
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={1.6}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Subtotal
                  </Typography>
                  <Typography sx={{ fontWeight: 950 }}>${subtotal}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Shipping
                  </Typography>
                  <Typography sx={{ fontWeight: 950 }}>${SHIPPING}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Taxes
                  </Typography>
                  <Typography sx={{ fontWeight: 950 }}>${TAXES}</Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 950,
                    color: "#0f172a",
                  }}
                >
                  Total
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 950,
                    color: "#0f172a",
                  }}
                >
                  ${total}
                </Typography>
              </Stack>

              {!checkout && (
                <Stack spacing={1.4}>
                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      fullWidth
                      component={Link}
                      to="/checkout"
                      startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                      sx={{
                        height: "3.35rem",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #111827 0%, #000000 100%)",
                        color: "#ffffff",
                        fontWeight: 950,
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
                      Proceed to Checkout
                    </Button>
                  </motion.div>

                  <motion.div
                    style={{ alignSelf: "center" }}
                    whileHover={{ y: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Chip
                      component={Link}
                      to="/"
                      clickable
                      label="or continue shopping"
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        borderRadius: "999px",
                        fontWeight: 800,
                        color: "#475569",
                        borderColor: "rgba(15,23,42,0.14)",
                        textDecoration: "none",
                      }}
                    />
                  </motion.div>
                </Stack>
              )}

              <Divider />

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "13px",
                      display: "grid",
                      placeItems: "center",
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  >
                    <LocalShippingOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: "#475569" }}>
                    Fast delivery available
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "13px",
                      display: "grid",
                      placeItems: "center",
                      background: "#ecfdf5",
                      color: "#047857",
                    }}
                  >
                    <VerifiedUserOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: "#475569" }}>
                    Secure checkout experience
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};