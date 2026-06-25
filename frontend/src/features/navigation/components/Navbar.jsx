import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { selectUserInfo } from "../../user/UserSlice";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { selectCartItems } from "../../cart/CartSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TuneIcon from "@mui/icons-material/Tune";
import {
  selectProductIsFilterOpen,
  toggleFilters,
} from "../../products/ProductSlice";

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems) || [];
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const userName = userInfo?.name || loggedInUser?.name || "User";
  const firstName = userName?.toString()?.split(" ")[0] || "User";
  const avatarLetter = firstName?.charAt(0)?.toUpperCase() || "S";

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuNavigate = (path) => {
    handleCloseUserMenu();
    navigate(path);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const settings = [
    { name: "Home", to: "/" },
    {
      name: "Profile",
      to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile",
    },
    {
      name: loggedInUser?.isAdmin ? "Orders" : "My Orders",
      to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders",
    },
    { name: "Logout", to: "/logout" },
  ];

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/" },
    { name: "Wishlist", to: "/wishlist" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
        color: "#0f172a",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        zIndex: 200,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: is600 ? 2 : 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: "100%",
            maxWidth: "1500px",
          }}
        >
          {/* Logo */}
          <Stack
            component={Link}
            to="/"
            direction="row"
            alignItems="center"
            spacing={1.4}
            sx={{
              textDecoration: "none",
              color: "inherit",
              minWidth: is600 ? "auto" : "250px",
            }}
          >
            <Box
              sx={{
                width: is480 ? 38 : 44,
                height: is480 ? 38 : 44,
                borderRadius: "15px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, #111827 0%, #000000 55%, #f59e0b 160%)",
                color: "#ffffff",
                fontWeight: 950,
                fontSize: is480 ? ".9rem" : "1rem",
                letterSpacing: ".04em",
                boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
              }}
            >
              SB
            </Box>

            <Stack spacing={0}>
              <Typography
                sx={{
                  display: is480 ? "none" : "block",
                  fontWeight: 950,
                  letterSpacing: is600 ? ".12rem" : ".22rem",
                  fontSize: is600 ? "1rem" : "1.18rem",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                SMART BAZAAR
              </Typography>

              {!is600 && (
                <Typography
                  sx={{
                    fontSize: ".72rem",
                    color: "#64748b",
                    fontWeight: 700,
                    letterSpacing: ".08rem",
                    mt: 0.4,
                  }}
                >
                  Premium Online Store
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Center nav links */}
          {!is900 && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "999px",
                background: "rgba(248, 250, 252, 0.9)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={{
                    color: "#334155",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 2,
                    "&:hover": {
                      background: "#111827",
                      color: "#ffffff",
                    },
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Stack>
          )}

          {/* Right side */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={is480 ? 0.8 : 1.4}
            sx={{ minWidth: is600 ? "auto" : "250px" }}
          >
            {!is600 && (
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#334155",
                  whiteSpace: "nowrap",
                }}
              >
                Hey👋, {is480 ? firstName : userName}
              </Typography>
            )}

            {loggedInUser?.isAdmin && (
              <Chip
                label="Admin"
                size="small"
                sx={{
                  fontWeight: 900,
                  color: "#ffffff",
                  background: "#111827",
                }}
              />
            )}

            {!loggedInUser?.isAdmin && (
              <Tooltip title="Cart">
                <IconButton
                  onClick={() => navigate("/cart")}
                  sx={{
                    width: 42,
                    height: 42,
                    background: "#f8fafc",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    "&:hover": {
                      background: "#111827",
                      color: "#ffffff",
                    },
                  }}
                >
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {!loggedInUser?.isAdmin && (
              <Tooltip title="Wishlist">
                <IconButton
                  component={Link}
                  to="/wishlist"
                  sx={{
                    width: 42,
                    height: 42,
                    background: "#f8fafc",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    color: "#0f172a",
                    "&:hover": {
                      background: "#111827",
                      color: "#ffffff",
                    },
                  }}
                >
                  <Badge
                    badgeContent={wishlistItems?.length || 0}
                    color="error"
                  >
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {isProductList && (
              <Tooltip title="Filters">
                <IconButton
                  onClick={handleToggleFilters}
                  sx={{
                    width: 42,
                    height: 42,
                    background: isProductFilterOpen ? "#111827" : "#f8fafc",
                    color: isProductFilterOpen ? "#ffffff" : "#0f172a",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    "&:hover": {
                      background: "#111827",
                      color: "#ffffff",
                    },
                  }}
                >
                  <TuneIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={userName}
                  sx={{
                    width: 44,
                    height: 44,
                    background:
                      "linear-gradient(135deg, #111827 0%, #000000 100%)",
                    color: "#ffffff",
                    fontWeight: 900,
                    boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                  }}
                >
                  {avatarLetter}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "48px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  borderRadius: "18px",
                  mt: 1,
                  minWidth: 210,
                  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  overflow: "hidden",
                  p: 0.8,
                },
              }}
            >
              {is600 && (
                <MenuItem disabled>
                  <Typography fontWeight={800}>Hey👋, {firstName}</Typography>
                </MenuItem>
              )}

              {loggedInUser?.isAdmin && (
                <MenuItem
                  onClick={() => handleMenuNavigate("/admin/add-product")}
                  sx={{
                    borderRadius: "12px",
                    px: 2,
                    py: 1.2,
                    "&:hover": {
                      background: "#f8fafc",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#111827",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    Add New Product
                  </Typography>
                </MenuItem>
              )}

              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={() => handleMenuNavigate(setting.to)}
                  sx={{
                    borderRadius: "12px",
                    px: 2,
                    py: 1.2,
                    "&:hover": {
                      background: "#f8fafc",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#111827",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};