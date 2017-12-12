import React from 'react';
import { get } from 'lodash/object';
import { findIndex } from 'lodash/array';
import data from '../../mocks/christmas.json';
import { getValueFromIndex } from '../utils/helpers';
import { Board, Modal } from './';
import '../styles/components/game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTeam: null,
      activeTile: [0, 0],
      selectedTile: null,
      team1Right: [],
      team1Wrong: [],
      team2Right: [],
      team2Wrong: [],
    };

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.setActiveTeam = this.setActiveTeam.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
  }

  get selectedCategory() {
    return this.state.data.categories[this.state.activeTile[0]];
  }

  get selectedValue() {
    return getValueFromIndex(this.state.activeTile[1]);
  }

  get team1Score() {
    return this.getPoints(1) - this.getDeductions(1);
  }

  get team2Score() {
    return this.getPoints(2) - this.getDeductions(2);
  }

  getPoints(team) {
    return get(this.state, `team${team}Right`, []).reduce((points, id) => (
      points + this.state.data.tiles.reduce((value, category) => (
        value + getValueFromIndex(findIndex(category, cat => cat.id === id))
      ), 0)
    ), 0);
  }

  getDeductions(team) {
    return get(this.state, `team${team}Wrong`, []).reduce((points, id) => (
      points - this.state.data.tiles.reduce((value, category) => (
        value - getValueFromIndex(findIndex(category, cat => cat.id === id))
      ), 0)
    ), 0);
  }

  setActiveTeam(number) {
    this.setState({
      activeTeam: number,
    });
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

  awardTeam(team, id) {
    if (!this.state[`team${team}Right`].includes(id)) {
      this.setState(prevState => ({
        [`team${team}Right`]: prevState[`team${team}Right`].concat([id]),
      }));
    }
  }

  deductTeam(team, id) {
    if (!this.state[`team${team}Wrong`].includes(id)) {
      this.setState(prevState => ({
        [`team${team}Wrong`]: prevState[`team${team}Wrong`].concat([id]),
      }));
    }
  }

  render() {
    return (
      <div className="game">
        <Board
          selectTile={this.selectTile}
          activeTeam={this.state.activeTeam}
          setActiveTeam={this.setActiveTeam}
          team1Score={this.team1Score}
          team2Score={this.team2Score}
          {...data}
        />
        { this.state.selectedTile &&
          <Modal title={`${this.selectedCategory}: ${this.selectedValue}`} onClose={this.clearSelectedTile}>
            {this.state.selectedTile.question}
            <button type="button" onClick={() => this.awardTeam(1, this.state.selectedTile.id)}>
              Yes Team 1
            </button>
            <button type="button" onClick={() => this.awardTeam(2, this.state.selectedTile.id)}>
              Yes Team 2
            </button>

            <button type="button" onClick={() => this.deductTeam(1, this.state.selectedTile.id)}>
              No Team 1
            </button>
            <button type="button" onClick={() => this.deductTeam(2, this.state.selectedTile.id)}>
              No Team 2
            </button>
          </Modal>
        }
      </div>
    );
  }
}

export default Game;
