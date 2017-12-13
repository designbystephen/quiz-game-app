import React from 'react';
import PropTypes from 'prop-types';

const ScoreCheck = ({ teamNo, deductPoints, awardPoints, hasWrong, hasRight, tileId }) => (
  <div>
    <label>
      <input type="checkbox" onChange={() => awardPoints(teamNo, tileId)} checked={hasRight(teamNo, tileId) === true} />
      Right
    </label>
    <label>
      <input type="checkbox" onChange={() => deductPoints(teamNo, tileId)} checked={hasWrong(teamNo, tileId) === true} />
      Wrong
    </label>
  </div>
);

const ScoreControls = ({ ...rest }) => (
  <div>
    <div>
      Team 1
      <ScoreCheck teamNo="1" {...rest} />
    </div>
    <div>
      Team 2
      <ScoreCheck teamNo="2" {...rest} />
    </div>
  </div>
);

export default ScoreControls;
