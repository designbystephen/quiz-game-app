import React from 'react';
import PropTypes from 'prop-types';
import { Header, Category } from './';
import '../styles/components/board.scss';

const Board = ({ categories = [], ...rest }) => (
  <div className="board">
    <Header />
    <div className="board__tiles">
      {categories.map((category, index) => (
        <Category key={`category-${index}`} index={index} name={category} {...rest} />
      ))}
    </div>
  </div>
);

Board.propTypes = {
  categories: PropTypes.array,
};

export default Board;
