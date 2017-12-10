import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

const Category = ({ columnIndex, name, tiles=[] }) => (
  <div className="board__category">
    <Tile value={name} modifiers="board__tile--header" />
    {tiles.map((tile, tileIndex) => (
      <Tile value={tile.value} />
    ))}
  </div>
);

Category.propTypes = {
  name: PropTypes.string.isRequired,
  tiles: PropTypes.array,
};

export default Category;
