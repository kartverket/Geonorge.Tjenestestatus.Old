/**
 * TickAxisY
 */
var TickAxisY = React.createClass({
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
    return <text x={this.props.x} y={this.props.y} dx={-3} dy={0} fill={this.props.stroke} fontSize={10} textAnchor="end">{this.props.payload.value} sek</text>
  }
});
