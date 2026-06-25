import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductUpdateStatus,
  selectProductUpdateStatus,
  selectSelectedProduct,
  updateProductByIdAsync,
} from "../../products/ProductSlice";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategoriesSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

export const ProductUpdate = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const selectedProduct = useSelector(selectSelectedProduct);
  const brands = useSelector(selectBrands) || [];
  const categories = useSelector(selectCategories) || [];
  const productUpdateStatus = useSelector(selectProductUpdateStatus);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const isUpdating =
    productUpdateStatus === "pending" || productUpdateStatus === "loading";

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      reset({
        title: selectedProduct?.title || "",
        brand: selectedProduct?.brand?._id || selectedProduct?.brand || "",
        category:
          selectedProduct?.category?._id || selectedProduct?.category || "",
        description: selectedProduct?.description || "",
        price: selectedProduct?.price || "",
        discountPercentage: selectedProduct?.discountPercentage || "",
        stockQuantity: selectedProduct?.stockQuantity || "",
        thumbnail: selectedProduct?.thumbnail || "",
        image0: selectedProduct?.images?.[0] || "",
        image1: selectedProduct?.images?.[1] || "",
        image2: selectedProduct?.images?.[2] || "",
        image3: selectedProduct?.images?.[3] || "",
      });
    }
  }, [selectedProduct, reset]);

  useEffect(() => {
    if (
      productUpdateStatus === "fulfilled" ||
      productUpdateStatus === "fullfilled"
    ) {
      toast.success("Product updated");
      navigate("/admin/dashboard");
    } else if (productUpdateStatus === "rejected") {
      toast.error("Error updating product, please try again later");
    }
  }, [productUpdateStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
    };
  }, [dispatch]);

  const handleProductUpdate = (data) => {
    if (!selectedProduct?._id) {
      toast.error("Product not found");
      return;
    }

    const images = [data.image0, data.image1, data.image2, data.image3].filter(
      (image) => image && image.trim() !== ""
    );

    const productUpdate = {
      ...data,
      _id: selectedProduct._id,
      price: Number(data.price),
      discountPercentage: Number(data.discountPercentage),
      stockQuantity: Number(data.stockQuantity),
      images: images.length > 0 ? images : selectedProduct.images || [],
    };

    delete productUpdate.image0;
    delete productUpdate.image1;
    delete productUpdate.image2;
    delete productUpdate.image3;

    dispatch(updateProductByIdAsync(productUpdate));
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      background: "#f8fafc",
      fontWeight: 700,
    },
  };

  const sectionTitle = (icon, title, subtitle) => (
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
        {icon}
      </Box>

      <Stack>
        <Typography
          sx={{
            color: "#0f172a",
            fontWeight: 950,
            fontSize: "1.25rem",
            letterSpacing: "-.02em",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 700,
            fontSize: ".9rem",
          }}
        >
          {subtitle}
        </Typography>
      </Stack>
    </Stack>
  );

  if (!selectedProduct) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography sx={{ fontWeight: 900, color: "#64748b" }}>
            Loading product details...
          </Typography>
        </Stack>
      </Box>
    );
  }

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
          maxWidth: "1180px",
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

            <Stack direction="row" alignItems="center" spacing={1.2}>
              {!is480 && (
                <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/admin/dashboard"
                    sx={{
                      minWidth: 0,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#ffffff",
                      border: "1px solid rgba(15,23,42,0.1)",
                      color: "#111827",
                      boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                      "&:hover": {
                        background: "#111827",
                        color: "#ffffff",
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </Button>
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
                Update Product
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: ".98rem",
              }}
            >
              Edit product details and keep your Smart Bazaar catalogue updated.
            </Typography>
          </Stack>

          <Button
            component={Link}
            to="/admin/dashboard"
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{
              height: "3rem",
              borderRadius: "16px",
              background: "#ffffff",
              color: "#111827",
              border: "1px solid rgba(15,23,42,0.12)",
              textTransform: "none",
              fontWeight: 950,
              px: 2.5,
              boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
              "&:hover": {
                background: "#111827",
                color: "#ffffff",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Stack>

        {/* Main Form Card */}
        <Paper
          elevation={0}
          component="form"
          noValidate
          onSubmit={handleSubmit(handleProductUpdate)}
          sx={{
            borderRadius: "34px",
            overflow: "hidden",
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
          }}
        >
          {/* Card Header */}
          <Stack
            direction={is700 ? "column" : "row"}
            justifyContent="space-between"
            alignItems={is700 ? "flex-start" : "center"}
            spacing={2}
            sx={{
              p: is480 ? 2.4 : 3.2,
              borderBottom: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            {sectionTitle(
              <EditOutlinedIcon />,
              "Product Update Information",
              "Modify product details carefully before saving."
            )}

            <Chip
              icon={<UpdateOutlinedIcon />}
              label="Editing Catalogue Item"
              sx={{
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 950,
                px: 1,
              }}
            />
          </Stack>

          {/* Form Fields */}
          <Stack spacing={3} sx={{ p: is480 ? 2.4 : 3.2 }}>
            {/* Basic Info */}
            <Paper
              elevation={0}
              sx={{
                p: is480 ? 2 : 2.6,
                borderRadius: "26px",
                border: "1px solid rgba(15,23,42,0.08)",
                background: "#ffffff",
              }}
            >
              <Stack spacing={2.4}>
                <Stack>
                  <Typography sx={{ fontWeight: 950, mb: 1 }}>
                    Product Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Eg. iPhone 15 Pro Max"
                    {...register("title", {
                      required: "Title is required",
                    })}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleOutlinedIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Stack>

                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <FormControl fullWidth error={Boolean(errors.brand)}>
                    <InputLabel id="brand-selection">Brand</InputLabel>
                    <Select
                      {...register("brand", {
                        required: "Brand is required",
                      })}
                      labelId="brand-selection"
                      label="Brand"
                      defaultValue={
                        selectedProduct?.brand?._id || selectedProduct?.brand || ""
                      }
                      sx={{
                        borderRadius: "16px",
                        background: "#f8fafc",
                        fontWeight: 800,
                      }}
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.brand && (
                      <FormHelperText>{errors.brand.message}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={Boolean(errors.category)}>
                    <InputLabel id="category-selection">Category</InputLabel>
                    <Select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      labelId="category-selection"
                      label="Category"
                      defaultValue={
                        selectedProduct?.category?._id ||
                        selectedProduct?.category ||
                        ""
                      }
                      sx={{
                        borderRadius: "16px",
                        background: "#f8fafc",
                        fontWeight: 800,
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>

                <Stack>
                  <Typography sx={{ fontWeight: 950, mb: 1 }}>
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Write product description..."
                    {...register("description", {
                      required: "Description is required",
                    })}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionOutlinedIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Pricing */}
            <Paper
              elevation={0}
              sx={{
                p: is480 ? 2 : 2.6,
                borderRadius: "26px",
                border: "1px solid rgba(15,23,42,0.08)",
                background: "#ffffff",
              }}
            >
              <Stack spacing={2.4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "15px",
                      display: "grid",
                      placeItems: "center",
                      background: "#ecfdf5",
                      color: "#047857",
                    }}
                  >
                    <AttachMoneyOutlinedIcon />
                  </Box>

                  <Stack>
                    <Typography sx={{ fontWeight: 950, color: "#0f172a" }}>
                      Pricing & Stock
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        fontSize: ".88rem",
                      }}
                    >
                      Update price, discount and available stock.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction={is700 ? "column" : "row"} spacing={2}>
                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 950, mb: 1 }}>
                      Price
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Eg. 549"
                      {...register("price", {
                        required: "Price is required",
                      })}
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Stack>

                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 950, mb: 1 }}>
                      Discount Percentage
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Eg. 18"
                      {...register("discountPercentage", {
                        required: "Discount percentage is required",
                      })}
                      error={Boolean(errors.discountPercentage)}
                      helperText={errors.discountPercentage?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentOutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Stack>

                  <Stack sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 950, mb: 1 }}>
                      Stock Quantity
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="Eg. 50"
                      {...register("stockQuantity", {
                        required: "Stock quantity is required",
                      })}
                      error={Boolean(errors.stockQuantity)}
                      helperText={errors.stockQuantity?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Inventory2OutlinedIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>

            {/* Images */}
            <Paper
              elevation={0}
              sx={{
                p: is480 ? 2 : 2.6,
                borderRadius: "26px",
                border: "1px solid rgba(15,23,42,0.08)",
                background: "#ffffff",
              }}
            >
              <Stack spacing={2.4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "15px",
                      display: "grid",
                      placeItems: "center",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                    }}
                  >
                    <PhotoLibraryOutlinedIcon />
                  </Box>

                  <Stack>
                    <Typography sx={{ fontWeight: 950, color: "#0f172a" }}>
                      Product Images
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        fontSize: ".88rem",
                      }}
                    >
                      Update thumbnail and gallery image URLs. Extra image fields are optional.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack>
                  <Typography sx={{ fontWeight: 950, mb: 1 }}>
                    Thumbnail URL
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Paste thumbnail image URL"
                    {...register("thumbnail", {
                      required: "Thumbnail is required",
                    })}
                    error={Boolean(errors.thumbnail)}
                    helperText={errors.thumbnail?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageOutlinedIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {[0, 1, 2, 3].map((index) => (
                    <Stack key={index}>
                      <Typography sx={{ fontWeight: 950, mb: 1 }}>
                        Image URL {index + 1}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder={`Paste product image URL ${index + 1}`}
                        {...register(`image${index}`)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ImageOutlinedIcon sx={{ color: "#64748b" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </Paper>

            <Divider />

            {/* Action Buttons */}
            <Stack
              direction={is480 ? "column" : "row"}
              justifyContent="flex-end"
              spacing={1.2}
            >
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                <LoadingButton
                  loading={isUpdating}
                  type="submit"
                  startIcon={<SaveOutlinedIcon />}
                  sx={{
                    height: "3.2rem",
                    px: 3,
                    width: is480 ? "100%" : "auto",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 950,
                    boxShadow: "0 16px 32px rgba(0,0,0,0.18)",
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
                component={Link}
                to="/admin/dashboard"
                startIcon={<CloseOutlinedIcon />}
                sx={{
                  height: "3.2rem",
                  px: 3,
                  borderRadius: "16px",
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
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};