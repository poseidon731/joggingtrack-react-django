import React from 'react'
import { Col, FormFeedback, FormGroup, Label, Input, Row } from 'reactstrap'
import './DurationField.scss'

const defaultTo = (val) => val ? val : ''
const getSeconds = (value) => value ? defaultTo(value % 60) : ''
const getMinutes = (value) => value ? defaultTo(Math.floor(value / 60) % 60) : ''
const getHours = (value) => value ? defaultTo(Math.floor(value / 3600)) : ''

const onChangeSeconds = (input) => (e) => {
  const sec = e.target.value.toString().slice(0, 2)
  const value = getHours(input.value) * 3600 + getMinutes(input.value) * 60 + parseInt(sec || 0) // eslint-disable-line
  input.onChange(value)
}

const onChangeMinutes = (input) => (e) => {
  const min = e.target.value.toString().slice(0, 2)
  const value = getHours(input.value) * 3600 + parseInt(min || 0) * 60 + getSeconds(input.value) // eslint-disable-line
  input.onChange(value)
}

const onChangeHours = (input) => (e) => {
  const hour = e.target.value.toString().slice(0, 2)
  const value = parseInt(hour || 0) * 3600 + getMinutes(input.value) * 60 + getSeconds(input.value) // eslint-disable-line
  input.onChange(value)
}

export default ({
  input,
  label,
  placeholder,
  dateFormat,
  timeFormat,
  type,
  meta: { touched, error, warning }
}) => (
  <FormGroup color={touched && error ? 'danger' : ''}>
    <Label>
      {label}
    </Label>
    <Row>
      <Col xs={4} className='duration-field__hh'>
        <Input value={getHours(input.value)} onChange={onChangeHours(input)}
          type='number' min={0} max={24} maxLength={2} placeholder='Hours' />
      </Col>
      <Col xs={4} className='duration-field__mm'>
        <Input value={getMinutes(input.value)} onChange={onChangeMinutes(input)}
          type='number' min={0} max={60} placeholder='Minutes' />
      </Col>
      <Col xs={4}>
        <Input value={getSeconds(input.value)} onChange={onChangeSeconds(input)}
          type='number' min={0} max={60} placeholder='Seconds' />
      </Col>
    </Row>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)
