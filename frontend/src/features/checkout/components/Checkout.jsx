import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState } from "react";
import { Cart } from "../../cart/components/Cart";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddressAsync,
  selectAddressStatus,
  selectAddresses,
} from "../../address/AddressSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectOrderStatus,
} from "../../order/OrderSlice";
import {
  resetCartByUserIdAsync,
  selectCartItems,
} from "../../cart/CartSlice";
import { SHIPPING, TAXES } from "../../../constants";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export const Checkout = () => {
  const addresses = useSelector(selectAddresses) || [];
  const loggedInUser = useSelector(selectLoggedInUser);
  const addressStatus = useSelector(selectAddressStatus);
  const cartItems = useSelector(selectCartItems) || [];
  const orderStatus = useSelector(selectOrderStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const orderTotal = cartItems.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );

  const finalTotal = orderTotal + SHIPPING + TAXES;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (addressStatus === "fulfilled") {
      toast.success("Address added successfully");
      reset();
    } else if (addressStatus === "rejected") {
      toast.error("Error adding your address");
    }
  }, [addressStatus, reset]);

  useEffect(() => {
    if (currentOrder && currentOrder?._id) {
      dispatch(resetCartByUserIdAsync(loggedInUser?._id));
      navigate(`/order-success/${currentOrder?._id}`);
    }
  }, [currentOrder, dispatch, loggedInUser, navigate]);

  const handleAddAddress = (data) => {
    if (!loggedInUser?._id) {
      toast.error("Please login before adding address");
      navigate("/login");
      return;
    }

    const address = {
      ...data,
      user: loggedInUser._id,
    };

    dispatch(addAddressAsync(address));
  };

  const handleCreateOrder = () => {
    if (!loggedInUser?._id) {
      toast.error("Please login before placing order");
      navigate("/login");
      return;
    }

    if (!selectedAddress?._id) {
      toast.error("Please select or add a shipping address");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    const order = {
      user: loggedInUser._id,
      item: cartItems,
      address: selectedAddress,
      paymentMode: selectedPaymentMethod,
      total: finalTotal,
    };

    dispatch(createOrderAsync(order));
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      background: "#f8fafc",
      fontWeight: 700,
    },
  };

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
          maxWidth: "1450px",
          mx: "auto",
        }}
      >
        {/* Page heading */}
        <Stack
          direction={is700 ? "column" : "row"}
          justifyContent="space-between"
          alignItems={is700 ? "flex-start" : "center"}
          spacing={2}
        >
          <Stack spacing={0.8}>
            <Chip
              label="Smart Bazaar Checkout"
              sx={{
                width: "fit-content",
                background: "#111827",
                color: "#ffffff",
                fontWeight: 900,
              }}
            />

            <Stack direction="row" alignItems="center" spacing={1.2}>
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  component={Link}
                  to="/cart"
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

              <Typography
                sx={{
                  fontSize: is480 ? "2rem" : "2.8rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.055em",
                  lineHeight: 1,
                }}
              >
                Checkout
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: ".98rem",
              }}
            >
              Add your shipping details, select payment method, and place your
              order securely.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.2} flexWrap="wrap" rowGap={1}>
            <Chip
              icon={<LocalShippingOutlinedIcon />}
              label="Fast Delivery"
              sx={{
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 900,
              }}
            />

            <Chip
              icon={<VerifiedUserOutlinedIcon />}
              label="Secure Checkout"
              sx={{
                background: "#ecfdf5",
                color: "#047857",
                fontWeight: 900,
              }}
            />
          </Stack>
        </Stack>

        <Stack
          direction={is1100 ? "column" : "row"}
          spacing={4}
          alignItems="flex-start"
        >
          {/* Left section */}
          <Stack spacing={4} sx={{ flex: 1, width: "100%" }}>
            {/* Address form */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.94)",
                overflow: "hidden",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  p: is480 ? 2.2 : 3,
                  borderBottom: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                }}
              >
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
                  <AddLocationAltOutlinedIcon />
                </Box>

                <Stack>
                  <Typography
                    sx={{
                      fontWeight: 950,
                      color: "#0f172a",
                      fontSize: "1.25rem",
                    }}
                  >
                    Shipping Information
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: ".9rem",
                    }}
                  >
                    Add a new delivery address.
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                component="form"
                noValidate
                spacing={2.2}
                onSubmit={handleSubmit(handleAddAddress)}
                sx={{ p: is480 ? 2.2 : 3 }}
              >
                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                      Address Type
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Eg. Home, Business"
                      {...register("type", {
                        required: "Address type is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeWorkOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.type && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.type.message}
                      </Typography>
                    )}
                  </Stack>

                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Eg. 0760209715"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.phoneNumber && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.phoneNumber.message}
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack>
                  <Typography sx={{ fontWeight: 900, mb: 0.8 }}>Street</Typography>
                  <TextField
                    fullWidth
                    placeholder="Street address"
                    {...register("street", {
                      required: "Street is required",
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldSx}
                  />
                  {errors.street && (
                    <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                      {errors.street.message}
                    </Typography>
                  )}
                </Stack>

                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>Country</Typography>
                    <TextField
                      fullWidth
                      placeholder="Country"
                      {...register("country", {
                        required: "Country is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PublicOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.country && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.country.message}
                      </Typography>
                    )}
                  </Stack>

                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>City</Typography>
                    <TextField
                      fullWidth
                      placeholder="City"
                      {...register("city", {
                        required: "City is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ApartmentOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.city && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.city.message}
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>State</Typography>
                    <TextField
                      fullWidth
                      placeholder="State"
                      {...register("state", {
                        required: "State is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.state && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.state.message}
                      </Typography>
                    )}
                  </Stack>

                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                      Postal Code
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Postal code"
                      {...register("postalCode", {
                        required: "Postal code is required",
                      })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MarkunreadMailboxOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                    {errors.postalCode && (
                      <Typography sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}>
                        {errors.postalCode.message}
                      </Typography>
                    )}
                  </Stack>
                </Stack>

                <Stack
                  direction={is480 ? "column" : "row"}
                  justifyContent="flex-end"
                  spacing={1.2}
                  pt={1}
                >
                  <LoadingButton
                    loading={addressStatus === "pending"}
                    type="submit"
                    variant="contained"
                    sx={{
                      height: "3rem",
                      px: 3,
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #111827 0%, #000000 100%)",
                      color: "#ffffff",
                      fontWeight: 950,
                      textTransform: "none",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #000000 0%, #111827 100%)",
                      },
                    }}
                  >
                    Add Address
                  </LoadingButton>

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => reset()}
                    sx={{
                      height: "3rem",
                      px: 3,
                      borderRadius: "16px",
                      fontWeight: 900,
                      textTransform: "none",
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Existing addresses */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.94)",
                p: is480 ? 2.2 : 3,
              }}
            >
              <Stack spacing={2.5}>
                <Stack>
                  <Typography
                    sx={{
                      fontSize: "1.45rem",
                      fontWeight: 950,
                      color: "#0f172a",
                      letterSpacing: "-.035em",
                    }}
                  >
                    Saved Addresses
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                    Choose from your existing delivery addresses.
                  </Typography>
                </Stack>

                {addresses.length === 0 ? (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "22px",
                      border: "1px dashed rgba(15,23,42,0.2)",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: "#64748b" }}>
                      No saved addresses yet. Add one using the form above.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {addresses.map((address) => (
                      <Grid item xs={12} md={6} key={address._id}>
                        <FormControl fullWidth>
                          <Paper
                            elevation={0}
                            onClick={() => setSelectedAddress(address)}
                            sx={{
                              p: 2,
                              minHeight: "185px",
                              borderRadius: "22px",
                              cursor: "pointer",
                              border:
                                selectedAddress?._id === address._id
                                  ? "2px solid #111827"
                                  : "1px solid rgba(15,23,42,0.08)",
                              background:
                                selectedAddress?._id === address._id
                                  ? "linear-gradient(135deg, #ffffff 0%, #fef3c7 130%)"
                                  : "#ffffff",
                              boxShadow:
                                selectedAddress?._id === address._id
                                  ? "0 18px 45px rgba(15,23,42,0.12)"
                                  : "0 10px 25px rgba(15,23,42,0.05)",
                              transition: "all .25s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
                              },
                            }}
                          >
                            <Stack spacing={1.4}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Radio
                                    checked={selectedAddress?._id === address._id}
                                    name="addressRadioGroup"
                                    onChange={() => setSelectedAddress(address)}
                                  />
                                  <Typography
                                    sx={{
                                      fontWeight: 950,
                                      color: "#0f172a",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {address.type}
                                  </Typography>
                                </Stack>

                                {selectedAddress?._id === address._id && (
                                  <Chip
                                    label="Selected"
                                    size="small"
                                    sx={{
                                      background: "#111827",
                                      color: "#ffffff",
                                      fontWeight: 900,
                                    }}
                                  />
                                )}
                              </Stack>

                              <Divider />

                              <Stack spacing={0.7}>
                                <Typography sx={{ color: "#475569", fontWeight: 700 }}>
                                  {address.street}
                                </Typography>
                                <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                                  {address.state}, {address.city}, {address.country},{" "}
                                  {address.postalCode}
                                </Typography>
                                <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                                  {address.phoneNumber}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Paper>
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            </Paper>

            {/* Payment methods */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.94)",
                p: is480 ? 2.2 : 3,
              }}
            >
              <Stack spacing={2.5}>
                <Stack>
                  <Typography
                    sx={{
                      fontSize: "1.45rem",
                      fontWeight: 950,
                      color: "#0f172a",
                      letterSpacing: "-.035em",
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                    Select how you want to pay for your order.
                  </Typography>
                </Stack>

                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <Paper
                    elevation={0}
                    onClick={() => setSelectedPaymentMethod("COD")}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "22px",
                      cursor: "pointer",
                      border:
                        selectedPaymentMethod === "COD"
                          ? "2px solid #111827"
                          : "1px solid rgba(15,23,42,0.08)",
                      background:
                        selectedPaymentMethod === "COD"
                          ? "linear-gradient(135deg, #ffffff 0%, #fef3c7 130%)"
                          : "#ffffff",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <Radio
                        checked={selectedPaymentMethod === "COD"}
                        onChange={() => setSelectedPaymentMethod("COD")}
                      />
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          background: "#fef3c7",
                          color: "#92400e",
                        }}
                      >
                        <PaymentsOutlinedIcon />
                      </Box>
                      <Stack>
                        <Typography sx={{ fontWeight: 950 }}>Cash</Typography>
                        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                          Pay when order arrives
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    onClick={() => setSelectedPaymentMethod("CARD")}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "22px",
                      cursor: "pointer",
                      border:
                        selectedPaymentMethod === "CARD"
                          ? "2px solid #111827"
                          : "1px solid rgba(15,23,42,0.08)",
                      background:
                        selectedPaymentMethod === "CARD"
                          ? "linear-gradient(135deg, #ffffff 0%, #eff6ff 130%)"
                          : "#ffffff",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <Radio
                        checked={selectedPaymentMethod === "CARD"}
                        onChange={() => setSelectedPaymentMethod("CARD")}
                      />
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                        }}
                      >
                        <CreditCardOutlinedIcon />
                      </Box>
                      <Stack>
                        <Typography sx={{ fontWeight: 950 }}>Card</Typography>
                        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                          Card payment option
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Paper>
          </Stack>

          {/* Right order summary */}
          <Paper
            elevation={0}
            sx={{
              width: is1100 ? "100%" : "430px",
              position: is1100 ? "static" : "sticky",
              top: "100px",
              borderRadius: "32px",
              border: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
              boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
              overflow: "hidden",
            }}
          >
            <Stack spacing={2.5} sx={{ p: is480 ? 2.2 : 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.4}>
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
                  <ShoppingBagOutlinedIcon />
                </Box>

                <Stack>
                  <Typography
                    sx={{
                      fontSize: "1.55rem",
                      fontWeight: 950,
                      letterSpacing: "-.04em",
                      color: "#0f172a",
                    }}
                  >
                    Order Summary
                  </Typography>

                  <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                    Review your order before placing.
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Cart checkout={true} />

              <LoadingButton
                fullWidth
                loading={orderStatus === "pending"}
                onClick={handleCreateOrder}
                size="large"
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
                Pay and Place Order
              </LoadingButton>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  textAlign: "center",
                }}
              >
                By placing the order, you confirm your shipping details and
                selected payment method.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};