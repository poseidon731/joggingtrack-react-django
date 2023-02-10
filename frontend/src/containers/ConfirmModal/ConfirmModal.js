import React from 'react'
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm'
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap'

const ConfirmModal = ({show, proceed, dismiss, cancel, confirmation, options}) => (
  <Modal isOpen={show} toggle={dismiss}>
    <ModalHeader>
      {confirmation}
    </ModalHeader>
    <ModalFooter>
      <Button color="primary" onClick={() => proceed()}>Yes</Button>{' '}
      <Button color="secondary" onClick={() => cancel()}>Cancel</Button>
    </ModalFooter>
  </Modal>
)

ConfirmModal.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  cancel: PropTypes.func,
  dismiss: PropTypes.func,
  confirmation: PropTypes.string,
  options: PropTypes.object
}

export default confirmable(ConfirmModal)
