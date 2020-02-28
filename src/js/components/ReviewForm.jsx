import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormHelperText from '@material-ui/core/FormHelperText';
import AlertDialog from './AlertDialog';

function ReviewForm({
  datatest, formValues, helperText, hide, onClick,
}) {
  return (
    <div data-test={datatest}>
      <List>
        <ListItem>
          <ListItemText primary={formValues.name} secondary="Name" />
        </ListItem>
        <ListItem>
          <ListItemText primary={formValues.dob} secondary="Date of Birth" />
        </ListItem>
        <FormHelperText>{helperText}</FormHelperText>
      </List>
      <div>
        <AlertDialog
          hide={hide}
          finalSubmit={onClick}
          eligibility={formValues.eligibility}
          name={formValues.name}
          dob={formValues.dob}
          rewardSelection={formValues.rewardSelection}
        />
      </div>
    </div>
  );
}

ReviewForm.defaultProps = {
  formValues: {
    name: '',
    dob: '',
  },
  helperText: '',
  // hide: true,
};

export default ReviewForm;
