/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

/*
  hide, name, dob, rewardSelection,
  eligibility{state, product, plan, memberID}
*/
class AlertDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
  }

  handleClickOpen() {
    this.setState(() => ({
      open: true,
    }));
  }

  handleClose() {
    this.setState(() => ({
      open: false,
    }));
  }

  handleFinalSubmit() {
    this.props.finalSubmit();
    this.handleClose();
  }

  render() {
    return (
      <div data-test="AlertDialog">
        <Button data-test="next-button" disabled={this.props.hide} variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Next
        </Button>
        <Dialog
          data-test="Dialog"
          open={this.state.open}
          // onBackdropClick={this.handleClose}
        >
          <DialogTitle>REVIEW</DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              State: {this.props.eligibility.state}
            </DialogContentText>
            <DialogContentText>
              Product: {this.props.eligibility.product}
            </DialogContentText>
            <DialogContentText>
              Plan: {this.props.eligibility.plan}
            </DialogContentText>
            <DialogContentText>
              MemeberID: {this.props.eligibility.memberID}
            </DialogContentText>
            <DialogContentText>
              Name: {this.props.name}
            </DialogContentText>
            <DialogContentText>
              DOB: {this.props.dob}
            </DialogContentText>
            <DialogContentText>
              Reward: {this.props.rewardSelection}
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button data-test="cancel-button" size="small" variant="flat" onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button data-test="final-submit-button" size="large" variant="contained" onClick={this.handleFinalSubmit} color="secondary" autoFocus>
              Final Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.propTypes = {
  hide: PropTypes.bool,
  name: PropTypes.string,
  dob: PropTypes.string,
  rewardSelection: PropTypes.string,
  eligibility: PropTypes.shape({
    state: PropTypes.string,
    product: PropTypes.string,
    plan: PropTypes.number,
    memberID: PropTypes.string,
  }),
};

AlertDialog.defaultProps = {
  hide: true,
  name: '',
  dob: '',
  rewardSelection: '',
  eligibility: {
    state: '',
    product: '',
    plan: 0,
    memberID: '',
  },
};

export default AlertDialog;
