import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersAsync,
  resetOrderUpdateStatus,
  selectOrderUpdateStatus,
  selectOrders,
  updateOrderByIdAsync,
} from "../../order/OrderSlice";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { toast } from "react-toastify";
import { noOrdersAnimation } from "../../../assets/index";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const orders = useSelector(selectOrders) || [];
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);

  const [editIndex, setEditIndex] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState("");

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const isUpdating =
    orderUpdateStatus === "pending" || orderUpdateStatus === "loading";

  const editOptions = [
    "Pending",
    "Dispatched",
    "Out for delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orderUpdateStatus === "fulfilled") {
      toast.success("Order status updated");
      dispatch(getAllOrdersAsync());
    } else if (orderUpdateStatus === "rejected") {
      toast.error("Error updating order status");
    }
  }, [orderUpdateStatus, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus());
    };
  }, [dispatch]);

  const handleStartEdit = (index, currentStatus) => {
    setEditIndex(index);
    setSelectedStatus(currentStatus || "Pending");
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
    setSelectedStatus("");
  };

  const handleUpdateOrder = (orderId) => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    const update = {
      _id: orderId,
      status: selectedStatus,
    };

    setEditIndex(-1);
    dispatch(updateOrderByIdAsync(update));
  };

  const getAddress = (order) => {
    if (Array.isArray(order?.address)) {
      return order.address[0] || {};
    }

    return order?.address || {};
  };

  const getItemsCount = (order) => {
    return (
      order?.item?.reduce((acc, item) => acc + Number(item?.quantity || 1), 0) ||
      0
    );
  };

  const getTotalSpent = () => {
    return orders.reduce((acc, order) => acc + Number(order?.total || 0), 0);
  };

  const getStatusMeta = (status) => {
    if (status === "Pending") {
      return {
        bg: "#fef3c7",
        color: "#92400e",
        icon: <ReceiptLongOutlinedIcon fontSize="small" />,
      };
    }

    if (status === "Dispatched") {
      return {
        bg: "#eff6ff",
        color: "#1d4ed8",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
      };
    }

    if (status === "Out for delivery") {
      return {
        bg: "#e0f2fe",
        color: "#0369a1",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
      };
    }

    if (status === "Delivered") {
      return {
        bg: "#ecfdf5",
        color: "#047857",
        icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
      };
    }

    if (status === "Cancelled") {
      return {
        bg: "#fee2e2",
        color: "#dc2626",
        icon: <CancelOutlinedIcon fontSize="small" />,
      };
    }

    return {
      bg: "#f1f5f9",
      color: "#475569",
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    };
  };

  const formatPrice = (amount) => {
    const value = Number(amount || 0);
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toDateString();
  };

  const statCard = (icon, label, value, bg, color) => (
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
            width: 52,
            height: 52,
            borderRadius: "18px",
            display: "grid",
            placeItems: "center",
            background: bg,
            color: color,
          }}
        >
          {icon}
        </Box>

        <Stack>
          <Typography sx={{ color: "#64748b", fontWeight: 850 }}>
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: is480 ? "1.35rem" : "1.7rem",
              fontWeight: 950,
              color: "#0f172a",
              lineHeight: 1.15,
            }}
          >
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
        px: is480 ? 2 : 4,
        py: is480 ? 3 : 5,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: "1450px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Stack
          direction={is700 ? "column" : "row"}
          justifyContent="space-between"
          alignItems={is700 ? "flex-start" : "center"}
          spacing={2}
        >
          <Stack spacing={0.8}>
            <Chip
              label="Smart Bazaar Admin"
              sx={{
                width: "fit-content",
                background: "#111827",
                color: "#ffffff",
                fontWeight: 900,
              }}
            />

            <Typography
              sx={{
                fontSize: is480 ? "2rem" : "2.8rem",
                fontWeight: 950,
                color: "#0f172a",
                letterSpacing: "-.055em",
                lineHeight: 1,
              }}
            >
              Admin Orders
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: ".98rem",
              }}
            >
              Track customer orders, review order details, and update delivery
              status.
            </Typography>
          </Stack>

          <Chip
            icon={<ShoppingBagOutlinedIcon />}
            label={`${orders.length} Orders Found`}
            sx={{
              background: "#fef3c7",
              color: "#92400e",
              fontWeight: 950,
              px: 1,
            }}
          />
        </Stack>

        {/* Stats */}
        <Stack direction={is1200 ? "column" : "row"} spacing={2}>
          {statCard(
            <ReceiptLongOutlinedIcon />,
            "Total Orders",
            orders.length,
            "#eff6ff",
            "#1d4ed8"
          )}

          {statCard(
            <PaymentsOutlinedIcon />,
            "Total Revenue",
            formatPrice(getTotalSpent()),
            "#ecfdf5",
            "#047857"
          )}

          {statCard(
            <AssignmentTurnedInOutlinedIcon />,
            "Delivered Orders",
            orders.filter((order) => order.status === "Delivered").length,
            "#fef3c7",
            "#92400e"
          )}

          {statCard(
            <CancelOutlinedIcon />,
            "Cancelled Orders",
            orders.filter((order) => order.status === "Cancelled").length,
            "#fee2e2",
            "#dc2626"
          )}
        </Stack>

        {/* Orders */}
        {orders.length ? (
          <Stack spacing={3}>
            {orders.map((order, index) => {
              const address = getAddress(order);
              const statusMeta = getStatusMeta(order.status);
              const isEditing = editIndex === index;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "32px",
                      overflow: "hidden",
                      border: "1px solid rgba(15,23,42,0.08)",
                      background: "rgba(255,255,255,0.96)",
                      boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
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
                            width: 58,
                            height: 58,
                            minWidth: 58,
                            borderRadius: "18px",
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

                        <Stack sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontWeight: 950,
                              fontSize: is480 ? "1.1rem" : "1.35rem",
                              letterSpacing: "-.025em",
                            }}
                          >
                            Order #{order._id?.slice(-8)}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#64748b",
                              fontWeight: 800,
                              wordBreak: "break-all",
                              fontSize: ".9rem",
                            }}
                          >
                            {order._id}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={is480 ? "column" : "row"}
                        spacing={1}
                        alignItems={is480 ? "flex-start" : "center"}
                      >
                        <Chip
                          icon={<EventOutlinedIcon />}
                          label={formatDate(order.createdAt)}
                          sx={{
                            background: "#ffffff",
                            color: "#334155",
                            fontWeight: 900,
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        />

                        <Chip
                          icon={statusMeta.icon}
                          label={order.status || "Pending"}
                          sx={{
                            background: statusMeta.bg,
                            color: statusMeta.color,
                            fontWeight: 950,
                          }}
                        />

                        <Chip
                          label={formatPrice(order.total)}
                          sx={{
                            background: "#fef3c7",
                            color: "#92400e",
                            fontWeight: 950,
                          }}
                        />
                      </Stack>
                    </Stack>

                    {/* Order Content */}
                    <Stack
                      direction={is900 ? "column" : "row"}
                      spacing={3}
                      sx={{ p: is480 ? 2.2 : 3 }}
                    >
                      {/* Items */}
                      <Stack spacing={2} sx={{ flex: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Inventory2OutlinedIcon sx={{ color: "#64748b" }} />
                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontWeight: 950,
                              fontSize: "1.1rem",
                            }}
                          >
                            Ordered Items
                          </Typography>
                        </Stack>

                        <Stack spacing={1.5}>
                          {order.item?.map((item, itemIndex) => {
                            const product = item?.product || {};

                            return (
                              <Paper
                                key={item?._id || product?._id || itemIndex}
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  borderRadius: "20px",
                                  border: "1px solid rgba(15,23,42,0.08)",
                                  background: "#f8fafc",
                                }}
                              >
                                <Stack
                                  direction={is480 ? "column" : "row"}
                                  justifyContent="space-between"
                                  alignItems={is480 ? "flex-start" : "center"}
                                  spacing={1.5}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                  >
                                    <Avatar
                                      src={product?.thumbnail}
                                      variant="rounded"
                                      sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "18px",
                                        background: "#ffffff",
                                        color: "#0f172a",
                                        fontWeight: 950,
                                        border: "1px solid rgba(15,23,42,0.08)",
                                      }}
                                    >
                                      {product?.title?.charAt(0) || "P"}
                                    </Avatar>

                                    <Stack>
                                      <Typography
                                        sx={{
                                          color: "#0f172a",
                                          fontWeight: 950,
                                          fontSize: "1rem",
                                          lineHeight: 1.25,
                                        }}
                                      >
                                        {product?.title || "Product unavailable"}
                                      </Typography>

                                      <Typography
                                        sx={{
                                          color: "#64748b",
                                          fontWeight: 800,
                                          fontSize: ".85rem",
                                        }}
                                      >
                                        Qty: {item?.quantity || 1}
                                      </Typography>
                                    </Stack>
                                  </Stack>

                                  <Typography
                                    sx={{
                                      color: "#0f172a",
                                      fontWeight: 950,
                                      fontSize: "1.05rem",
                                    }}
                                  >
                                    {formatPrice(product?.price)}
                                  </Typography>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Stack>

                      <Divider orientation={is900 ? "horizontal" : "vertical"} flexItem />

                      {/* Details */}
                      <Stack spacing={2.2} sx={{ flex: 1 }}>
                        <Stack
                          spacing={1.5}
                          sx={{
                            p: 2,
                            borderRadius: "24px",
                            background: "#f8fafc",
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocalShippingOutlinedIcon
                              sx={{ color: "#64748b" }}
                            />
                            <Typography
                              sx={{
                                color: "#0f172a",
                                fontWeight: 950,
                              }}
                            >
                              Shipping Address
                            </Typography>
                          </Stack>

                          <Stack spacing={0.5}>
                            <Typography sx={{ color: "#334155", fontWeight: 800 }}>
                              {address?.street || "Street not available"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontWeight: 750 }}>
                              {address?.city || "City"}, {address?.state || "State"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontWeight: 750 }}>
                              Postal Code: {address?.postalCode || "N/A"}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontWeight: 750 }}>
                              Phone: {address?.phoneNumber || "N/A"}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          spacing={1.5}
                          sx={{
                            p: 2,
                            borderRadius: "24px",
                            background: "#ffffff",
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PaymentsOutlinedIcon sx={{ color: "#64748b" }} />
                            <Typography
                              sx={{
                                color: "#0f172a",
                                fontWeight: 950,
                              }}
                            >
                              Payment Details
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                              Payment Method
                            </Typography>
                            <Chip
                              label={order.paymentMode || "N/A"}
                              sx={{
                                background: "#fef3c7",
                                color: "#92400e",
                                fontWeight: 950,
                              }}
                            />
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                              Total Items
                            </Typography>
                            <Typography sx={{ color: "#0f172a", fontWeight: 950 }}>
                              {getItemsCount(order)}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                              Total Amount
                            </Typography>
                            <Typography
                              sx={{
                                color: "#0f172a",
                                fontWeight: 950,
                                fontSize: "1.25rem",
                              }}
                            >
                              {formatPrice(order.total)}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Status Update */}
                        <Stack
                          spacing={1.5}
                          sx={{
                            p: 2,
                            borderRadius: "24px",
                            background: "#ffffff",
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontWeight: 950,
                            }}
                          >
                            Update Order Status
                          </Typography>

                          {isEditing ? (
                            <Stack spacing={1.3}>
                              <FormControl fullWidth>
                                <InputLabel id={`status-select-${order._id}`}>
                                  Order Status
                                </InputLabel>
                                <Select
                                  labelId={`status-select-${order._id}`}
                                  label="Order Status"
                                  value={selectedStatus}
                                  onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                  }
                                  sx={{
                                    borderRadius: "16px",
                                    background: "#f8fafc",
                                    fontWeight: 850,
                                  }}
                                >
                                  {editOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <Stack
                                direction={is480 ? "column" : "row"}
                                spacing={1}
                              >
                                <LoadingButton
                                  fullWidth
                                  loading={isUpdating}
                                  onClick={() => handleUpdateOrder(order._id)}
                                  startIcon={<CheckCircleOutlinedIcon />}
                                  sx={{
                                    height: "3rem",
                                    borderRadius: "16px",
                                    background: "#111827",
                                    color: "#ffffff",
                                    textTransform: "none",
                                    fontWeight: 950,
                                    "&:hover": {
                                      background: "#000000",
                                    },
                                  }}
                                >
                                  Save Status
                                </LoadingButton>

                                <Button
                                  fullWidth
                                  onClick={handleCancelEdit}
                                  startIcon={<CloseOutlinedIcon />}
                                  sx={{
                                    height: "3rem",
                                    borderRadius: "16px",
                                    color: "#dc2626",
                                    background: "#fee2e2",
                                    textTransform: "none",
                                    fontWeight: 950,
                                    "&:hover": {
                                      background: "#fecaca",
                                    },
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Stack>
                          ) : (
                            <Button
                              onClick={() =>
                                handleStartEdit(index, order.status)
                              }
                              startIcon={<EditOutlinedIcon />}
                              sx={{
                                height: "3rem",
                                borderRadius: "16px",
                                background: "#111827",
                                color: "#ffffff",
                                textTransform: "none",
                                fontWeight: 950,
                                boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
                                "&:hover": {
                                  background: "#000000",
                                },
                              }}
                            >
                              Edit Status
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </motion.div>
              );
            })}
          </Stack>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: is480 ? 3 : 5,
              borderRadius: "34px",
              border: "1px solid rgba(15,23,42,0.08)",
              background: "#ffffff",
              boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
            }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: "55vh" }}
            >
              <Box sx={{ width: is480 ? "90%" : "24rem" }}>
                <Lottie animationData={noOrdersAnimation} />
              </Box>

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: is480 ? "1.4rem" : "2rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.04em",
                }}
              >
                No orders currently
              </Typography>

              <Typography
                sx={{
                  textAlign: "center",
                  color: "#64748b",
                  fontWeight: 750,
                }}
              >
                Customer orders will appear here once purchases are placed.
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};