import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/object';
import { constructClassName } from '../utils/helpers';
import { Header, Category } from './';
import '../styles/components/board.scss';

const Board = ({ categories = [], tile, ...rest }) => (
  <div
    className={constructClassName(
      'board',
      [get(tile, 'id') !== undefined, 'board--blur'],
    )}
  >
    <Header {...rest} />
    <div className="board__tiles">
      {categories.map((category, index) => (
        <Category key={`category-${index}`} index={index} name={category} {...rest} />
      ))}
    </div>
  </div>
);

Board.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default Board;
