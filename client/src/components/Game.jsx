import React from 'react';
import data from '../../mocks/christmas.json';
import { getValueFromIndex } from '../utils/helpers';
import { Board, Modal } from './';
import '../styles/components/game.scss';

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
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
  }

  get selectedCategory() {
    return this.state.data.categories[this.state.activeTile[0]];
  }

  get selectedValue() {
    return getValueFromIndex(this.state.activeTile[1]);
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

  clearSelectedTile() {
    this.setState({
      selectedTile: null,
    });
  }

  render() {
    return (
      <div className="game">
        <Board selectTile={this.selectTile} {...data} />

        { this.state.selectedTile &&
          <Modal title={`${this.selectedCategory}: ${this.selectedValue}`} onClose={this.clearSelectedTile}>
            {this.state.selectedTile.question}
          </Modal>
        }
      </div>
    );
  }
}

export default Game;
