import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/modal.scss';

const Modal = ({ children, title, onClose }) => (
  <div className="modal">
    <div className="modal__card">
      <div className="modal__header">
        <div className="modal__close" onClick={onClose}>x</div>
        { title }
      </div>
      <div className="modal__content">
        { children }
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Modal;
