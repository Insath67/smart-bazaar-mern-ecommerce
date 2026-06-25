import {
  Box,
  Chip,
  FormHelperText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { addToCartAsync, selectCartItems } from "../../cart/CartSlice";
import { motion } from "framer-motion";

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector(selectWishlistItems) || [];
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];

  const theme = useTheme();
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is408 = useMediaQuery(theme.breakpoints.down(408));

  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const numericPrice = Number(price) || 0;
  const oldPrice = Math.round(numericPrice * 1.18);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!loggedInUser?._id) {
      navigate("/login");
      return;
    }

    const data = {
      user: loggedInUser._id,
      product: id,
    };

    dispatch(addToCartAsync(data));
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();

    if (handleAddRemoveFromWishlist) {
      handleAddRemoveFromWishlist(e, id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={0}
        onClick={() => navigate(`/product-details/${id}`)}
        sx={{
          width: is408 ? "100%" : is488 ? "220px" : "300px",
          maxWidth: is408 ? "100%" : "300px",
          height: "100%",
          cursor: "pointer",
          borderRadius: "22px",
          overflow: "hidden",
          border: "1px solid rgba(17, 24, 39, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)",
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
          transition: "all 0.3s ease",
          position: "relative",
          "&:hover": {
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.15)",
            borderColor: "rgba(0,0,0,0.16)",
          },
        }}
      >
        {/* Top badges */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 3,
          }}
        >

          {!isAdminCard && (
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.94)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Checkbox
                checked={isProductAlreadyInWishlist}
                onChange={handleWishlistClick}
                icon={<FavoriteBorder sx={{ fontSize: 21 }} />}
                checkedIcon={<Favorite sx={{ color: "#e11d48", fontSize: 21 }} />}
                sx={{ p: 0 }}
              />
            </Box>
          )}
        </Stack>

        {/* Image section */}
        <Box
          sx={{
            p: 1.5,
            background:
              "radial-gradient(circle at top left, #ffffff 0%, #f3f4f6 45%, #e5e7eb 100%)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "4 / 3",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.35 }}
              src={thumbnail}
              alt={`${title} photo unavailable`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Stack spacing={1.1} sx={{ p: 1.8 }}>
          <Typography
            sx={{
              fontSize: is408 ? ".96rem" : "1.02rem",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.25,
              minHeight: "2.55em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              fontWeight: 600,
              fontSize: ".88rem",
              textTransform: "capitalize",
            }}
          >
            {brand}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pt: 0.8 }}
          >
            <Stack spacing={0.2}>
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.15rem",
                    color: "#030712",
                  }}
                >
                  ${price}
                </Typography>

                <Typography
                  sx={{
                    color: "#9ca3af",
                    fontSize: ".82rem",
                    textDecoration: "line-through",
                    fontWeight: 600,
                  }}
                >
                  ${oldPrice}
                </Typography>
              </Stack>

              {!isAdminCard && !isWishlistCard && stockQuantity <= 20 && (
                <FormHelperText sx={{ fontSize: ".78rem", m: 0 }} error>
                  {stockQuantity === 1
                    ? "Only 1 stock is left"
                    : "Only few are left"}
                </FormHelperText>
              )}
            </Stack>

            {!isWishlistCard &&
              !isAdminCard &&
              (isProductAlreadyInCart ? (
                <Box
                  sx={{
                    px: 1.7,
                    py: 0.9,
                    borderRadius: "13px",
                    background: "#ecfdf5",
                    color: "#047857",
                    fontWeight: 800,
                    fontSize: ".78rem",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Added
                </Box>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  style={{
                    padding: is408 ? "9px 11px" : "10px 15px",
                    borderRadius: "13px",
                    outline: "none",
                    border: "none",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    color: "white",
                    fontSize: is408 ? ".74rem" : ".82rem",
                    fontWeight: 800,
                    boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add To Cart
                </motion.button>
              ))}
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
};