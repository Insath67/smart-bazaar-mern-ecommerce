import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useDispatch, useSelector } from "react-redux";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistFetchStatus,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  resetWishlistItemUpdateStatus,
  selectWishlistFetchStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItemUpdateStatus,
  selectWishlistItems,
  updateWishlistItemByIdAsync,
} from "../WishlistSlice";
import { ProductCard } from "../../products/components/ProductCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { emptyWishlistAnimation, loadingAnimation } from "../../../assets";
import Lottie from "lottie-react";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { motion } from "framer-motion";

export const Wishlist = () => {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(selectWishlistItems) || [];
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
  const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus);
  const wishlistFetchStatus = useSelector(selectWishlistFetchStatus);

  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems) || [];
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);

  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");

  const theme = useTheme();
  const is1000 = useMediaQuery(theme.breakpoints.down(1000));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is560 = useMediaQuery(theme.breakpoints.down(560));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const wishlistCount = wishlistItems.length;

  const alreadyInCartCount = wishlistItems.filter((item) =>
    cartItems.some((cartItem) => {
      const cartProductId = cartItem?.product?._id || cartItem?.product;
      return cartProductId === item?.product?._id;
    })
  ).length;

  const lowStockCount = wishlistItems.filter(
    (item) => item?.product?.stockQuantity <= 20
  ).length;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

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
    if (wishlistItemUpdateStatus === "fulfilled") {
      toast.success("Wishlist note updated");
      setEditIndex(-1);
      setEditValue("");
    } else if (wishlistItemUpdateStatus === "rejected") {
      toast.error("Error updating wishlist note");
    }
  }, [wishlistItemUpdateStatus]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistFetchStatus === "rejected") {
      toast.error("Error fetching wishlist, please try again later");
    }
  }, [wishlistFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetWishlistFetchStatus());
      dispatch(resetCartItemAddStatus());
      dispatch(resetWishlistItemUpdateStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
    };
  }, [dispatch]);

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (!loggedInUser?._id) {
      toast.error("Please login to use wishlist");
      return;
    }

    if (e.target.checked) {
      const data = {
        user: loggedInUser._id,
        product: productId,
      };

      dispatch(createWishlistItemAsync(data));
    } else {
      const index = wishlistItems.findIndex(
        (item) => item?.product?._id === productId
      );

      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

  const handleEdit = (index) => {
    setEditValue(wishlistItems[index]?.note || "");
    setEditIndex(index);
  };

  const handleNoteUpdate = (wishlistItemId) => {
    const update = {
      _id: wishlistItemId,
      note: editValue,
    };

    dispatch(updateWishlistItemByIdAsync(update));
  };

  const handleAddToCart = (productId) => {
    if (!loggedInUser?._id) {
      toast.error("Please login to add product to cart");
      return;
    }

    const data = {
      user: loggedInUser._id,
      product: productId,
    };

    dispatch(addToCartAsync(data));
  };

  const isProductAlreadyInCart = (productId) => {
    return cartItems.some((cartItem) => {
      const cartProductId = cartItem?.product?._id || cartItem?.product;
      return cartProductId === productId;
    });
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
      {wishlistFetchStatus === "pending" ? (
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
                label="Smart Bazaar Wishlist"
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
                  My Wishlist
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: ".98rem",
                }}
              >
                Save your favorite products, add notes, and move them to cart anytime.
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
          {wishlistItems.length > 0 && (
            <Stack direction={is1000 ? "column" : "row"} spacing={2}>
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
                      background: "#fee2e2",
                      color: "#dc2626",
                    }}
                  >
                    <FavoriteBorderOutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Wishlist Items
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      {wishlistCount}
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
                    <ShoppingCartOutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Already In Cart
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      {alreadyInCartCount}
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
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  >
                    <Inventory2OutlinedIcon />
                  </Box>
                  <Stack>
                    <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
                      Low Stock Picks
                    </Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
                      {lowStockCount}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          )}

          {/* Empty Wishlist */}
          {wishlistItems.length === 0 ? (
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
                  <Lottie animationData={emptyWishlistAnimation} />
                </Box>

                <Typography
                  sx={{
                    fontSize: is480 ? "1.5rem" : "2rem",
                    fontWeight: 950,
                    color: "#0f172a",
                    letterSpacing: "-.04em",
                  }}
                >
                  Your wishlist is empty
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    maxWidth: 520,
                  }}
                >
                  Add products you love to your wishlist and come back later to buy them.
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
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {wishlistItems.map((item, index) => {
                const product = item.product;
                const productId = product?._id;
                const alreadyInCart = isProductAlreadyInCart(productId);

                return (
                  <Paper
                    key={item._id}
                    elevation={0}
                    sx={{
                      borderRadius: "30px",
                      overflow: "hidden",
                      border: "1px solid rgba(15,23,42,0.08)",
                      background: "rgba(255,255,255,0.94)",
                      boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        pt: 2.5,
                      }}
                    >
                      <ProductCard
                        brand={product?.brand?.name || product?.brand || "Smart Bazaar"}
                        id={productId}
                        price={product?.price}
                        stockQuantity={product?.stockQuantity}
                        thumbnail={product?.thumbnail}
                        title={product?.title}
                        handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                        isWishlistCard={true}
                      />
                    </Box>

                    <Divider />

                    <Stack spacing={2} sx={{ p: 2.4, flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "13px",
                              display: "grid",
                              placeItems: "center",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                            }}
                          >
                            <NoteAltOutlinedIcon fontSize="small" />
                          </Box>

                          <Typography
                            sx={{
                              color: "#0f172a",
                              fontWeight: 950,
                              fontSize: "1rem",
                            }}
                          >
                            Personal Note
                          </Typography>
                        </Stack>

                        <IconButton
                          onClick={() => handleEdit(index)}
                          sx={{
                            background: "#f8fafc",
                            border: "1px solid rgba(15,23,42,0.08)",
                            "&:hover": {
                              background: "#111827",
                              color: "#ffffff",
                            },
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {editIndex === index ? (
                        <Stack spacing={1.5}>
                          <TextField
                            multiline
                            rows={4}
                            value={editValue}
                            placeholder="Write a note for this product..."
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "18px",
                                background: "#f8fafc",
                                fontWeight: 700,
                              },
                            }}
                          />

                          <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            <Button
                              onClick={() => handleNoteUpdate(item._id)}
                              sx={{
                                borderRadius: "14px",
                                background: "#111827",
                                color: "#ffffff",
                                textTransform: "none",
                                fontWeight: 900,
                                px: 2,
                                "&:hover": {
                                  background: "#000000",
                                },
                              }}
                            >
                              Update
                            </Button>

                            <Button
                              onClick={() => {
                                setEditIndex(-1);
                                setEditValue("");
                              }}
                              color="error"
                              variant="outlined"
                              sx={{
                                borderRadius: "14px",
                                textTransform: "none",
                                fontWeight: 900,
                                px: 2,
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "18px",
                            background: "#f8fafc",
                            border: "1px solid rgba(15,23,42,0.08)",
                            minHeight: 78,
                          }}
                        >
                          <Typography
                            sx={{
                              wordWrap: "break-word",
                              color: item.note ? "#475569" : "#94a3b8",
                              fontWeight: 700,
                              lineHeight: 1.6,
                            }}
                          >
                            {item.note ? item.note : "Add a custom note here"}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: "auto" }}>
                        {alreadyInCart ? (
                          <Button
                            fullWidth
                            component={Link}
                            to="/cart"
                            startIcon={<ShoppingCartOutlinedIcon />}
                            sx={{
                              height: "3rem",
                              borderRadius: "16px",
                              background: "#ecfdf5",
                              color: "#047857",
                              textTransform: "none",
                              fontWeight: 950,
                              "&:hover": {
                                background: "#d1fae5",
                              },
                            }}
                          >
                            Already in Cart
                          </Button>
                        ) : (
                          <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              fullWidth
                              onClick={() => handleAddToCart(productId)}
                              startIcon={<ShoppingCartOutlinedIcon />}
                              sx={{
                                height: "3rem",
                                borderRadius: "16px",
                                background:
                                  "linear-gradient(135deg, #111827 0%, #000000 100%)",
                                color: "#ffffff",
                                textTransform: "none",
                                fontWeight: 950,
                                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #000000 0%, #111827 100%)",
                                },
                              }}
                            >
                              Add To Cart
                            </Button>
                          </motion.div>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};