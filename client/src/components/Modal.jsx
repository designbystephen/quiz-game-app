import React from 'react';
import PropTypes from 'prop-types';
import { clamp } from 'lodash/number';
import { round } from 'lodash/math';
import { debounce } from 'lodash/function';
import { ScoreControls } from './';
import '../styles/components/modal.scss';

class Modal extends React.Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      onClose: PropTypes.func.isRequired,
      tile: PropTypes.object.isRequired,
      hasModeratorLock: PropTypes.bool.isRequired,
      toggleModeratorLock: PropTypes.func.isRequired,
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
    this.keys = ['Escape', 'KeyM', 'Digit1', 'Digit2', 'Shift+ArrowRight', 'Shift+ArrowLeft', 'Shift+Equal', 'Minus'];

    this.toggleOptions = this.toggleOptions.bind(this);
    this.nextStage = this.nextStage.bind(this);
    this.prevStage = this.prevStage.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    // bind and listen for keys
    window.onkeyup = event => this.handleKeyPress(event);
  }

  componentWillReceiveProps(props) {
    if (props.setActiveTeam) {
      props.setActiveTeam(null);
    }
  }

  componentWillUnmount() {
    // clear and reset timer
    this.clearTimer();

    // unbind key listener
    window.onkeyup = () => {};
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

  toggleTimer() {
    if (this.actionTimer) {
      this.clearTimer();
    } else {
      this.startTimer();
    }
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

  pauseTimer() {
    clearInterval(this.actionTimer);
    this.actionTimer = null;
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

  handleKeyPress({ code, shiftKey } = event) {
    console.log(code);
    const key = `${shiftKey ? 'Shift+' : ''}${code}`;

    if (this.keys.includes(key)) {
      this.handleEscape(key);
      this.handleNextOrPrev(key);
      this.handleModeratorLock(key);
      this.handleBuzzer(key);
      this.handlePoints(key);
    }
  }

  handleEscape(key) {
    // escape handler treats escape like a back button, depending on the stage/state
    if (key === 'Escape') {
      if (this.actionTimer) {
        this.clearTimer();
      } else if (this.state.stage > 0) {
        this.prevStage();
      } else {
        this.props.onClose();
      }
    }
  }

  handleNextOrPrev(key) {
    if (key === 'Shift+ArrowLeft') {
      this.prevStage();
    } else if (key === 'Shift+ArrowRight') {
      this.nextStage();
    }
  }

  handleBuzzer(key) {
    if (this.props.hasModeratorLock === false && this.actionTimer) {
      if (key === 'Digit1') {
        this.pauseTimer();
        this.props.setActiveTeam(1);
      } else if (key === 'Digit2') {
        this.pauseTimer();
        this.props.setActiveTeam(2);
      }
    }
  }

  handlePoints(key) {
    if (this.props.activeTeam) {
      if (key === 'Shift+Equal') {
        this.props.awardPoints(this.props.activeTeam, this.props.tile.id);
      } else if (key === 'Minus') {
        this.props.deductPoints(this.props.activeTeam, this.props.tile.id);
      }
    }
  }

  handleModeratorLock(key) {
    if (key === 'KeyM') {
      this.clearTimer();
      this.props.toggleModeratorLock();
    }
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
                stopTimer={this.clearTimer}
                toggleTimer={this.toggleTimer}
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
