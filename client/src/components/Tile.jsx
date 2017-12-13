import React from 'react';
import PropTypes from 'prop-types';
import { getValueFromIndex, constructClassName } from '../utils/helpers';

const Tile = ({ col, row, selectTile, tile, hasWrong, hasRight, isLocked }) => {
  // TODO: hasRight as const
  return (
    <div
      className={constructClassName(
        'board__tile',
        [hasRight(1, tile.id), 'board__tile--team1'],
        [hasRight(2, tile.id), 'board__tile--team2'],
        [isLocked(tile.id), 'board__tile--locked'],
      )}
      onClick={ () => selectTile(col, row)}
    >
      { getValueFromIndex(row) }
    </div>
  );
};

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  selectTile: PropTypes.func.isRequired,
};

export default Tile;
