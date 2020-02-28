import React from 'react';
import { Grid } from '@material-ui/core';
import CustomTable from '../CustomTable';

class Redemptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: 'api/errors',
      initialRowLimit: 10,
    };
  }

  // NOTE: added Grid functionality so that we can add more tables

  render() {
    const { route, initialRowLimit } = this.state;
    return (
      <div>
        <Grid
          justify="space-evenly"
          container
          spacing={2}
        >
          <Grid item>
            <CustomTable
              tableTitle="Redemptions Errors"
              route={route}
              initialLimit={initialRowLimit}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Redemptions;
