import React from 'react';
import PropTypes from 'prop-types';
import { constructClassName } from '../utils/helpers';
import '../styles/components/score-board.scss';

const ScoreBoard = ({ title, activeTeam, setActiveTeam }) => (
  <div className="score-board">
    <div
      className={constructClassName(
        'score-board__team',
        [activeTeam === 1, 'score-board__team--active'],
      )}
      onClick={() => setActiveTeam(1)}
    >
      <div className="score-board__score">$0</div>
      Team 1
    </div>
    <div className="score-board__title">
      { title }
    </div>
    <div
      className={constructClassName(
        'score-board__team',
        'score-board__team--right',
        [activeTeam === 2, 'score-board__team--active'],
      )}
      onClick={() => setActiveTeam(2)}
    >
      <div className="score-board__score">$0</div>
      Team 2
    </div>
  </div>
);

ScoreBoard.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ScoreBoard;
