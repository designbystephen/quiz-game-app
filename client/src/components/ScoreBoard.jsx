import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/score-board.scss';

const ScoreBoard = ({ title }) => (
  <div className="score-board">
    <div className="score-board__team">
      <div className="score-board__score">$0</div>
      Team 1
    </div>
    <div className="score-board__title">
      { title }
    </div>
    <div className="score-board__team score-board__team--right">
      <div className="score-board__score">$0</div>
      Team 2
    </div>
  </div>
);

ScoreBoard.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ScoreBoard;
