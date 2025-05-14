import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setCloseModal } from '../features/ui/uiSlice'

export default function AssignModal(props) {

    const dispatch = useDispatch()
    const {modalOpen} = useSelector(state => state.ui)
    
  return (
    <div><Modal
      {...props}
      show={modalOpen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={()=>dispatch(setCloseModal())}>
        <Modal.Title id="contained-modal-title-vcenter">
          Assign As
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>dispatch(setCloseModal())}>Close</Button>
      </Modal.Footer>
    </Modal>
      
    </div>
  )
}
