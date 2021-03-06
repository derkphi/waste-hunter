import { AppBar, Toolbar, Typography, makeStyles, Button, IconButton, Drawer, Link, MenuItem } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    paddingRight: '10px',
    paddingLeft: '79px',
    '@media (max-width: 900px)': {
      paddingLeft: 0,
    },
    position: 'sticky',
  },
  logo: {
    fontFamily: 'Work Sans, sans-serif',
    fontWeight: 600,
    textAlign: 'left',
  },
  whlogo: {
    maxWidth: 125,
  },
  whlogo_mobile: {
    maxWidth: 50,
  },
  menuButton: {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    size: '18px',
    marginLeft: '38px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  drawerContainer: {
    padding: '20px 30px',
  },
}));

interface MenuItemProp {
  label: string;
  href: string;
}

interface HeaderProps {
  title: string;
  menuItems: MenuItemProp[];
}

export default function Header(props: HeaderProps) {
  const { header, logo, menuButton, toolbar, drawerContainer, whlogo, whlogo_mobile } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ drawerOpen: false, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        <img src="../white_logo_transparent_background.png" alt="logo" className={whlogo} />
        {wasteHunterLogo}
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
        >
          <img src="../logo192.png" alt="logo" className={whlogo_mobile} />
        </IconButton>

        <Drawer
          {...{
            anchor: 'top',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices(handleDrawerClose)}</div>
        </Drawer>

        <div>{wasteHunterLogo}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = (handleDrawerClose: () => void) => {
    return props.menuItems.map((item) => {
      return (
        <Link
          tabIndex={0}
          role="button"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
          {...{
            component: RouterLink,
            to: item.href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: item.label,
          }}
        >
          <MenuItem>{item.label}</MenuItem>
        </Link>
      );
    });
  };

  const wasteHunterLogo = (
    <>
      <Typography variant="h6" component="h1" className={logo}>
        {props.title}
      </Typography>
    </>
  );

  const getMenuButtons = () => {
    return props.menuItems.map((item) => {
      return (
        <Button
          {...{
            key: item.label,
            color: 'inherit',
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
      <AppBar className={header}>{mobileView ? displayMobile() : displayDesktop()}</AppBar>
    </header>
  );
}
