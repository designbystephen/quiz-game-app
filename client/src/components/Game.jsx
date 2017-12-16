import React from 'react';
import { get } from 'lodash/object';
import { findIndex, pull, union } from 'lodash/array';
import { random, clamp } from 'lodash/number';
import data from '../../mocks/christmas.json';
import { getValueFromIndex, constructClassName } from '../utils/helpers';
import { Board, Modal } from './';
import '../styles/components/game.scss';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      activeTeam: `${random(1, 2)}`,
      activeTile: [0, 0],
      selectedTile: null,
      team1Right: [],
      team1Wrong: [],
      team2Right: [],
      team2Wrong: [],
      lockedTiles: [],
      hasModeratorLock: true,
      isEdit: false,
      overScan: 1,
    };

    this.keys = ['Digit1', 'Digit2', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'KeyW', 'KeyD', 'KeyS', 'KeyA'];

    // event handlers
    this.setActiveTile = this.setActiveTile.bind(this);
    this.setActiveTeam = this.setActiveTeam.bind(this);
    this.selectTile = this.selectTile.bind(this);
    this.clearSelectedTile = this.clearSelectedTile.bind(this);
    this.awardPoints = this.awardPoints.bind(this);
    this.deductPoints = this.deductPoints.bind(this);
    this.getIsRight = this.getIsRight.bind(this);
    this.getIsWrong = this.getIsWrong.bind(this);
    this.toggleTileLock = this.toggleTileLock.bind(this);
    this.getIsLocked = this.getIsLocked.bind(this);
    this.toggleModeratorLock = this.toggleModeratorLock.bind(this);
    this.setModeratorLock = this.setModeratorLock.bind(this);
    this.setTileLock = this.setTileLock.bind(this);
    this.getIsActiveTile = this.getIsActiveTile.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.setGameTitle = this.setGameTitle.bind(this);
    this.setTeamName = this.setTeamName.bind(this);
    this.setOverScan = this.setOverScan.bind(this);
  }

  componentDidMount() {
    // bind and listen for keys
    window.onkeyup = event => this.handleKeyPress(event);
    this.loadState();
  }

  componentWillUnmount() {
    // unbind key listener
    window.onkeyup = () => {};
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
    if (!this.state.isEdit) {
      this.setState({
        activeTeam: `${number}`,
      });
    }
  }

  setActiveTile(col, row) {
    this.setState({
      activeTile: [col, row],
    });
  }

  setModeratorLock(getIsLocked) {
    this.setState({
      hasModeratorLock: getIsLocked,
    });
  }

  setOverScan(value) {
    this.setState({
      overScan: clamp(value, 1, 5),
    });
  }

  getIsRight(team, id) {
    return get(this.state, `team${team}Right`, []).includes(id);
  }

  getIsWrong(team, id) {
    return get(this.state, `team${team}Wrong`, []).includes(id);
  }

  getIsActiveTile(col, row) {
    return this.state.activeTile[0] === col && this.state.activeTile[1] === row;
  }

  getIsLocked(id) {
    return this.state.lockedTiles.includes(id);
  }

  setTileLock(remove, id) {
    this.setState(prevState => ({
      lockedTiles: remove ? pull(prevState.lockedTiles, id) : union(prevState.lockedTiles, [id]),
    }));
  }

  setGameTitle(title) {
    this.setState((prevState) => {
      prevState.data.title = title;
      return { data: prevState.data };
    }, this.saveState);
  }

  setTeamName(teamNo, name) {
    this.setState((prevState) => {
      prevState.data.teams[teamNo] = name;
      return { data: prevState.data };
    }, this.saveState);
  }

  saveState() {
    localStorage.state = JSON.stringify(this.state);
  }

  loadState() {
    if (localStorage.getItem('state') && confirm('Are you sure you want to load state from local store? You may lose some changes.')) {
      const storage = JSON.parse(localStorage.state);
      console.log('storage', storage);
      this.setState(storage);
    } else {
      delete localStorage.state;
    }
  }

  toggleModeratorLock() {
    this.setState(prevState => ({
      hasModeratorLock: !prevState.hasModeratorLock,
    }));
  }

  toggleEdit() {
    this.setState(prevState => ({
      isEdit: !prevState.isEdit,
    }));
  }

  randomizeActiveTeam() {
    this.setState({
      activeTeam: random(1, 2),
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
    // rebind events
    this.setState({
      selectedTile: null,
    }, () => {
      window.onkeyup = event => this.handleKeyPress(event);
    });
  }

  awardPoints(team, id) {
    this.setState((prevState) => {
      const state = {
        // remove wrong tally
        [`team${team}Wrong`]: pull(this.state[`team${team}Wrong`], id),

        // remove another team's right tally
        [`team${team === '1' ? '2' : '1'}Right`]: pull(this.state[`team${team === '1' ? '2' : '1'}Right`], id),
      };

      if (prevState[`team${team}Right`].includes(id)) {
        // toggle points (remove awarded points)
        state[`team${team}Right`] = pull(prevState[`team${team}Right`], id);
      } else {
        // award points
        state[`team${team}Right`] = union(prevState[`team${team}Right`], [id]);
      }

      return state;
    }, this.saveState);
  }

  deductPoints(team, id) {
    this.setState((prevState) => {
      const state = {
        [`team${team}Right`]: pull(this.state[`team${team}Right`], id),
      };

      if (prevState[`team${team}Wrong`].includes(id)) {
        // toggle points (remove deducted points)
        state[`team${team}Wrong`] = pull(prevState[`team${team}Wrong`], id);
      } else {
        // deduct points
        state[`team${team}Wrong`] = union(prevState[`team${team}Wrong`], [id]);
      }

      return state;
    }, this.saveState);
  }

  toggleTileLock(id) {
    this.setState(prevState => ({
      lockedTiles: prevState.lockedTiles.includes(id)
        ? pull(prevState.lockedTiles, id)
        : union(prevState.lockedTiles, [id]),
    }), this.saveState);
  }

  handleKeyPress({ code, shiftKey } = event) {
    const key = `${shiftKey ? 'Shift+' : ''}${code}`;

    if (this.keys.includes(key) && this.state.selectedTile === null && !this.state.isEdit) {
      this.handleDirections(key);
      this.handleSelect(key);
    }
  }

  handleDirections(key) {
    const activeTile = this.state.activeTile;

    if (this.state.activeTeam === '1' && key === 'ArrowUp' || this.state.activeTeam === '2' && key === 'KeyW') {
      this.setActiveTile(activeTile[0], clamp(activeTile[1] - 1, 0, 4));
    }

    if (this.state.activeTeam === '1' && key === 'ArrowRight' || this.state.activeTeam === '2' && key === 'KeyD') {
      this.setActiveTile(clamp(activeTile[0] + 1, 0, 4), activeTile[1]);
    }

    if (this.state.activeTeam === '1' && key === 'ArrowDown' || this.state.activeTeam === '2' && key === 'KeyS') {
      this.setActiveTile(activeTile[0], clamp(activeTile[1] + 1, 0, 4));
    }

    if (this.state.activeTeam === '1' && key === 'ArrowLeft' || this.state.activeTeam === '2' && key === 'KeyA') {
      this.setActiveTile(clamp(activeTile[0] - 1, 0, 4), activeTile[1]);
    }
  }

  handleSelect(key) {
    if (this.state.activeTeam === '1' && key === 'Digit1' || this.state.activeTeam === '2' && key === 'Digit2') {
      this.selectTile(this.state.activeTile[0], this.state.activeTile[1]);
    }
  }

  render() {
    return (
      <div
        className={constructClassName(
          'game',
          [this.state.overScan === 2, 'game--small'],
          [this.state.overScan === 3, 'game--medium'],
          [this.state.overScan === 4, 'game--large'],
          [this.state.overScan === 5, 'game--x-large'],
        )}
      >
        <Board
          tile={this.state.selectedTile}
          selectTile={this.selectTile}
          activeTeam={this.state.activeTeam}
          setActiveTeam={this.setActiveTeam}
          team1Score={this.team1Score}
          team2Score={this.team2Score}
          getIsRight={this.getIsRight}
          getIsWrong={this.getIsWrong}
          getIsLocked={this.getIsLocked}
          hasModeratorLock={this.state.hasModeratorLock}
          getIsActiveTile={this.getIsActiveTile}
          isEdit={this.state.isEdit}
          toggleEdit={this.toggleEdit}
          setTeamName={this.setTeamName}
          setGameTitle={this.setGameTitle}
          overScan={this.state.overScan}
          setOverScan={this.setOverScan}
          {...data}
        />
        { this.state.selectedTile &&
          <Modal
            title={`${this.selectedCategory}: ${this.selectedValue}`}
            tile={this.state.selectedTile}
            onClose={this.clearSelectedTile}
            awardPoints={this.awardPoints}
            deductPoints={this.deductPoints}
            getIsRight={this.getIsRight}
            getIsWrong={this.getIsWrong}
            toggleTileLock={this.toggleTileLock}
            setTileLock={this.setTileLock}
            getIsLocked={this.getIsLocked}
            hasModeratorLock={this.state.hasModeratorLock}
            setModeratorLock={this.setModeratorLock}
            toggleModeratorLock={this.toggleModeratorLock}
            activeTeam={this.state.activeTeam}
            setActiveTeam={this.setActiveTeam}
            team1Score={this.team1Score}
            team2Score={this.team2Score}
          />
        }
      </div>
    );
  }
}

export default Game;
