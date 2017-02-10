'use strict';

const React = require('react');

const Header = React.createClass({
  render() {
    return (
      <header id='header'><h1>{this.props.title}</h1></header>
    );
  }
});

module.exports = Header;
