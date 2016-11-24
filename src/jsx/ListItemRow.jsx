/**
 * ListItemRow
 */
var ListItemRow = React.createClass({
  /**
   * propTypes
   */
  propTypes: {
    callback: React.PropTypes.func.isRequired,
    checked: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    uuid: React.PropTypes.string.isRequired,
    owner: React.PropTypes.string.isRequired,
    response: React.PropTypes.number.isRequired,
    status: React.PropTypes.bool.isRequired
  },

  /**
   * render
   */
  render: function () {
    var updated = new Date(this.props.checked);
    var minutes = Math.floor((Date.now() - updated.getTime()) / 60000);
    return (
      <tr>
        <td>
          <a className="small" href={'https://kartkatalog.geonorge.no/metadata/org/title/' + this.props.uuid} target="_blank">
            {this.props.name}
          </a>
        </td>
        <td>
          <span className="small">{this.props.owner}</span>
        </td>
        <td className="text-right">
          <div className={this.props.status ? 'label label-success' : 'label label-danger'}>
            {this.props.response}
            {' sek'}
          </div>
        </td>
        <td>
          <time className="small" dateTime={this.props.checked}>{minutes == 0 ? 'Nå!' : minutes + ' min siden'}</time>
        </td>
        <td>
          <a href="#" onClick={this.clickHandler}>
            <span className="glyphicon glyphicon-info-sign" />
          </a>
        </td>
      </tr>
    );
  },

  /**
   * clickHandler
   */
  clickHandler: function (event) {
    event.preventDefault();
    this.props.callback(this.props.uuid);
  }
});
