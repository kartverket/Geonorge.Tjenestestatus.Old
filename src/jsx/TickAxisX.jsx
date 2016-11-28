/**
 * TickAxisX
 */
var TickAxisX = React.createClass({
  getDefaultProps: function () {
    return {
      payload: {},
      stroke: '#333',
      x: 0,
      y: 0
    };
  },

  /**
   * render
   */
  render: function () {
    return <text x={this.props.x} y={this.props.y} dx={4} dy={11} fill={this.props.stroke} fontSize={10} textAnchor="end">{this.props.payload.value.substr(11, 5)}</text>
  }
});
