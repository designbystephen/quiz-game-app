import React from 'react';
import PropTypes from 'prop-types';
import { Team } from './';
import { constructClassName } from '../utils/helpers';
import '../styles/components/score-board.scss';

const ScoreBoard = ({ title, activeTeam, setActiveTeam, team1Score, team2Score, toggleEdit, isEdit, setGameTitle, setTeamName, teams, overScan, setOverScan }) => (
  <div className="score-board">
    <div
      className="score-board__team"
      onClick={() => setActiveTeam('1')}
    >
      <div className="score-board__score">
        $ {team1Score}
      </div>
      <Team number="1" isActive={activeTeam === '1'}>
        { isEdit
          ? <input type="text" value={teams[0]} onChange={({ target }) => setTeamName(0, target.value)} />
          : teams[0]
        }
      </Team>
    </div>
    <div className="score-board__title">
      { isEdit
        ? <input type="text" value={title} onChange={({ target }) => setGameTitle(target.value)} />
        : title
      }
      { isEdit &&
        <input type="range" min="1" max="5" value={overScan} onChange={({ target }) => setOverScan(target.value)} />
      }
      &nbsp;
      <button className="score-board__edit" type="button" id="gameEditButton" onClick={toggleEdit}>
        <i className="fa-fw fas fa-pencil-alt" />
      </button>
    </div>
    <div 
      className="score-board__team score-board__team--right"
      onClick={() => setActiveTeam('2')}
    >
      <div className="score-board__score">
        $ {team2Score}
      </div>
      <Team number="2" isActive={activeTeam === '2'}>
        { isEdit
          ? <input type="text" value={teams[1]} onChange={({ target }) => setTeamName(1, target.value)} />
          : teams[1]
        }
      </Team>
    </div>
  </div>
);

ScoreBoard.propTypes = {
  setActiveTeam: PropTypes.func.isRequired,
  title: PropTypes.string,  
  activeTeam: PropTypes.string,
};

export default ScoreBoard;
