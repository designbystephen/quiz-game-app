import React from 'react';
import PropTypes from 'prop-types';

const ScoreCheck = ({ teamNo, deductPoints, awardPoints, isWrong, isRight, tileId }) => (
  <span>
    <label htmlFor={`team${teamNo}AwardCheckbox`}>
      <input
        id={`team${teamNo}AwardCheckbox`}
        type="checkbox"
        onChange={() => awardPoints(teamNo, tileId)}
        checked={isRight(teamNo, tileId) === true}
      />
      Right
    </label>
    <label htmlFor={`team${teamNo}DeductCheckbox`}>
      <input
        id={`team${teamNo}DeductCheckbox`}
        type="checkbox"
        onChange={() => deductPoints(teamNo, tileId)}
        checked={isWrong(teamNo, tileId) === true}
      />
      Wrong
    </label>
  </span>
);

const ScoreControls = ({
  tileId,
  toggleTileLock,
  isLocked,
  hasModeratorLock,
  toggleModeratorLock,
  nextStage,
  prevStage,
  currentStage,
  ...rest
}) => (
  <div>
    <div>
      <button type="button" id="prevStageButton" onClick={prevStage}>Prev</button>
      { currentStage }
      <button type="button" id="nextStageButton" onClick={nextStage}>Next</button>
    </div>
    <div>
      Team 1
      <ScoreCheck teamNo="1" tileId={tileId} {...rest} />
    </div>
    <div>
      Team 2
      <ScoreCheck teamNo="2" tileId={tileId} {...rest} />
    </div>
    <div>
      Tile
      <label htmlFor="tileLockCheckbox">
        <input
          id="tileLockCheckbox"
          type="checkbox"
          onChange={() => toggleTileLock(tileId)}
          checked={isLocked(tileId)}
        />
        Locked
      </label>
    </div>
    <div>
      Moderator
      <label htmlFor="moderatorLockCheckbox">
        <input
          id="moderatorLockCheckbox"
          type="checkbox"
          onChange={() => toggleModeratorLock(tileId)}
          checked={hasModeratorLock}
        />
        Locked
      </label>
    </div>
  </div>
);

export default ScoreControls;
