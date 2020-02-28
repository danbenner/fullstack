/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@material-ui/core';

function CustomSelect({
  datatest, disabled, options, placeholder, value, handler, helperText,
}) {
  // eslint-disable-next-line react/no-array-index-key
  // const listOfOptions = options.map((opt, index) => <option key={index} value={opt}>{opt}</option>);
  const listOfOptions = options.map((opt, index) => <MenuItem key={index} value={opt}>{opt}</MenuItem>);
  const container = {
    background: '#fff',
    color: '#333',
    // margin: 'auto 1vw auto auto',
    padding: '5px 0px 5px 3px',
    borderRadius: '5px 0px 0px 5px',
  };
  const select = {
    background: '#fff',
    color: '#333',
    // fontSize: '1.2vh',
    height: 'auto',
    minWidth: '20vw',
  };
  // const inputProps = {
  //   'data-test': datatest,
  // };
  return (
    <div style={container}>
      <FormControl margin="dense">
        <InputLabel variant="outlined" htmlFor={datatest}>{placeholder}</InputLabel>
        <Select
          // native
          inputProps={{ id: datatest }}
          data-test={datatest}
          disabled={disabled}
          variant="filled"
          style={select}
          value={value}
          onChange={handler}
        >
          {listOfOptions}
        </Select>
        <FormHelperText error>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handler: PropTypes.func,
  helperText: PropTypes.string,
};

CustomSelect.defaultProps = {
  // disabled: true,
  options: [],
  placeholder: '',
  value: '',
  handler: () => {},
  helperText: '',
};

export default CustomSelect;
