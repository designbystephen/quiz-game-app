import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash/function';
import { clamp } from 'lodash/number';
import { round } from 'lodash/math';
import { ScoreControls, Team, Value } from './';
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
      toggleTileLock: PropTypes.func.isRequired,
      getIsLocked: PropTypes.func.isRequired,
      getIsWrong: PropTypes.func.isRequired,
      team1Score: PropTypes.number.isRequired,
      team2Score: PropTypes.number.isRequired,
      setTileLock: PropTypes.func.isRequired,
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
    this.keys = [
      'Escape', // back
      'KeyM', // moderator lock
      'KeyX', // tile lock
      'Digit1', // team 1 buzzer
      'Digit2', // team 2 buzzer
      'PageDown', // next stage for tile
      'PageUp', // prev stage for tile
      'Equal', // add score to active team
      'Minus', // deduct score to active team
    ];

    this.toggleOptions = this.toggleOptions.bind(this);
    this.nextStage = this.nextStage.bind(this);
    this.prevStage = this.prevStage.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleBuzzer = debounce(this.handleBuzzer, 64, { trailing: true, leading: true, maxWait: 1000 });

    this.sounds = {
      bikeHorn: new Audio('/assets/sounds/bike-horn.mp3'),
      chaChing: new Audio('/assets/sounds/cha-ching.mp3'),
      sadTrombone: new Audio('/assets/sounds/sad-trombone.mp3'),
      tickTock: new Audio('/assets/sounds/tick-tock.mp3'),
      tinyButton: new Audio('/assets/sounds/tiny-button-push.mp3'),
    };
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

  setAnsweringTeam(teamNo) {
    this.setState({
      answeringTeam: teamNo,
    });
  }

  tick(interval) {
    this.setState((prevState) => {
      const nextTick = round(prevState.elapsed + (interval / 1000), 1);
      if (nextTick >= this.timeLimit) {
        this.props.setModeratorLock(true);
        this.clearTimer();
        this.sounds.bikeHorn.play();
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
    this.sounds.tickTock.loop = true;
    this.sounds.tickTock.play();

    const interval = 100;
    this.actionTimer = setInterval(() => this.tick(interval), interval);

    return this.actionTimer;
  }

  clearTimer() {
    clearInterval(this.actionTimer);
    this.actionTimer = null;

    this.sounds.tickTock.currentTime = 0;
    this.sounds.tickTock.pause();

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

  handleKeyPress({ code, shiftKey } = event) {
    const key = `${shiftKey ? 'Shift+' : ''}${code}`;

    if (this.keys.includes(key)) {
      this.handleEscape(key);
      this.handleNextOrPrev(key);
      this.handleModeratorLock(key);
      this.handleBuzzer(key);
      this.handlePoints(key);
      this.handleTileLock(key);
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
    if (key === 'PageUp') {
      this.prevStage();
    } else if (key === 'PageDown') {
      this.nextStage();
    }
  }

  handleBuzzer(key) {
    const team1Wrong = this.props.getIsWrong(1, this.props.tile.id);
    const team2Wrong = this.props.getIsWrong(2, this.props.tile.id);

    if (
      this.props.hasModeratorLock === false &&
      this.actionTimer &&
      !this.state.answeringTeam &&
      !this.props.getIsLocked(this.props.tile.id) &&
      (!team1Wrong || !team2Wrong)
    ) {
      const buzz = () => {
        this.startTimer();
        this.sounds.currentTime = 0;
        this.sounds.tinyButton.play();
      }

      if (key === 'Digit1' && !team1Wrong) {
        buzz();
        this.setAnsweringTeam(1);
      } else if (key === 'Digit2' && !team2Wrong) {
        buzz();
        this.setAnsweringTeam(2);
      }
    }
  }

  handlePoints(key) {
    if (this.state.answeringTeam !== null) {

      const clearBuzzer = () => {
        this.clearTimer();
        this.setAnsweringTeam(null);
        this.props.setModeratorLock(true);
      }

      if (key === 'Equal') {
        this.props.awardPoints(this.state.answeringTeam, this.props.tile.id);
        this.props.setActiveTeam(this.state.answeringTeam);
        this.sounds.chaChing.play();
        this.props.setTileLock(false, this.props.tile.id);
        clearBuzzer();
      } else if (key === 'Minus') {
        this.props.deductPoints(this.state.answeringTeam, this.props.tile.id);
        this.sounds.sadTrombone.play();
        clearBuzzer();
      }
    }
  }

  handleModeratorLock(key) {
    if (key === 'KeyM' && !this.props.getIsLocked(this.props.tile.id)) {
      if (this.props.hasModeratorLock) {
        this.startTimer();
        this.setAnsweringTeam(null);
      } else {
        this.clearTimer();
      }

      this.props.toggleModeratorLock();
    }
  }

  handleTileLock(key) {
    if (key === 'KeyX' && this.props.hasModeratorLock) {
      this.props.toggleTileLock(this.props.tile.id);
    }
  }

  render({ title, onClose, tile, teams, ...rest } = this.props) {
    return (
      <div className="modal">
        <div className="modal__overlay" />
        <div className="modal__card">
          <button type="button" className="modal__close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
          <div className="modal__header">
            <Team
              number="1"
              isActive={this.state.answeringTeam === 1}
              isLocked={this.props.getIsWrong(1, this.props.tile.id)}
            >
              { teams[0] }
            </Team>
            <div>
              <div>
                { this.timer
                  ? this.state.elapsed
                  : <i className="fas fa-lock" />
                }
              </div>
              <Value isLocked={this.props.getIsLocked(this.props.tile.id)}>
                { title }
              </Value>
            </div>
            <Team
              number="2"
              isActive={this.state.answeringTeam === 2}
              isLocked={this.props.getIsWrong(2, this.props.tile.id)}
            >
              { teams[1] }
            </Team>
          </div>
          <div className="modal__content">
            { this.stages[this.state.stage] === 'question' &&
              <div className="modal__blurb">{tile.question}</div>
            }
            { this.stages[this.state.stage] === 'answer' &&
              <div className="modal__blurb">{tile.answer}</div>
            }
            { this.stages[this.state.stage] === 'recap' &&
              <div className="modal__blurb">
                {`${this.props.activeTeam === '1' ? teams[0] : teams[1]} control of the board`}
              </div>
            }
          </div>
          <div className="modal__controls">
            <button type="button" className="modal__show-controls" onClick={this.toggleOptions}>
              { this.state.optionsOpen
                ? <i className="fas fa-fw fa-caret-down" />
                : <i className="fas fa-fw fa-ellipsis-h" />
              }
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
