/**
 * ListItemHead
 */
var ListItemHead = React.createClass({
  /**
   * propTypes
   */
  propTypes: {
    children: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    sortBy: React.PropTypes.string.isRequired,
    sortDir: React.PropTypes.string.isRequired,
    sortHandler: React.PropTypes.func.isRequired
  },

  /**
   * render
   */
  render: function () {
    var iconClass = 'glyphicon ';
    if (this.props.id == this.props.sortBy) {
      switch (this.props.sortDir) {
        case 'asc':
          iconClass += 'glyphicon-sort-by-attributes';
          break;
        case 'desc':
          iconClass += 'glyphicon-sort-by-attributes-alt';
          break;
      }
    } else {
      iconClass += 'glyphicon-sort';
    }
    return (
      <th onClick={this.clickHandler}>
        {this.props.children}
        {' '}
        <span className={iconClass} />
      </th>
    );
  },

  /**
   * clickHandler
   */
  clickHandler: function (event) {
    event.preventDefault();
    this.props.sortHandler(this.props.id);
  }
});
