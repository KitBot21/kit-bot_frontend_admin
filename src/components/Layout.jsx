// src/components/Layout.jsx
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const drawerWidth = 220;

export default function Layout({ children }) {
  const { logout } = useAuth();
  const loc = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">KIT-Bot 관리자</Typography>
          <Typography sx={{ cursor: "pointer" }} onClick={logout}>
            로그아웃
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
          },
        }}
      >
        <List>
          <ListItemButton
            component={Link}
            to="/users"
            selected={loc.pathname.startsWith("/users")}
          >
            <ListItemText primary="사용자 관리" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/posts"
            selected={loc.pathname.startsWith("/posts")}
          >
            <ListItemText primary="게시판 관리" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8, ml: `${drawerWidth}px` }}
      >
        {children}
      </Box>
    </Box>
  );
}
