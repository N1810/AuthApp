"use client";
import { useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Box,
} from "@mui/material";
import { Home, Apps } from "@mui/icons-material";

export default function Dashboard() {
    const [open, setOpen] = useState(true);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 240,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Apps />
                        </ListItemIcon>
                        <ListItemText primary="Components" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Apps />
                        </ListItemIcon>
                        <ListItemText primary="Modules" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography paragraph>Welcome to the Dashboard</Typography>
            </Box>
        </Box>
    );
}
