import React from 'react';
import data from '../../mocks/christmas.json';
import { Board } from './';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTile: [0, 0],
      selectedTile: null,
    };

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.selectTile = this.selectTile.bind(this);
  }

  setActiveTile(col, row) {
    this.setState({
      activeTile: [col, row],
    });
  }

  selectTile(col, row) {
    const tile = this.state.data.tiles[col][row];

    if (tile) {
      this.setState(() => ({
        selectedTile: tile,
      }), this.setActiveTile(col, row));
    }

    return tile;
  }

  render() {
    return (
      <Board {...data} selectTile={this.selectTile} />
    );
  }
}

export default Game;
