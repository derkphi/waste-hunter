import { AppBar, Toolbar, Typography, makeStyles, createTheme, Button, IconButton, Drawer, Link, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

const theme = createTheme({
  palette: {
      primary: {
          light:'#528777',
          main: '#276955',
          dark:'#1b493b',
      },
      secondary: {
          light:'#67b7a3',
          main: '#41a58d',
          dark:'#2d7362',
      },
  },
});

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    paddingRight: "79px",
    paddingLeft: "79px",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
    position: "sticky",
  },
  logo: {
    fontFamily: "Work Sans, sans-serif",
    fontWeight: 600,
    color: theme.palette.primary.light,
    textAlign: "left",
  },
  menuButton: {
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 700,
    size: "18px",
    marginLeft: "38px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {
    padding: "20px 30px",
  },
}));

interface MenuItemProp {
  label : string,
  href: string
}

interface HeaderProps {
  title: string,
  menuItems: MenuItemProp[]
}


export default function Header(props: HeaderProps) {
  const { header, logo, menuButton, toolbar, drawerContainer } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        {wasteHunterLogo}
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        <div>{wasteHunterLogo}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return props.menuItems.map(item => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: item.href,
            color: "inherit",
            style: { textDecoration: "none" },
            key: item.label,
          }}
        >
          <MenuItem>{item.label}</MenuItem>
        </Link>
      );
    });
  };

  const wasteHunterLogo = (
    <Typography variant="h6" component="h1" className={logo}>
      {props.title}
    </Typography>
  );

  const getMenuButtons = () => {
    return props.menuItems.map(item => {
      return (
        <Button
          {...{
            key: item.label,
            color: "inherit",
            to: item.href,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {item.label}
        </Button>
      );
    });
  };

  return (
    <header>
      <AppBar className={header}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}