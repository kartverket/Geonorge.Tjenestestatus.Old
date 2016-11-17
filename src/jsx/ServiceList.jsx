/**
 * ServiceList
 */
var ServiceList = React.createClass({
  /**
   * componentDidMount
   */
  componentDidMount: function () {
    this.setState({
      isLoading: true
    }, this.loadListItems);
  },

  /**
   * componentWillUnmount
   */
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      isActive: false,
    };
  },

  /**
   * getInitialState
   */
  getInitialState: function () {
    return {
      isLoading: false,
      listItems: []
    };
  },

  /**
   * propTypes
   */
  propTypes: {
    isActive: React.PropTypes.bool,
    tabOpen: React.PropTypes.func.isRequired
  },

  /**
   * render
   */
  render: function () {
    var listItems = this.state.listItems.map(function (item) {
      return (
        <tr key={item.uuid}>
          <td>
            <a href={'https://kartkatalog.geonorge.no/metadata/org/title/' + item.uuid} target="_blank">
              {item.service}
            </a>
          </td>
          <td>{item.eier}</td>
          <td className="text-right">
            <div className={item.status ? 'label label-success' : 'label label-danger'}>
              {item.svartid}
              {' sek'}
            </div>
          </td>
          <td>{item.sjekket}</td>
          <td>
            <a href="#" onClick={this.itemClickHandler.bind(this, item.uuid)}>
              <span className="glyphicon glyphicon-info-sign" />
            </a>
          </td>
        </tr>
      );
    }, this);
    return (
      <div className={this.props.isActive ? 'servicelist active' : 'servicelist'}>
        <div className="alert alert-info" style={{display: this.state.isLoading ? 'block' : 'none'}}> Laster inn </div>
        <table className="table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Eier</th>
              <th>Status</th>
              <th>Sist sjekket</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {listItems}
          </tbody>
        </table>
      </div>
    );
  },

  /**
   * itemClickHandler
   */
  itemClickHandler: function (uuid, event) {
    event.preventDefault();
    this.props.tabOpen(uuid);
  },

  /**
   * loadListItems
   */
  loadListItems: function () {
    var self = this;
    this.serverRequest = axios.get('https://status.geonorge.no/testmonitorApi/serviceList').then(function (response) {
      self.setState({
        isLoading: false,
        listItems: response.data
      });
    });
  }
});
