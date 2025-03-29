/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ToastContainer, Toast } from 'react-bootstrap';

function ToastManager({ message, variant, show, onClose, text, position }) {
  return (
    <>
      <ToastContainer position={position} className="p-3 position-fixed">
        <Toast
          show={show}
          onClose={onClose}
          delay={4500}
          autohide
          className={`bg-${variant} text-${text} border-0`}>
          <div className="d-flex justify-content-center">
            <Toast.Body className="py-3 fs-6">{message}</Toast.Body>
          </div>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ToastManager;
