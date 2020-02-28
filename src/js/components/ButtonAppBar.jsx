import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

function ButtonAppBar() {
  return (
    <div>
      <AppBar data-test="ButtonAppBar" position="static">
        <Toolbar>
          <Button variant="outlined" color="inherit">Admin</Button>
          <Button variant="outlined" color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;
