/**
 * NavTabs
 */
var NavTabs = React.createClass({
  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      children: [],
      uuid: '',
    };
  },

  /**
   * propTypes
   */
  propTypes: {
    children: React.PropTypes.array,
    tabClose: React.PropTypes.func.isRequired,
    tabOpen: React.PropTypes.func.isRequired,
    uuid: React.PropTypes.string
  },

  /**
   * render
   */
  render: function () {
    var tabItems = this.props.children.map(function (item) {
      var isActive = item.uuid == this.props.uuid ? true : false;
      var nameIsEmpty = item.name == '' ? true : false;
      return (
        <li className={isActive ? 'active' : null} key={item.uuid} onClick={this.tabClickHandler.bind(this, item.uuid)} role="presentation">
          <a href={item.uuid}>
            {item.name}
            <span className={nameIsEmpty ? 'glyphicon glyphicon-hourglass' : 'glyphicon glyphicon-remove-sign'} />
          </a>
        </li>
      );
    }, this);
    return (
      <div className="navtabs">
        <ul className="nav nav-tabs">
          <li className={this.props.uuid == '' ? 'active' : null} onClick={this.tabClickHandler.bind(this, '')} role="presentation">
            <a href="#">Tjenester</a>
          </li>
          {tabItems}
        </ul>
      </div>
    );
  },

  /**
   * tabClickHandler
   */
  tabClickHandler: function (uuid, event) {
    event.preventDefault();
    if (event.target.nodeName.toLowerCase() == 'span') {
      this.props.tabClose(uuid);
    } else {
      this.props.tabOpen(uuid);
    }
  }
});
