import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';
import { Button, AppBar, Toolbar, IconButton, Typography, MenuItem, Menu } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: 'white',
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            marginRight: theme.spacing(2),
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    sectionMainMobile: {
        display: 'flex',
        // [theme.breakpoints.up('md')]: {
        //     display: 'none',
        // },
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    navbar: {
        marginBottom: theme.spacing(2),
    },
}));

export default function TopNav({ isAuth, user, updateAuth }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [mobileMainAnchor, setmobileMainAnchor] = React.useState(null);

    //const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const logout = () => {
        window.localStorage.removeItem("user");
        if (!window.localStorage.getItem("user")) {
            updateAuth(false);
        }
        handleMenuClose();
    }

    const menuId = 'primary-search-account-menu';
    // const renderMenu = (
    //     <Menu
    //         anchorEl={anchorEl}
    //         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //         id={menuId}
    //         keepMounted
    //         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    //         open={isMenuOpen}
    //         onClose={handleMenuClose}
    //     >
    //     </Menu>
    // );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {isAuth ?
                <div>
                    <MenuItem onClick={logout}>
                        <ListItemText primary='Logout' />
                    </MenuItem>
                    <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
                        <ListItemText primary='Cart' />
                    </MenuItem>
                </div>
                :
                <div>
                    <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                        <ListItemText primary='Register' />
                    </MenuItem>
                    <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                        <ListItemText primary='Login' />
                    </MenuItem>
                </div>
            }
        </Menu>
    );

    const [mainMenuOpen, setMainMenuOpen] = useState(false);

    const toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setMainMenuOpen(open);
    };

    const mobileMainMenuId = 'main-menu-mobile';
    const renderMobileMainMenu = (
        <Drawer open={mainMenuOpen} onClose={toggleDrawer(false)}>
            <div
                className={classes.list}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    <ListItem button component={Link} to='/'>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary='Home' />
                    </ListItem>
                    <ListItem button component={Link} to='/test'>
                        <ListItemIcon><AnnouncementIcon /></ListItemIcon>
                        <ListItemText primary='Test' />
                    </ListItem>
                </List>

                {user.role === 'admin' &&
                    <>
                        <Divider />
                        <ListItem button component={Link} to='/admin/addproduct'>
                            <ListItemIcon><AddIcon /></ListItemIcon>
                            <ListItemText primary='Add Product' />
                        </ListItem>
                        <ListItem button component={Link} to='/admin/users'>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary='User Management' />
                        </ListItem>
                    </>
                }
            </div>
        </Drawer>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.navbar}>
                <Toolbar>
                    <div className={classes.sectionMainMobile}>
                        <IconButton
                            aria-label="show main menu"
                            aria-controls={mobileMainMenuId}
                            aria-haspopup="true"
                            onClick={toggleDrawer(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <Typography variant="h6" noWrap>
                        App Template
                    </Typography>
                    <div className={classes.grow} />
                    {isAuth && user &&
                        <Typography className={classes.title} variant="h6" noWrap>
                            Hello, {`${user.firstName} ${user.lastName}`}
                        </Typography>
                    }
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                        </IconButton>
                        {isAuth ?
                            <Button className={classes.menuButton} onClick={logout}>Logout</Button>
                            :
                            <>
                                <Button className={classes.menuButton} component={Link} to="/register">
                                    <ListItemText primary='Register' />
                                </Button>
                                <Button className={classes.menuButton} component={Link} to="/login">
                                    <ListItemText primary='Login' />
                                </Button>
                            </>
                        }
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMobileMainMenu}
            {/* {renderMenu} */}
        </div>
    );
}