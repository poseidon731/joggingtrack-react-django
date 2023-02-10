import ConfirmModal from './ConfirmModal'
import { createConfirmation } from 'react-confirm'
 
// create confirm function
const confirm = createConfirmation(ConfirmModal)

export default (confirmation, options = {}) => confirm({ confirmation, options })
