import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ManualRewards from '../ManualRewards';
import Redemptions from '../Admin/Redemptions';

const styles = () => ({
  grid: {
    display: 'grid',
  },
});

function Content() {
  // const { classes } = props;
  return (
    <div>
      <Switch>
        <Route path="/user/manualRewards" component={ManualRewards} />
        <Route path="/admin/database/redemptions" component={Redemptions} />
        <Redirect from="/" to="/user/manualRewards" />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Content);
