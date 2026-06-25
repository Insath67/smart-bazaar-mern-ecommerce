import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../UserSlice";
import {
  addAddressAsync,
  resetAddressAddStatus,
  resetAddressDeleteStatus,
  resetAddressUpdateStatus,
  selectAddressAddStatus,
  selectAddressDeleteStatus,
  selectAddressStatus,
  selectAddressUpdateStatus,
  selectAddresses,
} from "../../address/AddressSlice";
import { Address } from "../../address/components/Address";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export const UserProfile = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const status = useSelector(selectAddressStatus);
  const userInfo = useSelector(selectUserInfo);
  const addresses = useSelector(selectAddresses) || [];

  const addressAddStatus = useSelector(selectAddressAddStatus);
  const addressUpdateStatus = useSelector(selectAddressUpdateStatus);
  const addressDeleteStatus = useSelector(selectAddressDeleteStatus);

  const theme = useTheme();

  const [addAddress, setAddAddress] = useState(false);

  const is1000 = useMediaQuery(theme.breakpoints.down(1000));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (addressAddStatus === "fulfilled") {
      toast.success("Address added");
    } else if (addressAddStatus === "rejected") {
      toast.error("Error adding address, please try again later");
    }
  }, [addressAddStatus]);

  useEffect(() => {
    if (addressUpdateStatus === "fulfilled") {
      toast.success("Address updated");
    } else if (addressUpdateStatus === "rejected") {
      toast.error("Error updating address, please try again later");
    }
  }, [addressUpdateStatus]);

  useEffect(() => {
    if (addressDeleteStatus === "fulfilled") {
      toast.success("Address deleted");
    } else if (addressDeleteStatus === "rejected") {
      toast.error("Error deleting address, please try again later");
    }
  }, [addressDeleteStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetAddressAddStatus());
      dispatch(resetAddressUpdateStatus());
      dispatch(resetAddressDeleteStatus());
    };
  }, [dispatch]);

  const handleAddAddress = (data) => {
    if (!userInfo?._id) {
      toast.error("User not found. Please login again.");
      return;
    }

    const address = {
      ...data,
      user: userInfo._id,
    };

    dispatch(addAddressAsync(address));
    setAddAddress(false);
    reset();
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
        px: is480 ? 2 : 4,
        py: is480 ? 3 : 6,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: "1250px",
          mx: "auto",
        }}
      >
        {/* Page Heading */}
        <Stack
          direction={is700 ? "column" : "row"}
          justifyContent="space-between"
          alignItems={is700 ? "flex-start" : "center"}
          spacing={2}
        >
          <Stack spacing={0.8}>
            <Chip
              label="Smart Bazaar Profile"
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
              My Profile
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: ".98rem",
              }}
            >
              Manage your Smart Bazaar account details and saved delivery
              addresses.
            </Typography>
          </Stack>

          <Chip
            icon={<VerifiedUserOutlinedIcon />}
            label="Verified Customer"
            sx={{
              background: "#ecfdf5",
              color: "#047857",
              fontWeight: 900,
              px: 1,
            }}
          />
        </Stack>

        <Stack
          direction={is1000 ? "column" : "row"}
          spacing={4}
          alignItems="flex-start"
        >
          {/* User Profile Card */}
          <Paper
            elevation={0}
            sx={{
              width: is1000 ? "100%" : "370px",
              borderRadius: "32px",
              overflow: "hidden",
              border: "1px solid rgba(15,23,42,0.08)",
              background: "rgba(255,255,255,0.94)",
              boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
              position: is1000 ? "static" : "sticky",
              top: "100px",
            }}
          >
            <Stack
              spacing={2.5}
              alignItems="center"
              sx={{
                p: is480 ? 3 : 4,
                background:
                  "radial-gradient(circle at top left, #f59e0b 0%, #111827 42%, #020617 100%)",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  bottom: "-90px",
                  right: "-80px",
                }}
              />

              <Avatar
                alt={userInfo?.name}
                sx={{
                  width: 92,
                  height: 92,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
                  color: "#111827",
                  fontWeight: 950,
                  fontSize: "2rem",
                  border: "4px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <Stack spacing={0.8} alignItems="center" sx={{ zIndex: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.7rem",
                    fontWeight: 950,
                    textAlign: "center",
                    letterSpacing: "-.04em",
                    lineHeight: 1.1,
                  }}
                >
                  {userInfo?.name || "Smart Bazaar User"}
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.74)",
                    fontWeight: 700,
                    textAlign: "center",
                    wordBreak: "break-all",
                  }}
                >
                  {userInfo?.email}
                </Typography>
              </Stack>

              <Chip
                label="Premium Online Shopper"
                sx={{
                  background: "rgba(255,255,255,0.13)",
                  color: "#ffffff",
                  fontWeight: 900,
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                  zIndex: 2,
                }}
              />
            </Stack>

            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
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
                  <PersonOutlineOutlinedIcon />
                </Box>

                <Stack>
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Username
                  </Typography>
                  <Typography sx={{ color: "#0f172a", fontWeight: 950 }}>
                    {userInfo?.name || "Not available"}
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1.5} alignItems="center">
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
                  <EmailOutlinedIcon />
                </Box>

                <Stack sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Email
                  </Typography>
                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontWeight: 950,
                      wordBreak: "break-all",
                    }}
                  >
                    {userInfo?.email || "Not available"}
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    background: "#ecfdf5",
                    color: "#047857",
                  }}
                >
                  <LocalShippingOutlinedIcon />
                </Box>

                <Stack>
                  <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                    Saved Addresses
                  </Typography>
                  <Typography sx={{ color: "#0f172a", fontWeight: 950 }}>
                    {addresses.length}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          {/* Address Management */}
          <Stack spacing={3} sx={{ flex: 1, width: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.94)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
                overflow: "hidden",
              }}
            >
              <Stack
                direction={is700 ? "column" : "row"}
                alignItems={is700 ? "flex-start" : "center"}
                justifyContent="space-between"
                spacing={2}
                sx={{
                  p: is480 ? 2.2 : 3,
                  borderBottom: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
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
                      background:
                        "linear-gradient(135deg, #111827 0%, #000000 70%, #f59e0b 160%)",
                      color: "#ffffff",
                      boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                    }}
                  >
                    <ManageAccountsOutlinedIcon />
                  </Box>

                  <Stack>
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: 950,
                        fontSize: "1.3rem",
                      }}
                    >
                      Manage Addresses
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                      Add, update, or remove your delivery addresses.
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  onClick={() => setAddAddress((prev) => !prev)}
                  startIcon={
                    addAddress ? <CloseOutlinedIcon /> : <AddLocationAltOutlinedIcon />
                  }
                  sx={{
                    height: "3rem",
                    borderRadius: "16px",
                    background: addAddress ? "#fee2e2" : "#111827",
                    color: addAddress ? "#dc2626" : "#ffffff",
                    textTransform: "none",
                    fontWeight: 950,
                    px: 2.5,
                    "&:hover": {
                      background: addAddress ? "#fecaca" : "#000000",
                    },
                  }}
                >
                  {addAddress ? "Close Form" : "Add Address"}
                </Button>
              </Stack>

              {/* Add Address Form */}
              {addAddress && (
                <Stack
                  component="form"
                  noValidate
                  spacing={2.2}
                  onSubmit={handleSubmit(handleAddAddress)}
                  sx={{
                    p: is480 ? 2.2 : 3,
                    borderBottom: "1px solid rgba(15,23,42,0.08)",
                  }}
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
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
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
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
                          {errors.phoneNumber.message}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  <Stack>
                    <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                      Street
                    </Typography>
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
                      <Typography
                        sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                      >
                        {errors.street.message}
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction={is700 ? "column" : "row"} spacing={2}>
                    <Stack sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                        Country
                      </Typography>
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
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
                          {errors.country.message}
                        </Typography>
                      )}
                    </Stack>

                    <Stack sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                        City
                      </Typography>
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
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
                          {errors.city.message}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  <Stack direction={is700 ? "column" : "row"} spacing={2}>
                    <Stack sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, mb: 0.8 }}>
                        State
                      </Typography>
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
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
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
                              <MarkunreadMailboxOutlinedIcon
                                sx={{ color: "#64748b" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />
                      {errors.postalCode && (
                        <Typography
                          sx={{ mt: 0.7, color: "#dc2626", fontSize: ".82rem" }}
                        >
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
                      loading={status === "pending"}
                      type="submit"
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
                      onClick={() => {
                        setAddAddress(false);
                        reset();
                      }}
                      sx={{
                        height: "3rem",
                        px: 3,
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              )}

              {/* Addresses List */}
              <Stack spacing={2} sx={{ p: is480 ? 2.2 : 3 }}>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <Paper
                      key={address._id}
                      elevation={0}
                      sx={{
                        borderRadius: "24px",
                        border: "1px solid rgba(15,23,42,0.08)",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        boxShadow: "0 12px 35px rgba(15,23,42,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <Address
                        id={address._id}
                        city={address.city}
                        country={address.country}
                        phoneNumber={address.phoneNumber}
                        postalCode={address.postalCode}
                        state={address.state}
                        street={address.street}
                        type={address.type}
                      />
                    </Paper>
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: "24px",
                      border: "1px dashed rgba(15,23,42,0.18)",
                      background: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: 950,
                        fontSize: "1.2rem",
                      }}
                    >
                      You have no saved addresses
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        mt: 0.8,
                      }}
                    >
                      Add your delivery address to make checkout faster.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};