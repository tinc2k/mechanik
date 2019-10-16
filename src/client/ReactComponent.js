'use strict';

const React = require('react');

class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false
    };
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    console.log('[ReactComponent] Mounted.');
  }
  render() {
    return (
      <header id='header'><h1>{this.props.title}</h1></header>
    );
  }
}

module.exports = ReactComponent;
