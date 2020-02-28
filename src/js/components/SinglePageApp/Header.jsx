import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

function Header(props) {
  const userID = props.portalUserCN;

  return (
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs />
          <Grid item>
            { userID }
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
