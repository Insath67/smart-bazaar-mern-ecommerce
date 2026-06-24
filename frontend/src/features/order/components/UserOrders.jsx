import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderByUserIdAsync,
  resetOrderFetchStatus,
  selectOrderFetchStatus,
  selectOrders,
} from "../OrderSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import Lottie from "lottie-react";
import { loadingAnimation, noOrdersAnimation } from "../../../assets";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export const UserOrders = () => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector(selectLoggedInUser);
  const orders = useSelector(selectOrders) || [];
  const cartItems = useSelector(selectCartItems) || [];
  const orderFetchStatus = useSelector(selectOrderFetchStatus);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);

  const theme = useTheme();

  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is560 = useMediaQuery(theme.breakpoints.down(560));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((acc, order) => acc + Number(order.total || 0), 0);
  const totalItems = orders.reduce(
    (acc, order) =>
      acc + (order.item || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    0
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(getOrderByUserIdAsync(loggedInUser._id));
    }
  }, [dispatch, loggedInUser?._id]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (orderFetchStatus === "rejected") {
      toast.error("Error fetching orders, please try again later");
    }
  }, [orderFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderFetchStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const formatPrice = (value) => {
    const number = Number(value || 0);
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "delivered") {
      return {
        background: "#ecfdf5",
        color: "#047857",
      };
    }

    if (value === "pending") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (value === "cancelled" || value === "canceled") {
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    }

    return {
      background: "#eff6ff",
      color: "#1d4ed8",
    };
  };

  const isProductAlreadyInCart = (productId) => {
    return cartItems.some((cartItem) => {
      const cartProductId = cartItem?.product?._id || cartItem?.product;
      return cartProductId === productId;
    });
  };

  const handleAddToCart = (product) => {
    if (!loggedInUser?._id) {
      toast.error("Please login to add product to cart");
      return;
    }

    const item = {
      user: loggedInUser._id,
      product: product._id,
      quantity: 1,
    };

    dispatch(addToCartAsync(item));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
        px: is480 ? 2 : 4,
        py: is480 ? 3 : 6,
      }}
    >
      {orderFetchStatus === "pending" ? (
        <Stack
          width={is480 ? "auto" : "25rem"}
          height="calc(100vh - 4rem)"
          justifyContent="center"
          alignItems="center"
          mx="auto"
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <Stack
          spacing={4}
          sx={{
            maxWidth: "1350px",
            mx: "auto",
          }}
        >
          {/* Heading */}
          <Stack
            direction={is700 ? "column" : "row"}
            justifyContent="space-between"
            alignItems={is700 ? "flex-start" : "center"}
            spacing={2}
          >
            <Stack spacing={0.8}>
              <Chip
                label="Smart Bazaar Orders"
                sx={{
                  width: "fit-content",
                  background: "#111827",
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              />

              <Stack direction="row" alignItems="center" spacing={1.2}>
                {!is480 && (
                  <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                    <IconButton
                      component={Link}
                      to="/"
                      sx={{
                        width: 48,
                        height: 48,
                        background: "#ffffff",
                        border: "1px solid rgba(15,23,42,0.1)",
                        boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                        "&:hover": {
                          background: "#111827",
                          color: "#ffffff",
                        },
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </motion.div>
                )}

                <Typography
                  sx={{
                    fontSize: is480 ? "2rem" : "2.8rem",
                    fontWeight: 950,
                    color: "#0f172a",
                    letterSpacing: "-.055em",
                    lineHeight: 1,
                  }}
                >
                  My Orders
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: ".98rem",
                }}
              >
                Track your purchases, reorder your favorites, and manage your shopping history.
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/"
              startIcon={<ShoppingBagOutlinedIcon />}
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

          {/* Stats */}
          {orders.length > 0 && (
            <Stack direction={is900 ? "column" : "row"} spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: "24px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
                  background: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  >
                    <ReceiptLongOutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Total Orders
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      {totalOrders}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: "24px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
                  background: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: "#ecfdf5",
                      color: "#047857",
                    }}
                  >
                    <PaymentsOutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Total Spent
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      ${formatPrice(totalSpent)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: "24px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
                  background: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                    }}
                  >
                    <Inventory2OutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Items Purchased
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      {totalItems}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          )}

          {/* Orders List */}
          <Stack spacing={3}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);

              return (
                <Paper
                  key={order._id}
                  elevation={0}
                  sx={{
                    borderRadius: "32px",
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
                    background: "rgba(255,255,255,0.94)",
                    overflow: "hidden",
                  }}
                >
                  {/* Order Header */}
                  <Stack
                    direction={is900 ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems={is900 ? "flex-start" : "center"}
                    spacing={2}
                    sx={{
                      p: is480 ? 2.2 : 3,
                      borderBottom: "1px solid rgba(15,23,42,0.08)",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                  >
                    <Stack direction="row" spacing={1.6} alignItems="center">
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "17px",
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

                      <Stack spacing={0.3}>
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontWeight: 950,
                            fontSize: "1.2rem",
                          }}
                        >
                          Order #{order._id?.slice(-8)}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#64748b",
                            fontWeight: 700,
                            wordBreak: "break-all",
                            fontSize: ".88rem",
                          }}
                        >
                          {order._id}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      rowGap={1}
                      alignItems="center"
                    >
                      <Chip
                        icon={<CalendarMonthOutlinedIcon />}
                        label={new Date(order.createdAt).toDateString()}
                        sx={{
                          background: "#ffffff",
                          border: "1px solid rgba(15,23,42,0.1)",
                          fontWeight: 850,
                          color: "#475569",
                        }}
                      />

                      <Chip
                        label={order.status || "Processing"}
                        sx={{
                          background: statusStyle.background,
                          color: statusStyle.color,
                          fontWeight: 950,
                          textTransform: "capitalize",
                        }}
                      />

                      <Chip
                        label={`$${formatPrice(order.total)}`}
                        sx={{
                          background: "#fef3c7",
                          color: "#92400e",
                          fontWeight: 950,
                          fontSize: ".95rem",
                        }}
                      />
                    </Stack>
                  </Stack>

                  {/* Order Products */}
                  <Stack spacing={2} sx={{ p: is480 ? 2.2 : 3 }}>
                    {(order.item || []).map((item) => {
                      const product = item.product;
                      const productId = product?._id;
                      const image = product?.thumbnail || product?.images?.[0];
                      const alreadyInCart = isProductAlreadyInCart(productId);

                      return (
                        <Paper
                          key={`${order._id}-${productId}`}
                          elevation={0}
                          sx={{
                            p: is560 ? 1.6 : 2,
                            borderRadius: "24px",
                            border: "1px solid rgba(15,23,42,0.08)",
                            background:
                              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                          }}
                        >
                          <Stack
                            direction={is700 ? "column" : "row"}
                            spacing={2}
                            alignItems={is700 ? "stretch" : "center"}
                          >
                            <Box
                              component={Link}
                              to={`/product-details/${productId}`}
                              sx={{
                                width: is700 ? "100%" : 150,
                                minWidth: is700 ? "100%" : 150,
                                aspectRatio: is700 ? "4 / 3" : "1 / 1",
                                borderRadius: "20px",
                                overflow: "hidden",
                                background:
                                  "radial-gradient(circle at top left, #ffffff 0%, #f3f4f6 45%, #e5e7eb 100%)",
                                border: "1px solid rgba(15,23,42,0.08)",
                                boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
                                display: "block",
                                textDecoration: "none",
                              }}
                            >
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                src={image}
                                alt={`${product?.title} image`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </Box>

                            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                              <Stack
                                direction={is560 ? "column" : "row"}
                                justifyContent="space-between"
                                spacing={1}
                              >
                                <Stack spacing={0.6}>
                                  <Typography
                                    component={Link}
                                    to={`/product-details/${productId}`}
                                    sx={{
                                      textDecoration: "none",
                                      color: "#0f172a",
                                      fontSize: "1.25rem",
                                      fontWeight: 950,
                                      letterSpacing: "-.035em",
                                      lineHeight: 1.15,
                                      "&:hover": {
                                        color: "#f59e0b",
                                      },
                                    }}
                                  >
                                    {product?.title}
                                  </Typography>

                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    rowGap={1}
                                  >
                                    {product?.brand?.name && (
                                      <Chip
                                        label={product.brand.name}
                                        size="small"
                                        sx={{
                                          background: "#111827",
                                          color: "#ffffff",
                                          fontWeight: 900,
                                        }}
                                      />
                                    )}

                                    {product?.category?.name && (
                                      <Chip
                                        label={product.category.name}
                                        size="small"
                                        sx={{
                                          background: "#fef3c7",
                                          color: "#92400e",
                                          fontWeight: 900,
                                        }}
                                      />
                                    )}

                                    <Chip
                                      label={`Qty: ${item.quantity}`}
                                      size="small"
                                      sx={{
                                        background: "#eff6ff",
                                        color: "#1d4ed8",
                                        fontWeight: 900,
                                      }}
                                    />
                                  </Stack>
                                </Stack>

                                <Typography
                                  sx={{
                                    color: "#0f172a",
                                    fontWeight: 950,
                                    fontSize: "1.3rem",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  ${formatPrice(product?.price)}
                                </Typography>
                              </Stack>

                              <Typography
                                sx={{
                                  color: "#64748b",
                                  fontWeight: 650,
                                  lineHeight: 1.6,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {product?.description}
                              </Typography>

                              <Stack
                                direction={is560 ? "column" : "row"}
                                justifyContent="flex-end"
                                spacing={1.2}
                                pt={1}
                              >
                                <Button
                                  component={Link}
                                  to={`/product-details/${productId}`}
                                  startIcon={<VisibilityOutlinedIcon />}
                                  sx={{
                                    height: "2.75rem",
                                    borderRadius: "14px",
                                    textTransform: "none",
                                    fontWeight: 900,
                                    color: "#111827",
                                    background: "#ffffff",
                                    border: "1px solid rgba(15,23,42,0.12)",
                                    "&:hover": {
                                      background: "#f8fafc",
                                    },
                                  }}
                                >
                                  View Product
                                </Button>

                                {alreadyInCart ? (
                                  <Button
                                    component={Link}
                                    to="/cart"
                                    startIcon={<ShoppingCartOutlinedIcon />}
                                    sx={{
                                      height: "2.75rem",
                                      borderRadius: "14px",
                                      textTransform: "none",
                                      fontWeight: 900,
                                      background: "#ecfdf5",
                                      color: "#047857",
                                      "&:hover": {
                                        background: "#d1fae5",
                                      },
                                    }}
                                  >
                                    Already in Cart
                                  </Button>
                                ) : (
                                  <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Button
                                      onClick={() => handleAddToCart(product)}
                                      startIcon={<ReplayOutlinedIcon />}
                                      sx={{
                                        height: "2.75rem",
                                        borderRadius: "14px",
                                        textTransform: "none",
                                        fontWeight: 900,
                                        background:
                                          "linear-gradient(135deg, #111827 0%, #000000 100%)",
                                        color: "#ffffff",
                                        px: 2.2,
                                        boxShadow:
                                          "0 12px 25px rgba(0,0,0,0.16)",
                                        "&:hover": {
                                          background:
                                            "linear-gradient(135deg, #000000 0%, #111827 100%)",
                                        },
                                      }}
                                    >
                                      Buy Again
                                    </Button>
                                  </motion.div>
                                )}
                              </Stack>
                            </Stack>
                          </Stack>
                        </Paper>
                      );
                    })}

                    <Divider />

                    <Stack
                      direction={is700 ? "column" : "row"}
                      justifyContent="space-between"
                      alignItems={is700 ? "flex-start" : "center"}
                      spacing={1}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalShippingOutlinedIcon sx={{ color: statusStyle.color }} />
                        <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                          Current Status:
                        </Typography>
                        <Typography
                          sx={{
                            color: statusStyle.color,
                            fontWeight: 950,
                            textTransform: "capitalize",
                          }}
                        >
                          {order.status || "Processing"}
                        </Typography>
                      </Stack>

                      <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                        {order.item?.length || 0} product
                        {(order.item?.length || 0) > 1 ? "s" : ""} in this order
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          {/* Empty State */}
          {!orders.length && (
            <Paper
              elevation={0}
              sx={{
                p: is480 ? 3 : 5,
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
                background: "#ffffff",
                textAlign: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: is560 ? "16rem" : "24rem",
                    height: is560 ? "16rem" : "24rem",
                  }}
                >
                  <Lottie animationData={noOrdersAnimation} />
                </Box>

                <Typography
                  sx={{
                    fontSize: is480 ? "1.5rem" : "2rem",
                    fontWeight: 950,
                    color: "#0f172a",
                    letterSpacing: "-.04em",
                  }}
                >
                  No orders yet
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    maxWidth: 520,
                  }}
                >
                  Looks like you have not placed any orders yet. Start shopping and your purchases will appear here.
                </Typography>

                <Button
                  component={Link}
                  to="/"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  sx={{
                    mt: 1,
                    height: "3.1rem",
                    px: 3,
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
                  Start Shopping
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      )}
    </Box>
  );
};