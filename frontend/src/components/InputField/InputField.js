import React from 'react'
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap'

export default ({
  input,
  label,
  placeholder,
  options,
  type,
  meta: { touched, error, warning }
}) => (
  <FormGroup color={touched && error ? 'danger' : ''}>
    <Label>
      {label}
    </Label>
    <Input {...input} placeholder={placeholder || label} type={type}>
      {type === 'select' && options ? options.map((item, index) => (
        <option key={index} value={item.value}>{item.label}</option>
      )) : undefined}
    </Input>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)
