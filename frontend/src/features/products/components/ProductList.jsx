import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
} from "../ProductSlice";

import { ProductCard } from "./ProductCard";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";

import { selectBrands } from "../../brands/BrandSlice";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { selectCategories } from "../../categories/CategoriesSlice";
import Pagination from "@mui/material/Pagination";
import { ITEMS_PER_PAGE } from "../../../constants";

import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";

import { selectLoggedInUser } from "../../auth/AuthSlice";
import { toast } from "react-toastify";
import { banner1, banner2, banner3, banner4, loadingAnimation } from "../../../assets";
import { resetCartItemAddStatus, selectCartItemAddStatus } from "../../cart/CartSlice";
import { motion } from "framer-motion";
import { ProductBanner } from "./ProductBanner";
import ClearIcon from "@mui/icons-material/Clear";
import Lottie from "lottie-react";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

const bannerImages = [banner1, banner3, banner2, banner4];

export const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);

  const theme = useTheme();

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is800 = useMediaQuery(theme.breakpoints.down(800));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const totalResults = useSelector(selectProductTotalResults);
  const loggedInUser = useSelector(selectLoggedInUser);

  const productFetchStatus = useSelector(selectProductFetchStatus);

  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const dispatch = useDispatch();

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, brand: filterArray });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };

    finalFilters["pagination"] = {
      page: page,
      limit: ITEMS_PER_PAGE,
    };

    finalFilters["sort"] = sort;

    if (!loggedInUser?.isAdmin) {
      finalFilters["user"] = true;
    }

    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, page, sort, loggedInUser, dispatch]);

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
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === productId);

      if (index !== -1) {
        dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
      }
    }
  };

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
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching products, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };

  return (
    <>
      {productFetchStatus === "pending" ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          {/* Filters sidebar */}
          <motion.div
            style={{
              position: "fixed",
              backgroundColor: "white",
              height: "100vh",
              padding: "1.2rem",
              overflowY: "scroll",
              width: is500 ? "100vw" : "30rem",
              zIndex: 500,
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
            }}
            variants={{
              show: { left: 0 },
              hide: { left: -500 },
            }}
            initial={"hide"}
            transition={{
              ease: "easeInOut",
              duration: 0.7,
              type: "spring",
            }}
            animate={isProductFilterOpen === true ? "show" : "hide"}
          >
            <Stack mb={"5rem"} sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}>
              <Typography variant="h4" fontWeight={900}>
                New Arrivals
              </Typography>

              <IconButton
                onClick={handleFilterClose}
                style={{ position: "absolute", top: 15, right: 15 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ClearIcon fontSize="medium" />
                </motion.div>
              </IconButton>

              <Stack rowGap={2} mt={4}>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Totes
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Backpacks
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Travel Bags
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Hip Bags
                </Typography>
                <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Laptop Sleeves
                </Typography>
              </Stack>

              {/* Brand filters */}
              <Stack mt={2}>
                <Accordion elevation={0}>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="brand-filters"
                    id="brand-filters"
                  >
                    <Typography fontWeight={800}>Brands</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      {brands?.map((brand) => (
                        <motion.div
                          key={brand._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={brand.name}
                            value={brand._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              {/* Category filters */}
              <Stack mt={2}>
                <Accordion elevation={0}>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="category-filters"
                    id="category-filters"
                  >
                    <Typography fontWeight={800}>Category</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      {categories?.map((category) => (
                        <motion.div
                          key={category._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={category.name}
                            value={category._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
          </motion.div>

          <Stack mb={"3rem"}>
            {/* Banner section */}
            {!is600 && (
              <Box
                sx={{
                  width: "100%",
                  height: is800 ? "220px" : is1200 ? "280px" : "320px",
                  overflow: "hidden",
                  borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
                }}
              >
                <ProductBanner images={bannerImages} />
              </Box>
            )}

            {/* Products section */}
            <Box
              sx={{
                px: is600 ? 2 : 5,
                pt: is600 ? 3 : 4,
                pb: 4,
                background:
                  "linear-gradient(180deg, #ffffff 0%, #fbfbfb 45%, #ffffff 100%)",
              }}
            >
              {/* Header and sort */}
              <Stack
                direction={is700 ? "column" : "row"}
                alignItems={is700 ? "flex-start" : "center"}
                justifyContent={"space-between"}
                spacing={2}
                sx={{
                  maxWidth: "1500px",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    sx={{
                      fontSize: is600 ? "1.7rem" : "2.2rem",
                      fontWeight: 950,
                      color: "#0f172a",
                      letterSpacing: "-.04em",
                    }}
                  >
                    Featured Products
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: ".95rem",
                      fontWeight: 600,
                    }}
                  >
                    Explore premium picks curated for your online shopping experience.
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: is700 ? "100%" : "230px",
                    background: "#ffffff",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    borderRadius: "16px",
                    px: 2,
                    py: 0.8,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="sort-dropdown">Sort products</InputLabel>
                    <Select
                      labelId="sort-dropdown"
                      label="Sort products"
                      onChange={(e) => setSort(e.target.value)}
                      value={sort}
                      disableUnderline
                    >
                      <MenuItem value={null}>Reset</MenuItem>
                      {sortOptions.map((option) => (
                        <MenuItem key={option.name} value={option}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              {/* Product grid */}
              {products?.length > 0 ? (
                <Grid
                  container
                  justifyContent={"center"}
                  alignItems={"stretch"}
                  sx={{
                    maxWidth: "1500px",
                    mx: "auto",
                    columnGap: is700 ? 2 : 3,
                    rowGap: 4,
                  }}
                >
                  {products.map((product) => (
                    <Grid
                      item
                      key={product._id}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <ProductCard
                        id={product._id}
                        title={product.title}
                        thumbnail={product.thumbnail}
                        brand={product.brand.name}
                        price={product.price}
                        stockQuantity={product.stockQuantity}
                        handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    maxWidth: "800px",
                    mx: "auto",
                    mt: 6,
                    p: 5,
                    textAlign: "center",
                    borderRadius: "28px",
                    background: "#ffffff",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Typography fontWeight={900} fontSize={"1.6rem"}>
                    No products available yet
                  </Typography>
                  <Typography mt={1} color={"text.secondary"}>
                    Products will appear here after they are added to the store.
                  </Typography>
                </Box>
              )}

              {/* Pagination */}
              <Stack
                alignItems={is488 ? "center" : "flex-end"}
                rowGap={2}
                sx={{
                  maxWidth: "1500px",
                  mx: "auto",
                  mt: 5,
                  pr: is488 ? 0 : 2,
                }}
              >
                <Pagination
                  size={is488 ? "medium" : "large"}
                  page={page}
                  onChange={(e, page) => setPage(page)}
                  count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                  variant="outlined"
                  shape="rounded"
                />

                <Typography
                  textAlign={"center"}
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {page * ITEMS_PER_PAGE > totalResults
                    ? totalResults
                    : page * ITEMS_PER_PAGE}{" "}
                  of {totalResults} results
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};