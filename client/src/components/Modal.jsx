import React from 'react';
import PropTypes from 'prop-types';
import { ScoreControls } from './';
import '../styles/components/modal.scss';

class Modal extends React.Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      onClose: PropTypes.func.isRequired,
      tile: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      optionsOpen: false,
    };

    this.toggleOptions = this.toggleOptions.bind(this);
  }

  toggleOptions() {
    this.setState(prevState => ({
      optionsOpen: !prevState.optionsOpen,
    }));
  }

  render({ title, onClose, tile, ...rest } = this.props) {
    return (
      <div className="modal">
        <div className="modal__overlay" />
        <div className="modal__card">
          <button type="button" className="modal__close" onClick={onClose}>
            x Close
          </button>
          <div className="modal__header">
            <div>
              { title }
            </div>
          </div>
          <div className="modal__content">
            <div>
              { tile.question }
            </div>
          </div>
          <div className="modal__controls">
            <button type="button" className="modal__show-controls" onClick={this.toggleOptions}>
              { this.state.optionsOpen ? '\u2013' : '\u22EF' }
            </button>
            {this.state.optionsOpen &&
              <ScoreControls tileId={tile.id} {...rest} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
