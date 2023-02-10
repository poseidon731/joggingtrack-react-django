import React from 'react'
import { FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap'

export default ({
  input,
  label,
  placeholder,
  options,
  type,
  prefix,
  suffix,
  meta: { touched, error, warning }
}) => (
  <FormGroup color={touched && error ? 'danger' : ''}>
    <Label>
      {label}
    </Label>
    <InputGroup>
      {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
      <Input {...input} placeholder={placeholder || label} type={type}>
        {type === 'select' && options ? options.map((item, index) => (
          <option key={index} value={item.value}>{item.label}</option>
        )) : undefined}
      </Input>
      {suffix && <InputGroupAddon>{suffix}</InputGroupAddon>}
    </InputGroup>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)
