import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategoriesSlice";
import { ProductCard } from "../../products/components/ProductCard";
import {
  deleteProductByIdAsync,
  fetchProductsAsync,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
  undeleteProductByIdAsync,
} from "../../products/ProductSlice";
import { ITEMS_PER_PAGE } from "../../../constants";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

export const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const brands = useSelector(selectBrands) || [];
  const categories = useSelector(selectCategories) || [];
  const products = useSelector(selectProducts) || [];
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const totalResults = useSelector(selectProductTotalResults) || 0;

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const safeTotalResults = totalResults || products.length || 0;
  const totalPages = Math.ceil(safeTotalResults / ITEMS_PER_PAGE) || 1;

  const activeProducts = products.filter((product) => !product.isDeleted).length;
  const deletedProducts = products.filter((product) => product.isDeleted).length;

  const activeFilterCount =
    (filters.brand?.length || 0) +
    (filters.category?.length || 0) +
    (sort ? 1 : 0);

  const showingStart =
    safeTotalResults === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;

  const showingEnd =
    page * ITEMS_PER_PAGE > safeTotalResults
      ? safeTotalResults
      : page * ITEMS_PER_PAGE;

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };

    finalFilters.pagination = {
      page: page,
      limit: ITEMS_PER_PAGE,
    };

    finalFilters.sort = sort;

    dispatch(fetchProductsAsync(finalFilters));
  }, [dispatch, filters, sort, page]);

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand || []);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    setFilters({
      ...filters,
      brand: Array.from(filterSet),
    });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category || []);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    setFilters({
      ...filters,
      category: Array.from(filterSet),
    });
  };

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync(productId));
  };

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId));
  };

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };

  const handleFilterOpen = () => {
    if (!isProductFilterOpen) {
      dispatch(toggleFilters());
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSort(null);
    setPage(1);
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
            width: 48,
            height: 48,
            borderRadius: "16px",
            display: "grid",
            placeItems: "center",
            background: bg,
            color: color,
          }}
        >
          {icon}
        </Box>

        <Stack>
          <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 950 }}>
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      {/* Filter Drawer Backdrop */}
      {isProductFilterOpen && (
        <Box
          onClick={handleFilterClose}
          sx={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.34)",
            backdropFilter: "blur(6px)",
            zIndex: 499,
          }}
        />
      )}

      {/* Filter Drawer */}
      <motion.div
        style={{
          position: "fixed",
          backgroundColor: "white",
          height: "100vh",
          overflowY: "auto",
          width: is500 ? "100vw" : "30rem",
          zIndex: 500,
          top: 0,
          boxShadow: "0 30px 90px rgba(15,23,42,0.22)",
        }}
        variants={{
          show: { left: 0 },
          hide: { left: -560 },
        }}
        initial="hide"
        transition={{ ease: "easeInOut", duration: 0.45, type: "spring" }}
        animate={isProductFilterOpen ? "show" : "hide"}
      >
        <Stack
          spacing={3}
          sx={{
            minHeight: "100%",
            p: is500 ? 2.2 : 3,
            background:
              "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
          }}
        >
          {/* Drawer Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Stack spacing={0.8}>
              <Chip
                label="Admin Filters"
                sx={{
                  width: "fit-content",
                  background: "#111827",
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              />

              <Typography
                sx={{
                  fontSize: "2.2rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.055em",
                  lineHeight: 1,
                }}
              >
                Product Filters
              </Typography>

              <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                Filter Smart Bazaar products by brand and category.
              </Typography>
            </Stack>

            <IconButton
              onClick={handleFilterClose}
              sx={{
                background: "#f8fafc",
                border: "1px solid rgba(15,23,42,0.08)",
                "&:hover": {
                  background: "#111827",
                  color: "#ffffff",
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Stack>

          <Divider />

          {/* Quick Collections */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "24px",
              border: "1px solid rgba(15,23,42,0.08)",
              background: "#ffffff",
            }}
          >
            <Typography
              sx={{
                color: "#0f172a",
                fontWeight: 950,
                mb: 1.5,
              }}
            >
              Quick Collections
            </Typography>

            <Stack spacing={1}>
              {[
                "Totes",
                "Backpacks",
                "Travel Bags",
                "Hip Bags",
                "Laptop Sleeves",
              ].map((item) => (
                <motion.div
                  key={item}
                  style={{ width: "fit-content" }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Typography
                    sx={{
                      cursor: "pointer",
                      color: "#475569",
                      fontWeight: 800,
                      fontSize: ".95rem",
                    }}
                  >
                    {item}
                  </Typography>
                </motion.div>
              ))}
            </Stack>
          </Paper>

          {/* Brand Filters */}
          <Accordion
            elevation={0}
            sx={{
              borderRadius: "22px !important",
              overflow: "hidden",
              border: "1px solid rgba(15,23,42,0.08)",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="brand-filters"
              id="brand-filters"
              sx={{
                background: "#ffffff",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <BrandingWatermarkOutlinedIcon sx={{ color: "#92400e" }} />
                <Typography sx={{ fontWeight: 950 }}>Brands</Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
              <FormGroup>
                {brands?.map((brand) => (
                  <motion.div
                    key={brand._id}
                    style={{ width: "fit-content" }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FormControlLabel
                      sx={{
                        ml: 0,
                        "& .MuiFormControlLabel-label": {
                          fontWeight: 800,
                          color: "#334155",
                        },
                      }}
                      control={
                        <Checkbox
                          checked={filters.brand?.includes(brand._id) || false}
                          onChange={handleBrandFilters}
                          value={brand._id}
                        />
                      }
                      label={brand.name}
                    />
                  </motion.div>
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Category Filters */}
          <Accordion
            elevation={0}
            sx={{
              borderRadius: "22px !important",
              overflow: "hidden",
              border: "1px solid rgba(15,23,42,0.08)",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="category-filters"
              id="category-filters"
              sx={{
                background: "#ffffff",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CategoryOutlinedIcon sx={{ color: "#1d4ed8" }} />
                <Typography sx={{ fontWeight: 950 }}>Categories</Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
              <FormGroup>
                {categories?.map((category) => (
                  <motion.div
                    key={category._id}
                    style={{ width: "fit-content" }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FormControlLabel
                      sx={{
                        ml: 0,
                        "& .MuiFormControlLabel-label": {
                          fontWeight: 800,
                          color: "#334155",
                        },
                      }}
                      control={
                        <Checkbox
                          checked={
                            filters.category?.includes(category._id) || false
                          }
                          onChange={handleCategoryFilters}
                          value={category._id}
                        />
                      }
                      label={category.name}
                    />
                  </motion.div>
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          <Stack direction="row" spacing={1.2}>
            <Button
              fullWidth
              onClick={handleResetFilters}
              sx={{
                height: "3rem",
                borderRadius: "16px",
                background: "#ffffff",
                color: "#111827",
                border: "1px solid rgba(15,23,42,0.12)",
                textTransform: "none",
                fontWeight: 950,
                "&:hover": {
                  background: "#f8fafc",
                },
              }}
            >
              Reset Filters
            </Button>

            <Button
              fullWidth
              onClick={handleFilterClose}
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
              Apply
            </Button>
          </Stack>
        </Stack>
      </motion.div>

      {/* Main Admin Dashboard */}
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #f8fafc 100%)",
          px: is488 ? 2 : 4,
          py: is600 ? 3 : 5,
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
                  fontSize: is488 ? "2rem" : "2.8rem",
                  fontWeight: 950,
                  color: "#0f172a",
                  letterSpacing: "-.055em",
                  lineHeight: 1,
                }}
              >
                Admin Dashboard
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: ".98rem",
                }}
              >
                Manage products, update inventory, and control product visibility.
              </Typography>
            </Stack>

            <Stack
              direction={is488 ? "column" : "row"}
              spacing={1.2}
              sx={{ width: is488 ? "100%" : "auto" }}
            >
              <Button
                fullWidth={is488}
                onClick={handleFilterOpen}
                startIcon={<FilterListRoundedIcon />}
                sx={{
                  height: "3rem",
                  borderRadius: "16px",
                  background: "#ffffff",
                  color: "#111827",
                  border: "1px solid rgba(15,23,42,0.12)",
                  textTransform: "none",
                  fontWeight: 950,
                  boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                  "&:hover": {
                    background: "#111827",
                    color: "#ffffff",
                  },
                }}
              >
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </Button>

              <Button
                fullWidth={is488}
                component={Link}
                to="/admin/orders"
                startIcon={<ReceiptLongOutlinedIcon />}
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
                Manage Orders
              </Button>

              <Button
                fullWidth={is488}
                component={Link}
                to="/admin/add-product"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{
                  height: "3rem",
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
                Add Product
              </Button>
            </Stack>
          </Stack>

          {/* Stats */}
          <Stack direction={is1200 ? "column" : "row"} spacing={2}>
            {statCard(
              <ShoppingBagOutlinedIcon />,
              "Showing Products",
              products.length,
              "#eff6ff",
              "#1d4ed8"
            )}

            {statCard(
              <Inventory2OutlinedIcon />,
              "Active Products",
              activeProducts,
              "#ecfdf5",
              "#047857"
            )}

            {statCard(
              <DeleteOutlineOutlinedIcon />,
              "Deleted Products",
              deletedProducts,
              "#fee2e2",
              "#dc2626"
            )}
          </Stack>

          {/* Toolbar */}
          <Paper
            elevation={0}
            sx={{
              p: is488 ? 2 : 2.5,
              borderRadius: "26px",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
              background: "#ffffff",
            }}
          >
            <Stack
              direction={is700 ? "column" : "row"}
              justifyContent="space-between"
              alignItems={is700 ? "stretch" : "center"}
              spacing={2}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "15px",
                    display: "grid",
                    placeItems: "center",
                    background: "#fef3c7",
                    color: "#92400e",
                  }}
                >
                  <SortRoundedIcon />
                </Box>

                <Stack>
                  <Typography sx={{ color: "#0f172a", fontWeight: 950 }}>
                    Product Controls
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: ".88rem",
                    }}
                  >
                    Sort and manage your product catalogue.
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction={is488 ? "column" : "row"}
                spacing={1.2}
                alignItems={is488 ? "stretch" : "center"}
              >
                <FormControl sx={{ minWidth: is488 ? "100%" : "15rem" }}>
                  <InputLabel id="sort-dropdown">Sort products</InputLabel>
                  <Select
                    labelId="sort-dropdown"
                    label="Sort products"
                    onChange={(e) => setSort(e.target.value || null)}
                    value={sort || ""}
                    sx={{
                      borderRadius: "16px",
                      fontWeight: 800,
                      background: "#f8fafc",
                    }}
                  >
                    <MenuItem value="">Reset sorting</MenuItem>
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name} value={option}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  onClick={handleResetFilters}
                  sx={{
                    height: "3.5rem",
                    borderRadius: "16px",
                    background: "#f8fafc",
                    color: "#111827",
                    border: "1px solid rgba(15,23,42,0.08)",
                    textTransform: "none",
                    fontWeight: 950,
                    px: 2,
                    "&:hover": {
                      background: "#111827",
                      color: "#ffffff",
                    },
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Products Grid */}
          {products.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {products.map((product) => (
                <Paper
                  key={product._id}
                  elevation={0}
                  sx={{
                    borderRadius: "30px",
                    overflow: "hidden",
                    border: product.isDeleted
                      ? "1px solid rgba(220,38,38,0.22)"
                      : "1px solid rgba(15,23,42,0.08)",
                    background: "rgba(255,255,255,0.94)",
                    boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {product.isDeleted && (
                    <Chip
                      label="Deleted"
                      sx={{
                        position: "absolute",
                        top: 18,
                        left: 18,
                        zIndex: 5,
                        background: "#fee2e2",
                        color: "#dc2626",
                        fontWeight: 950,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pt: 2.5,
                      opacity: product.isDeleted ? 0.45 : 1,
                      filter: product.isDeleted ? "grayscale(1)" : "none",
                    }}
                  >
                    <ProductCard
                      id={product._id}
                      title={product.title}
                      thumbnail={product.thumbnail}
                      brand={
                        product.brand?.name || product.brand || "Smart Bazaar"
                      }
                      price={product.price}
                      stockQuantity={product.stockQuantity}
                      isAdminCard={true}
                    />
                  </Box>

                  <Divider />

                  <Stack
                    direction={is488 ? "column" : "row"}
                    spacing={1.2}
                    sx={{
                      p: 2.2,
                      mt: "auto",
                    }}
                  >
                    <Button
                      fullWidth
                      component={Link}
                      to={`/admin/product-update/${product._id}`}
                      startIcon={<EditOutlinedIcon />}
                      sx={{
                        height: "3rem",
                        borderRadius: "16px",
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
                      Update
                    </Button>

                    {product.isDeleted === true ? (
                      <Button
                        fullWidth
                        onClick={() => handleProductUnDelete(product._id)}
                        startIcon={<RestoreFromTrashOutlinedIcon />}
                        sx={{
                          height: "3rem",
                          borderRadius: "16px",
                          color: "#047857",
                          background: "#ecfdf5",
                          textTransform: "none",
                          fontWeight: 950,
                          "&:hover": {
                            background: "#d1fae5",
                          },
                        }}
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        onClick={() => handleProductDelete(product._id)}
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        sx={{
                          height: "3rem",
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
                        Delete
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: is488 ? 3 : 5,
                borderRadius: "32px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.09)",
                background: "#ffffff",
                textAlign: "center",
              }}
            >
              <Stack alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "24px",
                    display: "grid",
                    placeItems: "center",
                    background: "#f8fafc",
                    color: "#64748b",
                  }}
                >
                  <Inventory2OutlinedIcon fontSize="large" />
                </Box>

                <Typography
                  sx={{
                    fontSize: is488 ? "1.5rem" : "2rem",
                    fontWeight: 950,
                    color: "#0f172a",
                    letterSpacing: "-.04em",
                  }}
                >
                  No products found
                </Typography>

                <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                  Try resetting filters or add a new product to your catalogue.
                </Typography>

                <Stack
                  direction={is488 ? "column" : "row"}
                  spacing={1.2}
                  justifyContent="center"
                  sx={{ mt: 1 }}
                >
                  <Button
                    component={Link}
                    to="/admin/orders"
                    startIcon={<ReceiptLongOutlinedIcon />}
                    sx={{
                      height: "3rem",
                      px: 3,
                      borderRadius: "16px",
                      background: "#ffffff",
                      color: "#111827",
                      border: "1px solid rgba(15,23,42,0.12)",
                      fontWeight: 950,
                      textTransform: "none",
                      "&:hover": {
                        background: "#111827",
                        color: "#ffffff",
                      },
                    }}
                  >
                    Manage Orders
                  </Button>

                  <Button
                    component={Link}
                    to="/admin/add-product"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    sx={{
                      height: "3rem",
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
                    Add Product
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}

          {/* Pagination */}
          <Stack
            alignSelf={is488 ? "center" : "flex-end"}
            spacing={1.5}
            alignItems="center"
            sx={{
              p: is488 ? 1 : 0,
            }}
          >
            <Pagination
              size={is488 ? "medium" : "large"}
              page={page}
              onChange={(e, value) => setPage(value)}
              count={totalPages}
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 850,
                  borderRadius: "12px",
                },
                "& .Mui-selected": {
                  background: "#111827 !important",
                  color: "#ffffff",
                  borderColor: "#111827",
                },
              }}
            />

            <Typography
              sx={{
                textAlign: "center",
                color: "#64748b",
                fontWeight: 800,
              }}
            >
              Showing {showingStart} to {showingEnd} of {safeTotalResults}{" "}
              results
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};