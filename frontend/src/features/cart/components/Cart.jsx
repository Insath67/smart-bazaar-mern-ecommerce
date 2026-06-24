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

  const formatPrice = (value) => {
    const number = Number(value || 0);
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

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

  /*
    Compact checkout summary mode.
    This is used inside Checkout.jsx right-side order summary.
    No remove buttons. No quantity controls. Clean summary only.
  */
  if (checkout) {
    return (
      <Stack spacing={2.2} sx={{ width: "100%" }}>
        <Stack spacing={1.4}>
          {items.map((item) => {
            const product = item.product;
            const itemTotal = Number(product.price) * Number(item.quantity);

            return (
              <Paper
                key={item._id}
                elevation={0}
                sx={{
                  p: 1.4,
                  borderRadius: "20px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <Box
                    component={Link}
                    to={`/product-details/${product._id}`}
                    sx={{
                      width: 82,
                      minWidth: 82,
                      aspectRatio: "1 / 1",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background:
                        "radial-gradient(circle at top left, #ffffff 0%, #f3f4f6 45%, #e5e7eb 100%)",
                      border: "1px solid rgba(15,23,42,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={`${product.title} image`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>

                  <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component={Link}
                      to={`/product-details/${product._id}`}
                      sx={{
                        textDecoration: "none",
                        color: "#0f172a",
                        fontWeight: 950,
                        fontSize: ".98rem",
                        lineHeight: 1.2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        "&:hover": {
                          color: "#f59e0b",
                        },
                      }}
                    >
                      {product.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 800,
                        fontSize: ".82rem",
                      }}
                    >
                      Qty: {item.quantity} × ${formatPrice(product.price)}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontWeight: 950,
                      fontSize: "1rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ${formatPrice(itemTotal)}
                  </Typography>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
              Subtotal
            </Typography>
            <Typography sx={{ fontWeight: 950 }}>
              ${formatPrice(subtotal)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
              Shipping
            </Typography>
            <Typography sx={{ fontWeight: 950 }}>
              ${formatPrice(SHIPPING)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
              Taxes
            </Typography>
            <Typography sx={{ fontWeight: 950 }}>
              ${formatPrice(TAXES)}
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{
              fontSize: "1.18rem",
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
            ${formatPrice(total)}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
        py: is700 ? 3 : 6,
        px: is700 ? 2 : 4,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: "1350px",
          mx: "auto",
        }}
      >
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

        <Stack
          direction={is1000 ? "column" : "row"}
          spacing={4}
          alignItems="flex-start"
        >
          {/* Cart items */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              width: "100%",
              borderRadius: "32px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
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
                label={`$${formatPrice(subtotal)}`}
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
                    brand={item.product.brand?.name || item.product.brand || "Smart Bazaar"}
                    category={item.product.category?.name || item.product.category || ""}
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
              width: is1000 ? "100%" : "380px",
              position: is1000 ? "static" : "sticky",
              top: "100px",
              borderRadius: "32px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
              boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
              overflow: "hidden",
            }}
          >
            <Stack spacing={2.2} sx={{ p: is500 ? 2.2 : 3 }}>
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontSize: "1.7rem",
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
                  <Typography sx={{ fontWeight: 950 }}>
                    ${formatPrice(subtotal)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Shipping
                  </Typography>
                  <Typography sx={{ fontWeight: 950 }}>
                    ${formatPrice(SHIPPING)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Taxes
                  </Typography>
                  <Typography sx={{ fontWeight: 950 }}>
                    ${formatPrice(TAXES)}
                  </Typography>
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
                  ${formatPrice(total)}
                </Typography>
              </Stack>

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