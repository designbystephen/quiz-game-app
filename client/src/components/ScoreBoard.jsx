import React from 'react';
import PropTypes from 'prop-types';
import { Team } from './';
import { constructClassName } from '../utils/helpers';
import '../styles/components/score-board.scss';

const ScoreBoard = ({ title, activeTeam, setActiveTeam, team1Score, team2Score }) => (
  <div className="score-board">
    <div
      className="score-board__team"
      onClick={() => setActiveTeam(1)}
    >
      <div className="score-board__score">
        $ {team1Score}
      </div>
      <Team number="1" isActive={activeTeam === 1}>
        Team 1
      </Team>
    </div>
    <div className="score-board__title">
      { title }
      &nbsp;
      <button className="score-board__edit" type="button" id="gameEditButton">
        <i className="fa-fw fas fa-pencil-alt" />
      </button>
    </div>
    <div 
      className="score-board__team score-board__team--right"
      onClick={() => setActiveTeam(2)}
    >
      <div className="score-board__score">
        $ {team2Score}
      </div>
      <Team number="2" isActive={activeTeam === 2}>
        Team 2
      </Team>
    </div>
  </div>
);

ScoreBoard.propTypes = {
  title: PropTypes.string.isRequired,
  setActiveTeam: PropTypes.func.isRequired,
  activeTeam: PropTypes.number,
};

export default ScoreBoard;
