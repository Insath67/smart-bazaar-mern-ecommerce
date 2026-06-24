import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct,
} from "../ProductSlice";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from "../../review/ReviewSlice";
import { Reviews } from "../../review/components/Reviews";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import MobileStepper from "@mui/material/MobileStepper";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["#020202", "#F6F6F6", "#B82222", "#BEA9A9", "#E2BB8D"];
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const ProductDetails = () => {
  const { id } = useParams();

  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const reviews = useSelector(selectReviews) || [];

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is380 = useMediaQuery(theme.breakpoints.down(380));

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const productImages = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.thumbnail) return [product.thumbnail];
    return [];
  }, [product]);

  const maxSteps = productImages.length || 1;

  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  const totalReviewRating = reviews.reduce(
    (acc, review) => acc + Number(review.rating || 0),
    0
  );
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? Math.ceil(totalReviewRating / totalReviews) : 0;

  const oldPrice = product?.price ? Math.round(Number(product.price) * 1.18) : 0;

  const stockText =
    product?.stockQuantity <= 10
      ? `Only ${product?.stockQuantity} left`
      : product?.stockQuantity <= 20
      ? "Only few left"
      : "In Stock";

  const stockColor =
    product?.stockQuantity <= 10
      ? "#dc2626"
      : product?.stockQuantity <= 20
      ? "#f59e0b"
      : "#059669";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (id) {
      setQuantity(1);
      setSelectedImageIndex(0);
      setActiveStep(0);
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error("Error removing product from wishlist, please try again later");
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching product details, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    if (reviewFetchStatus === "rejected") {
      toast.error("Error fetching product reviews, please try again later");
    }
  }, [reviewFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const handleAddToCart = () => {
    if (!loggedInUser?._id) {
      toast.error("Please login to add product to cart");
      navigate("/login");
      return;
    }

    const item = {
      user: loggedInUser._id,
      product: id,
      quantity,
    };

    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleDecreaseQty = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    const maxQuantity = Math.min(20, product?.stockQuantity || 1);

    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (!loggedInUser?._id) {
      toast.error("Please login to use wishlist");
      navigate("/login");
      return;
    }

    if (e.target.checked) {
      const data = {
        user: loggedInUser._id,
        product: id,
      };

      dispatch(createWishlistItemAsync(data));
    } else {
      const index = wishlistItems.findIndex((item) => item?.product?._id === id);

      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, maxSteps - 1)
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const isLoading =
    productFetchStatus === "pending" || reviewFetchStatus === "pending";

  return (
    <>
      {!(productFetchStatus === "rejected" && reviewFetchStatus === "rejected") && (
        <Box
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
            py: is600 ? 3 : 6,
            px: is600 ? 2 : 4,
          }}
        >
          {isLoading ? (
            <Stack
              width={is480 ? "35vh" : "25rem"}
              height="calc(100vh - 4rem)"
              justifyContent="center"
              alignItems="center"
              mx="auto"
            >
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : (
            <Stack
              spacing={5}
              sx={{
                maxWidth: "1450px",
                mx: "auto",
              }}
            >
              {/* Product details premium card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "34px",
                  overflow: "hidden",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  boxShadow: "0 28px 80px rgba(15, 23, 42, 0.10)",
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Stack
                  direction={is900 ? "column" : "row"}
                  spacing={is900 ? 3 : 5}
                  sx={{
                    p: is480 ? 2 : is1200 ? 4 : 5,
                  }}
                >
                  {/* Left image gallery */}
                  <Stack
                    direction={is1200 ? "column" : "row"}
                    spacing={2}
                    sx={{
                      flex: 1.15,
                      minWidth: 0,
                    }}
                  >
                    {/* Desktop thumbnails */}
                    {!is1200 && (
                      <Stack
                        spacing={1.5}
                        sx={{
                          width: "115px",
                          maxHeight: "620px",
                          overflowY: "auto",
                          pr: 1,
                        }}
                      >
                        {productImages.map((image, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedImageIndex(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                aspectRatio: "1 / 1",
                                borderRadius: "18px",
                                overflow: "hidden",
                                background: "#f8fafc",
                                border:
                                  selectedImageIndex === index
                                    ? "2px solid #111827"
                                    : "1px solid rgba(15,23,42,0.08)",
                                boxShadow:
                                  selectedImageIndex === index
                                    ? "0 12px 30px rgba(15,23,42,0.18)"
                                    : "none",
                              }}
                            >
                              <img
                                src={image}
                                alt={`${product?.title} thumbnail`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </Box>
                          </motion.div>
                        ))}
                      </Stack>
                    )}

                    {/* Main image */}
                    <Paper
                      elevation={0}
                      sx={{
                        flex: 1,
                        borderRadius: "30px",
                        overflow: "hidden",
                        background:
                          "radial-gradient(circle at top left, #ffffff 0%, #f3f4f6 45%, #e5e7eb 100%)",
                        border: "1px solid rgba(15,23,42,0.08)",
                        position: "relative",
                        minHeight: is480 ? "320px" : "520px",
                      }}
                    >
                      <Chip
                        label="Premium Pick"
                        sx={{
                          position: "absolute",
                          top: 18,
                          left: 18,
                          zIndex: 4,
                          background: "rgba(255,255,255,0.92)",
                          fontWeight: 900,
                          border: "1px solid rgba(15,23,42,0.08)",
                          backdropFilter: "blur(10px)",
                        }}
                      />

                      {is1200 ? (
                        <Stack>
                          <AutoPlaySwipeableViews
                            width="100%"
                            height="100%"
                            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                          >
                            {productImages.map((image, index) => (
                              <Box key={index} sx={{ width: "100%" }}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                  <Box
                                    component="img"
                                    sx={{
                                      width: "100%",
                                      objectFit: "cover",
                                      overflow: "hidden",
                                      aspectRatio: is480 ? "1 / 1" : "4 / 3",
                                      display: "block",
                                    }}
                                    src={image}
                                    alt={product?.title}
                                  />
                                ) : null}
                              </Box>
                            ))}
                          </AutoPlaySwipeableViews>

                          <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            sx={{
                              background: "rgba(255,255,255,0.75)",
                              backdropFilter: "blur(10px)",
                            }}
                            nextButton={
                              <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                              >
                                Next
                                {theme.direction === "rtl" ? (
                                  <KeyboardArrowLeft />
                                ) : (
                                  <KeyboardArrowRight />
                                )}
                              </Button>
                            }
                            backButton={
                              <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                              >
                                {theme.direction === "rtl" ? (
                                  <KeyboardArrowRight />
                                ) : (
                                  <KeyboardArrowLeft />
                                )}
                                Back
                              </Button>
                            }
                          />
                        </Stack>
                      ) : (
                        <motion.img
                          key={productImages[selectedImageIndex]}
                          initial={{ opacity: 0.6, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          src={productImages[selectedImageIndex]}
                          alt={`${product?.title} image`}
                          style={{
                            width: "100%",
                            height: "100%",
                            minHeight: "620px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      )}
                    </Paper>
                  </Stack>

                  {/* Right product info */}
                  <Stack
                    spacing={2.4}
                    sx={{
                      flex: 0.85,
                      minWidth: is900 ? "100%" : "380px",
                      justifyContent: "center",
                    }}
                  >
                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={product?.brand?.name || product?.brand || "Smart Bazaar"}
                          sx={{
                            background: "#111827",
                            color: "#ffffff",
                            fontWeight: 900,
                          }}
                        />

                        {product?.category?.name && (
                          <Chip
                            label={product.category.name}
                            sx={{
                              background: "#fef3c7",
                              color: "#92400e",
                              fontWeight: 800,
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: is480 ? "2rem" : "2.65rem",
                          fontWeight: 950,
                          color: "#0f172a",
                          letterSpacing: "-.055em",
                          lineHeight: 1.05,
                        }}
                      >
                        {product?.title}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        flexWrap="wrap"
                        rowGap={1}
                      >
                        <Rating value={averageRating} readOnly />

                        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                          (
                          {totalReviews === 0
                            ? "No reviews"
                            : totalReviews === 1
                            ? `${totalReviews} Review`
                            : `${totalReviews} Reviews`}
                          )
                        </Typography>

                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.6,
                            borderRadius: "999px",
                            background: `${stockColor}18`,
                            color: stockColor,
                            fontWeight: 900,
                            fontSize: ".85rem",
                          }}
                        >
                          {stockText}
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Typography
                          sx={{
                            fontSize: "2rem",
                            fontWeight: 950,
                            color: "#030712",
                          }}
                        >
                          ${product?.price}
                        </Typography>

                        {oldPrice > 0 && (
                          <Typography
                            sx={{
                              color: "#9ca3af",
                              fontSize: "1.05rem",
                              textDecoration: "line-through",
                              fontWeight: 800,
                            }}
                          >
                            ${oldPrice}
                          </Typography>
                        )}

                        <Chip
                          label="Save 18%"
                          size="small"
                          sx={{
                            background: "#ecfdf5",
                            color: "#047857",
                            fontWeight: 900,
                          }}
                        />
                      </Stack>
                    </Stack>

                    <Divider />

                    <Typography
                      sx={{
                        color: "#475569",
                        lineHeight: 1.8,
                        fontWeight: 600,
                        fontSize: ".98rem",
                      }}
                    >
                      {product?.description}
                    </Typography>

                    {!loggedInUser?.isAdmin && (
                      <Stack spacing={2.2}>
                        {/* Colors */}
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                            Select Color
                          </Typography>

                          <Stack direction="row" spacing={1}>
                            {COLORS.map((color, index) => (
                              <Box
                                key={color}
                                onClick={() => setSelectedColorIndex(index)}
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: "50%",
                                  display: "grid",
                                  placeItems: "center",
                                  cursor: "pointer",
                                  border:
                                    selectedColorIndex === index
                                      ? "2px solid #111827"
                                      : "1px solid rgba(15,23,42,0.16)",
                                  background: "#ffffff",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    backgroundColor: color,
                                    border:
                                      color === "#F6F6F6"
                                        ? "1px solid #cbd5e1"
                                        : "none",
                                  }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Stack>

                        {/* Sizes */}
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                            Select Size
                          </Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                            {SIZES.map((size) => (
                              <motion.div
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  width: is380 ? "42px" : "48px",
                                  height: is380 ? "42px" : "48px",
                                  borderRadius: "14px",
                                  display: "grid",
                                  placeItems: "center",
                                  cursor: "pointer",
                                  fontWeight: 900,
                                  background:
                                    selectedSize === size ? "#111827" : "#f8fafc",
                                  color:
                                    selectedSize === size ? "#ffffff" : "#0f172a",
                                  border:
                                    selectedSize === size
                                      ? "1px solid #111827"
                                      : "1px solid rgba(15,23,42,0.12)",
                                }}
                              >
                                {size}
                              </motion.div>
                            ))}
                          </Stack>
                        </Stack>

                        {/* Quantity and actions */}
                        <Stack
                          direction={is480 ? "column" : "row"}
                          spacing={1.4}
                          alignItems={is480 ? "stretch" : "center"}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              width: is480 ? "100%" : "150px",
                              height: "54px",
                              borderRadius: "16px",
                              border: "1px solid rgba(15,23,42,0.12)",
                              background: "#f8fafc",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              onClick={handleDecreaseQty}
                              style={{
                                width: "45px",
                                height: "100%",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "1.4rem",
                                fontWeight: 900,
                              }}
                            >
                              -
                            </button>

                            <Typography sx={{ fontWeight: 950 }}>{quantity}</Typography>

                            <button
                              onClick={handleIncreaseQty}
                              style={{
                                width: "45px",
                                height: "100%",
                                border: "none",
                                background: "#111827",
                                color: "#ffffff",
                                cursor: "pointer",
                                fontSize: "1.4rem",
                                fontWeight: 900,
                              }}
                            >
                              +
                            </button>
                          </Stack>

                          {isProductAlreadyInCart ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate("/cart")}
                              style={{
                                flex: 1,
                                height: "54px",
                                borderRadius: "16px",
                                border: "none",
                                background:
                                  "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                                color: "#ffffff",
                                fontWeight: 900,
                                fontSize: "1rem",
                                cursor: "pointer",
                              }}
                            >
                              View Cart
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleAddToCart}
                              style={{
                                flex: 1,
                                height: "54px",
                                borderRadius: "16px",
                                border: "none",
                                background:
                                  "linear-gradient(135deg, #111827 0%, #000000 100%)",
                                color: "#ffffff",
                                fontWeight: 900,
                                fontSize: "1rem",
                                cursor: "pointer",
                                boxShadow: "0 16px 32px rgba(0,0,0,0.18)",
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                              >
                                <ShoppingCartOutlinedIcon fontSize="small" />
                                <span>Add To Cart</span>
                              </Stack>
                            </motion.button>
                          )}

                          <Box
                            sx={{
                              width: is480 ? "100%" : 54,
                              height: 54,
                              borderRadius: "16px",
                              display: "grid",
                              placeItems: "center",
                              border: "1px solid rgba(15,23,42,0.12)",
                              background: "#ffffff",
                            }}
                          >
                            <Checkbox
                              checked={isProductAlreadyInWishlist}
                              onChange={handleAddRemoveFromWishlist}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite sx={{ color: "#e11d48" }} />}
                            />
                          </Box>
                        </Stack>
                      </Stack>
                    )}

                    {/* Product perks */}
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 1,
                        borderRadius: "22px",
                        border: "1px solid rgba(15,23,42,0.08)",
                        overflow: "hidden",
                        background: "#ffffff",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ p: 2 }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            background: "#fef3c7",
                            color: "#92400e",
                          }}
                        >
                          <LocalShippingOutlinedIcon />
                        </Box>

                        <Stack>
                          <Typography sx={{ fontWeight: 900 }}>
                            Free Delivery
                          </Typography>
                          <Typography sx={{ color: "#64748b", fontSize: ".9rem" }}>
                            Fast delivery available for selected locations.
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider />

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ p: 2 }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            background: "#ecfdf5",
                            color: "#047857",
                          }}
                        >
                          <CachedOutlinedIcon />
                        </Box>

                        <Stack>
                          <Typography sx={{ fontWeight: 900 }}>
                            Easy Returns
                          </Typography>
                          <Typography sx={{ color: "#64748b", fontSize: ".9rem" }}>
                            Free 30-day return policy for eligible products.
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider />

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ p: 2 }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                          }}
                        >
                          <VerifiedOutlinedIcon />
                        </Box>

                        <Stack>
                          <Typography sx={{ fontWeight: 900 }}>
                            Quality Checked
                          </Typography>
                          <Typography sx={{ color: "#64748b", fontSize: ".9rem" }}>
                            Products are verified before listing.
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Stack>
                </Stack>
              </Paper>

              {/* Reviews */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "30px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
                  background: "#ffffff",
                  p: is480 ? 2 : 4,
                }}
              >
                <Stack spacing={1.5} mb={3}>
                  <Typography
                    sx={{
                      fontSize: is480 ? "1.7rem" : "2.1rem",
                      fontWeight: 950,
                      letterSpacing: "-.04em",
                      color: "#0f172a",
                    }}
                  >
                    Customer Reviews
                  </Typography>

                  <Typography sx={{ color: "#64748b", fontWeight: 600 }}>
                    See what customers say about this product.
                  </Typography>
                </Stack>

                <Reviews productId={id} averageRating={averageRating} />
              </Paper>
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};