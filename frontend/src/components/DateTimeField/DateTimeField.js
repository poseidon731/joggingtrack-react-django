import React from 'react'
import DateTime from 'react-datetime'
import { FormFeedback, FormGroup, Label } from 'reactstrap'

export default ({
  input,
  label,
  placeholder,
  dateFormat,
  timeFormat,
  type,
  meta: { touched, error, warning },
  ...otherProps
}) => (
  <FormGroup color={touched && error ? 'danger' : ''}>
    <Label>
      {label}
    </Label>
    <DateTime {...input} inputProps={{ placeholder }}
      dateFormat={dateFormat} timeFormat={timeFormat} {...otherProps} />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)
