import React from 'react';
import PropTypes from 'prop-types';
import { CategoryHeader, Tile } from './';

const Category = ({ name, index, tiles = [], ...rest }) => (
  <div className="board__category">
    <CategoryHeader text={name} />
    {tiles.map((tile, tileIndex) => (
      <Tile key={`tile-${index}-${tileIndex}`} col={index} row={tileIndex} tile={tile[tileIndex]} {...rest} />
    ))}
  </div>
);

Category.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  tiles: PropTypes.array,
};

export default Category;
