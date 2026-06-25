import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddressByIdAsync,
  selectAddressStatus,
  updateAddressByIdAsync,
} from "../AddressSlice";

import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion } from "framer-motion";

export const Address = ({
  id,
  type,
  street,
  postalCode,
  country,
  phoneNumber,
  state,
  city,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const status = useSelector(selectAddressStatus);
  const [edit, setEdit] = useState(false);

  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const defaultValues = {
    type: type || "",
    street: street || "",
    postalCode: postalCode || "",
    country: country || "",
    phoneNumber: phoneNumber || "",
    state: state || "",
    city: city || "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const handleRemoveAddress = () => {
    dispatch(deleteAddressByIdAsync(id));
  };

  const handleStartEdit = () => {
    reset(defaultValues);
    setEdit(true);
  };

  const handleCancelEdit = () => {
    reset(defaultValues);
    setEdit(false);
  };

  const handleUpdateAddress = (data) => {
    const update = {
      ...data,
      _id: id,
    };

    setEdit(false);
    dispatch(updateAddressByIdAsync(update));
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      background: "#f8fafc",
      fontWeight: 700,
    },
  };

  const detailItem = (icon, label, value) => (
    <Stack
      direction="row"
      spacing={1.4}
      alignItems="flex-start"
      sx={{
        p: 1.6,
        borderRadius: "18px",
        background: "#f8fafc",
        border: "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          color: "#64748b",
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        {icon}
      </Box>

      <Stack sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 800,
            fontSize: ".78rem",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: "#0f172a",
            fontWeight: 900,
            wordBreak: "break-word",
            lineHeight: 1.35,
          }}
        >
          {value || "Not provided"}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(handleUpdateAddress)}
      sx={{
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      }}
    >
      {/* Header */}
      <Stack
        direction={is480 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={is480 ? "flex-start" : "center"}
        spacing={1.5}
        sx={{
          p: is480 ? 2 : 2.4,
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
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
            <LocalShippingOutlinedIcon />
          </Box>

          <Stack>
            <Typography
              sx={{
                color: "#0f172a",
                fontWeight: 950,
                fontSize: "1.15rem",
                letterSpacing: "-.02em",
              }}
            >
              {type ? `${type.toUpperCase()} Address` : "Saved Address"}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: ".88rem",
              }}
            >
              Delivery details for Smart Bazaar checkout
            </Typography>
          </Stack>
        </Stack>

        <Chip
          label={type ? type.toUpperCase() : "ADDRESS"}
          sx={{
            width: "fit-content",
            background: "#111827",
            color: "#ffffff",
            fontWeight: 950,
            borderRadius: "999px",
          }}
        />
      </Stack>

      {/* Content */}
      <Stack spacing={2.2} sx={{ p: is480 ? 2 : 2.4 }}>
        {edit ? (
          <Stack spacing={2.2}>
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
                  placeholder="Phone number"
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
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.6,
            }}
          >
            {detailItem(
              <LocationOnOutlinedIcon fontSize="small" />,
              "Street",
              street
            )}

            {detailItem(
              <MarkunreadMailboxOutlinedIcon fontSize="small" />,
              "Postal Code",
              postalCode
            )}

            {detailItem(<PublicOutlinedIcon fontSize="small" />, "Country", country)}

            {detailItem(
              <PhoneOutlinedIcon fontSize="small" />,
              "Phone Number",
              phoneNumber
            )}

            {detailItem(<MapOutlinedIcon fontSize="small" />, "State", state)}

            {detailItem(<ApartmentOutlinedIcon fontSize="small" />, "City", city)}
          </Box>
        )}

        <Divider />

        {/* Action Buttons */}
        <Stack
          direction={is480 ? "column" : "row"}
          justifyContent="flex-end"
          spacing={1.2}
        >
          {edit ? (
            <>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LoadingButton
                  loading={status === "pending"}
                  type="submit"
                  startIcon={<SaveOutlinedIcon />}
                  sx={{
                    height: "2.8rem",
                    px: 2.4,
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 950,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #000000 0%, #111827 100%)",
                    },
                  }}
                >
                  Save Changes
                </LoadingButton>
              </motion.div>

              <Button
                onClick={handleCancelEdit}
                startIcon={<CloseOutlinedIcon />}
                sx={{
                  height: "2.8rem",
                  px: 2.4,
                  borderRadius: "14px",
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
            </>
          ) : (
            <>
              <Button
                onClick={handleStartEdit}
                startIcon={<EditOutlinedIcon />}
                sx={{
                  height: "2.8rem",
                  px: 2.4,
                  borderRadius: "14px",
                  background: "#111827",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: 950,
                  boxShadow: "0 12px 25px rgba(0,0,0,0.14)",
                  "&:hover": {
                    background: "#000000",
                  },
                }}
              >
                Edit
              </Button>

              <LoadingButton
                loading={status === "pending"}
                onClick={handleRemoveAddress}
                startIcon={<DeleteOutlineOutlinedIcon />}
                sx={{
                  height: "2.8rem",
                  px: 2.4,
                  borderRadius: "14px",
                  color: "#dc2626",
                  background: "#ffffff",
                  border: "1px solid rgba(220,38,38,0.25)",
                  textTransform: "none",
                  fontWeight: 950,
                  "&:hover": {
                    background: "#fee2e2",
                  },
                }}
              >
                Remove
              </LoadingButton>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};