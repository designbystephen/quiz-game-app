import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/modal.scss';

const Modal = ({ children, title, onClose }) => (
  <div className="modal">
    <div className="modal__card">
      <div className="modal__close" onClick={onClose}>
        x Close
      </div>
      <div className="modal__header">
        <div>
          { title }
        </div>
      </div>
      <div className="modal__content">
        <div>
          { children }
        </div>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Modal;
