import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ExitToApp from '@material-ui/icons/ExitToApp';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';

function BottomNav({ value }) {
  return (
    <BottomNavigation
      data-test="BottomNav"
      value={value}
      showLabels
    >
      <BottomNavigationAction label="Logout" icon={<ExitToApp />} />
      <BottomNavigationAction label="Admin" icon={<SupervisorAccount />} />
    </BottomNavigation>
  );
}

BottomNav.propTypes = {
  value: PropTypes.string,
};

BottomNav.defaultProps = {
  value: '',
};

export default BottomNav;
