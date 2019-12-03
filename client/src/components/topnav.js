import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button, AppBar, Toolbar, IconButton, Typography, MenuItem, Menu } from '@material-ui/core';

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
}));

export default function TopNav({ isAuth, user, updateAuth }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
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

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
        </Menu>
    );

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
                <MenuItem onClick={logout}>Logout</MenuItem>
                :
                <div>
                    <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                        Register
                    </MenuItem>
                    <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                        Login
                    </MenuItem>
                </div>
            }
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
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
                                    Register
                                </Button>
                                <Button className={classes.menuButton} component={Link} to="/login">
                                    Login
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
            {/* {renderMenu} */}
        </div>
    );
}