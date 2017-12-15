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
      hasModeratorLock: PropTypes.bool.isRequired,
      toggleModeratorLock: PropTypes.func.isRequired,
      setActiveTeam: PropTypes.func.isRequired,
      awardPoints: PropTypes.func.isRequired,
      deductPoints: PropTypes.func.isRequired,
      setModeratorLock: PropTypes.func.isRequired,

      activeTeam: PropTypes.any,
    };
  }

  static get defaultProps() {
    return {
      activeTeam: null,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      optionsOpen: false,
      stage: 0,
      elapsed: 1,
      answeringTeam: null,
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
        this.props.setModeratorLock(true);
        this.clearTimer();
      }

      return {
        elapsed: nextTick > this.timeLimit ? 1 : nextTick,
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
      elapsed: 1,
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

  setAnsweringTeam(teamNo) {
    this.setState({
      answeringTeam: teamNo
    });
  }

  handleKeyPress({ code, shiftKey } = event) {
    // FIXME: remove logging
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
      if (key === 'Digit1' || key === 'Digit2') {
        this.clearTimer();
        this.props.setModeratorLock(true);
      }

      if (key === 'Digit1') {
        this.setAnsweringTeam(1);
      } else if (key === 'Digit2') {
        this.setAnsweringTeam(2);
      }
    }
  }

  handlePoints(key) {
    if (this.state.answeringTeam !== null) {
      if (key === 'Shift+Equal') {
        this.props.awardPoints(this.state.answeringTeam, this.props.tile.id);
        this.props.setActiveTeam(this.state.answeringTeam);
      } else if (key === 'Minus') {
        this.props.deductPoints(this.props.activeTeam, this.props.tile.id);
        this.setAnsweringTeam(null);
      }
    }
  }

  handleModeratorLock(key) {
    if (key === 'KeyM') {
      if (this.props.hasModeratorLock) {
        this.startTimer();
        this.setAnsweringTeam(null);
      } else {
        this.clearTimer();
      }

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
                answeringTeam={this.state.answeringTeam}
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
