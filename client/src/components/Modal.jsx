import React from 'react';
import PropTypes from 'prop-types';
import { clamp } from 'lodash/number';
import { round } from 'lodash/math';
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
      stage: 0,
      elapsed: 0,
    };

    this.actionTimer = null;
    this.timeLimit = 8;

    this.toggleOptions = this.toggleOptions.bind(this);
    this.nextStage = this.nextStage.bind(this);
    this.prevStage = this.prevStage.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillUnmount() {
    this.clearTimer();
  } 

  get stages(){
    return {
      0: 'question',
      1: 'answer',
      2: 'recap'
    }
  }

  get actionTimer() {
    return this.timer;
  }

  set actionTimer(value) {
    this.timer = value;
    return this.timer;
  }

  tick(interval) {
    this.setState((prevState) => {
      const nextTick = round(prevState.elapsed + (interval / 1000), 1);
      if (nextTick >= this.timeLimit) {
        this.clearTimer();
      }

      return {
        elapsed: nextTick >= this.timeLimit ? 0 : nextTick,
      };
    });
  }

  startTimer() {
    this.clearTimer();

    const interval = 100;
    this.actionTimer = setInterval(() => this.tick(interval), interval);

    return this.actionTimer;
  }

  clearTimer() {
    clearInterval(this.actionTimer);
    this.actionTimer = null;

    this.setState({
      elapsed: 0,
    });
  }

  nextStage() {
    this.setState(prevState => ({
      stage: clamp(prevState.stage + 1, 0, 2),
    }));
  }

  prevStage() {
    this.setState(prevState => ({
      stage: clamp(prevState.stage - 1, 0, 2),
    }));
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
              { this.timer && this.state.elapsed }
            </div>
          </div>
          <div className="modal__content">
            <div>
              { this.stages[this.state.stage] === 'question' && tile.question }
              { this.stages[this.state.stage] === 'answer' && tile.answer }
            </div>
          </div>
          <div className="modal__controls">
            <button type="button" className="modal__show-controls" onClick={this.toggleOptions}>
              { this.state.optionsOpen ? '\u2013' : '\u22EF' }
            </button>

            {this.state.optionsOpen &&
              <ScoreControls
                tileId={tile.id}
                prevStage={this.prevStage}
                nextStage={this.nextStage}
                currentStage={this.stages[this.state.stage]}
                startTimer={this.startTimer}
                {...rest}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
