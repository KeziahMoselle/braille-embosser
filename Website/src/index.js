// ReactJS
  import React, {Component} from 'react';
  import ReactDOM from 'react-dom';
  import PropTypes from 'prop-types';

// WebSocket

  import io from 'socket.io-client';

// Material-UI

  // Header
  import AppBar from 'material-ui/AppBar';
  import Toolbar from 'material-ui/Toolbar';
  
  // Card
  import Card, {CardActions, CardContent} from 'material-ui/Card';
  
  // Form & Input
  import Input, {InputLabel} from 'material-ui/Input';
  import {FormControl, FormHelperText} from 'material-ui/Form';
  import Button from 'material-ui/Button';
  
  // Display snackbar when submit
  import Snackbar from 'material-ui/Snackbar';
  
  // Tabs
  import Tabs, {Tab} from 'material-ui/Tabs';
  import SwipeableViews from 'react-swipeable-views';
  
  // CSS & Styling
  import Grid from 'material-ui/Grid';
  import Typography from 'material-ui/Typography';
  import {withStyles} from 'material-ui/styles';
  import grey from 'material-ui/colors/grey';
  import './index.css';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
});

class FullWidthTabs extends React.Component {
  state = {
  value: 0,
};

FullWidthTabs.leafGard.nemeTabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      text: '',
      open: false,
      vertical: 'bottom',
      horizontal: 'center',
      value: 0
    }
  }

  // Change state 'text'
  handleInput = event => {
    this.setState({text: event.target.value});
  }

  // Send text to the server
  print = () => {
    const socket = io('http://localhost:8080');
    socket.emit('print', this.state.text);
    this.setState({open: true});

  }

  // Close Snackbar
  handleClose = () => {
    this.setState({open: false});
  }

  handleChange = (event, value) => {
    this.setState({value});
  }

  handleChangeIndex = index => {
    this.setState({value: index});
  }

  render() {

    const { vertical, horizontal, open } = this.state;

    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              Braille Embosser
            </Typography>
          </Toolbar>
        </AppBar>

        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Wi-Fi" />
          <Tab label="NFC" />
          <Tab label="Bluetooth" />
        </Tabs>

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse': 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>Wi-Fi</TabContainer>
          <TabContainer dir={theme.direction}>NFC</TabContainer>
          <TabContainer dir={theme.direction}>Bluetooth</TabContainer>
        </SwipeableViews>

        <Snackbar
          anchorOrigin={{vertical, horizontal}}
          open={open}
          action={<Button color="secondary" size="small" onClick={this.handleClose}>Close</Button>}
          onClose={this.handleClose}
          message={<span id="message-id">Votre message a été envoyé.</span>}
        />
      </div>
    );

  }
}

ReactDOM.render(<App />, document.getElementById('root'));
