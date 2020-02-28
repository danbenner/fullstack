/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

const pages = [
  {
    id: 'User',
    children: [
      {
        id: 'ManualRewards',
        to: '/user/manualRewards',
        title: 'ManualRewards',
        icon: <LoyaltyIcon />,
        active: true,
      },
    ],
  },
  {
    id: 'Admin',
    children: [
      {
        id: 'Redemptions',
        to: '/admin/database/redemptions',
        title: 'Redemptions',
        icon: <ErrorIcon />,
      },
    ],
  },
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  navTitle: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.navTitle, classes.item, classes.itemCategory)}>
          Loyalty & Rewards
        </ListItem>
        {pages.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({
              id: childId, to, title, icon, active,
            }) => (
              <Link
                key={childId}
                to={to}
                classes={{
                  primary: classes.itemPrimary,
                }}
              >
                <ListItem
                  button
                  className={clsx(classes.item, active && classes.itemActiveItem)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                  <ListItem id={to} button className={classes.button}>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}
                    >
                      {title}
                    </ListItemText>
                  </ListItem>
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);
