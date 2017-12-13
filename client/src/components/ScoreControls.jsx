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

const ScoreControls = ({ tileId, toggleTileLock, isLocked, ...rest }) => (
  <div>
    <div>
      Team 1
      <ScoreCheck teamNo="1" tileId={tileId} {...rest} />
    </div>
    <div>
      Team 2
      <ScoreCheck teamNo="2"  tileId={tileId} {...rest} />
    </div>
    <label>
      Locked
      <input type="checkbox" onChange={() => toggleTileLock(tileId)} checked={isLocked(tileId)} />
    </label>
  </div>
);

export default ScoreControls;
