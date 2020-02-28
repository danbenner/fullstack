import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

function CustomTextField({
  datatest, disabled, label, error, message, value, onChange, placeholder, variant, fontsize,
}) {
  const container = {
    background: '#fff',
    color: '#333',
    // margin: 'auto 1vw auto auto',
    padding: '5px 0px 5px 3px',
    borderRadius: '5px 0px 0px 5px',
  };
  const inputItem = {
    background: '#fff',
    color: '#333',
    fontSize: { fontsize },
    height: 'auto',
    minWidth: '20vw',
  };
  const inputProps = {
    'data-test': datatest,
  };
  return (
    <div style={container}>
      <TextField
        id={datatest}
        inputProps={inputProps}
        disabled={disabled}
        style={inputItem}
        label={label}
        error={error}
        helperText={message}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant={variant}
      />
    </div>
  );
}

CustomTextField.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.bool,
  message: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
  fontsize: PropTypes.string,
};

CustomTextField.defaultProps = {
  disabled: false,
  label: '',
  error: false,
  message: '',
  value: '',
  onChange: () => {},
  placeholder: '',
  variant: 'outlined',
  fontsize: '1em',
};

export default CustomTextField;
