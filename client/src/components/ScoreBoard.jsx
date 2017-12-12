import React from 'react';
import PropTypes from 'prop-types';
import { constructClassName } from '../utils/helpers';
import '../styles/components/score-board.scss';

const ScoreBoard = ({ title, activeTeam, setActiveTeam, team1Score, team2Score }) => (
  <div className="score-board">
    <div
      className={constructClassName(
        'score-board__team',
        [activeTeam === 1, 'score-board__team--active'],
      )}
      onClick={() => setActiveTeam(1)}
    >
      <div className="score-board__score">
        $ {team1Score}
      </div>
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
      <div className="score-board__score">
        $ {team2Score}
      </div>
      Team 2
    </div>
  </div>
);

ScoreBoard.propTypes = {
  title: PropTypes.string.isRequired,
  setActiveTeam: PropTypes.func.isRequired,
  activeTeam: PropTypes.number,
};

export default ScoreBoard;
