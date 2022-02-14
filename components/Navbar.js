import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import Styles from "../styles/Navbar.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

const links = ["Dashboard", "Products", "Orders", "Report", "Settings"];

const Navbar = () => {
  const { data: session, status } = useSession();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar className={Styles.navContainer} position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <Box
            className={Styles.navLogo}
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            LOGO
          </Box>

          <Box
            className={Styles.navMobile}
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <Box
              className={Styles.navLogo}
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              LOGO
            </Box>

            {session && (
              <Box>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {/* <MenuItem
                    key="dashboard"
                    onClick={handleCloseNavMenu}
                    className={Styles.menuItem}
                  >
                    <Link href="/">Dashboard</Link>
                  </MenuItem> */}
                  {links.map((link) => (
                    <MenuItem
                      key={link}
                      onClick={handleCloseNavMenu}
                      className={Styles.menuItem}
                    >
                      <Link href={`/${link.toLowerCase()}`}>{link}</Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>

          {session && (
            <Box
              className={Styles.navLinks}
              sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}
            >
              {/* <Link
                key="dashboard"
                href="/"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Dashboard
              </Link> */}

              {links.map((link) => (
                <Link
                  href={`/${link.toLowerCase()}`}
                  key={link}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          )}

          {!session && (
            <Button variant="outlined" color="secondary">
              <Link href="/">Set Roles</Link>
            </Button>
            // <button
            //   onClick={() =>
            //     signIn(null, {
            //       callbackUrl: `${window.location.origin}/`,
            //     })
            //   }
            // >
            //   Sign In
            // </button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
