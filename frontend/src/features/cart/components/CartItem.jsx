import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from "../CartSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CartItem = ({
  id,
  thumbnail,
  title,
  category,
  brand,
  price,
  quantity,
  stockQuantity,
  productId,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const is760 = useMediaQuery(theme.breakpoints.down(760));
  const is520 = useMediaQuery(theme.breakpoints.down(520));

  const itemTotal = Number(price) * Number(quantity);

  const handleAddQty = () => {
    if (quantity >= stockQuantity) {
      return;
    }

    const update = {
      _id: id,
      quantity: quantity + 1,
    };

    dispatch(updateCartItemByIdAsync(update));
  };

  const handleRemoveQty = () => {
    if (quantity === 1) {
      dispatch(deleteCartItemByIdAsync(id));
    } else {
      const update = {
        _id: id,
        quantity: quantity - 1,
      };

      dispatch(updateCartItemByIdAsync(update));
    }
  };

  const handleProductRemove = () => {
    dispatch(deleteCartItemByIdAsync(id));
  };

  return (
    <Stack
      direction={is760 ? "column" : "row"}
      alignItems={is760 ? "stretch" : "center"}
      justifyContent="space-between"
      spacing={is760 ? 2.5 : 3}
      sx={{
        p: is520 ? 2 : 2.5,
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      }}
    >
      {/* Product image and details */}
      <Stack
        direction={is520 ? "column" : "row"}
        alignItems={is520 ? "stretch" : "center"}
        spacing={2.4}
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Box
          component={Link}
          to={`/product-details/${productId}`}
          sx={{
            width: is520 ? "100%" : 170,
            minWidth: is520 ? "100%" : 170,
            aspectRatio: is520 ? "4 / 3" : "1 / 1",
            borderRadius: "20px",
            overflow: "hidden",
            background:
              "radial-gradient(circle at top left, #ffffff 0%, #f3f4f6 45%, #e5e7eb 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
            textDecoration: "none",
            display: "block",
          }}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={thumbnail}
            alt={`${title} image unavailable`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        <Stack spacing={1.1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
            {brand && (
              <Chip
                label={brand}
                size="small"
                sx={{
                  width: "fit-content",
                  background: "#111827",
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              />
            )}

            {category && (
              <Chip
                label={category}
                size="small"
                sx={{
                  width: "fit-content",
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 900,
                }}
              />
            )}
          </Stack>

          <Typography
            component={Link}
            to={`/product-details/${productId}`}
            sx={{
              textDecoration: "none",
              color: "#0f172a",
              fontSize: is520 ? "1.25rem" : "1.45rem",
              fontWeight: 950,
              letterSpacing: "-.035em",
              lineHeight: 1.15,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": {
                color: "#f59e0b",
              },
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 700,
              fontSize: ".92rem",
            }}
          >
            Unit Price: ${price}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.4}
            flexWrap="wrap"
            rowGap={1}
          >
            <Typography
              sx={{
                color: "#0f172a",
                fontWeight: 900,
                fontSize: ".92rem",
              }}
            >
              Quantity
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{
                height: 42,
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(15,23,42,0.12)",
                background: "#ffffff",
              }}
            >
              <IconButton
                onClick={handleRemoveQty}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 0,
                  color: "#0f172a",
                  "&:hover": {
                    background: "#fee2e2",
                    color: "#dc2626",
                  },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  width: 46,
                  height: 42,
                  display: "grid",
                  placeItems: "center",
                  borderLeft: "1px solid rgba(15,23,42,0.08)",
                  borderRight: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <Typography sx={{ fontWeight: 950 }}>{quantity}</Typography>
              </Box>

              <IconButton
                onClick={handleAddQty}
                disabled={quantity >= stockQuantity}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 0,
                  color: "#ffffff",
                  background: quantity >= stockQuantity ? "#94a3b8" : "#111827",
                  "&:hover": {
                    background:
                      quantity >= stockQuantity ? "#94a3b8" : "#000000",
                  },
                  "&.Mui-disabled": {
                    color: "#ffffff",
                    background: "#94a3b8",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>

            {stockQuantity <= 20 && (
              <Typography
                sx={{
                  color: stockQuantity <= 10 ? "#dc2626" : "#f59e0b",
                  fontWeight: 800,
                  fontSize: ".85rem",
                }}
              >
                {stockQuantity <= 10
                  ? `Only ${stockQuantity} left`
                  : "Only few left"}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Price and remove section */}
      <Stack
        alignItems={is760 ? "stretch" : "flex-end"}
        justifyContent="space-between"
        spacing={2}
        sx={{
          minWidth: is760 ? "100%" : 170,
        }}
      >
        <Stack alignItems={is760 ? "flex-start" : "flex-end"} spacing={0.4}>
          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 800,
              fontSize: ".85rem",
            }}
          >
            Item Total
          </Typography>

          <Typography
            sx={{
              color: "#0f172a",
              fontWeight: 950,
              fontSize: "1.6rem",
              letterSpacing: "-.04em",
            }}
          >
            ${itemTotal}
          </Typography>
        </Stack>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleProductRemove}
            startIcon={<DeleteOutlineOutlinedIcon />}
            fullWidth={is760}
            sx={{
              height: 44,
              px: 2.2,
              borderRadius: "14px",
              background: "#111827",
              color: "#ffffff",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "0 12px 25px rgba(0,0,0,0.16)",
              "&:hover": {
                background: "#dc2626",
                boxShadow: "0 14px 30px rgba(220,38,38,0.25)",
              },
            }}
          >
            Remove
          </Button>
        </motion.div>
      </Stack>
    </Stack>
  );
};