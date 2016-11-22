/**
 * ServiceList
 */
var ServiceList = React.createClass({
  /**
   * componentWillReceiveProps
   */
  componentWillReceiveProps: function (props) {
    if (props.isActive != this.props.isActive && props.isActive == true && this.state.isLoading == false) {
      if (Date.now() > this.state.expires) {
        this.setState({
          isLoading: true
        }, this.loadListItems);
      }
    }
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
      expires: 0,
      isLoading: false,
      listItems: [],
      search: '',
      sortDir: 'asc',
      sortBy: 'service'
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
    var listItems = this.state.listItems.filter(function (item) {
      var isRelevant = true;
      if (this != '') {
        var hits = 0;
        if (item.service.toLowerCase().indexOf(this) !== -1) {
          hits++;
        }
        if (item.eier.toLowerCase().indexOf(this) !== -1) {
          hits++;
        }
        if (hits == 0) {
          isRelevant = false;
        }
      }
      return isRelevant;
    }, this.state.search).sort(this.sortList.bind(null, [this.state.sortBy, this.state.sortDir])).map(function (item) {
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
        <div className="row">
          <div className="col-sm-3">
            <p className="form-control-static">
              {this.state.isLoading ? 'Laster inn' : 'Ferdig'}
            </p>
          </div>
          <div className="col-sm-3">
            <p className="form-control-static">
              95%
            </p>
          </div>
          <div className="col-sm-3">
            <p className="form-control-static">
              5%
            </p>
          </div>
          <div className="col-sm-3">
            <FormGroupSearch callback={this.searchHandler} value={this.state.search} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <ListItemHead id="service" sortBy={this.state.sortBy} sortDir={this.state.sortDir} sortHandler={this.sortHandler}>Navn</ListItemHead>
              <ListItemHead id="eier" sortBy={this.state.sortBy} sortDir={this.state.sortDir} sortHandler={this.sortHandler}>Eier</ListItemHead>
              <ListItemHead id="svartid" sortBy={this.state.sortBy} sortDir={this.state.sortDir} sortHandler={this.sortHandler}>Status</ListItemHead>
              <ListItemHead id="sjekket" sortBy={this.state.sortBy} sortDir={this.state.sortDir} sortHandler={this.sortHandler}>Sjekket</ListItemHead>
              <th>&nbsp;</th>
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
      var refreshInterval = 5; //minutes
      self.setState({
        expires: Date.now() + (refreshInterval * 60 * 1000),
        isLoading: false,
        listItems: response.data
      });
    });
  },

  /**
   * searchHandler
   */
  searchHandler: function (str) {
    this.setState({
      search: str
    });
  },

  /**
   * sortHandler
   */
  sortHandler: function (sortBy) {
    var newState = {};
    if (sortBy == this.state.sortBy) {
      newState.sortDir = this.state.sortDir == 'asc' ? 'desc' : 'asc';
    } else {
      newState.sortDir = 'asc';
      newState.sortBy = sortBy;
    }
    this.setState(newState);
  },

  /**
   * sortList
   */
  sortList: function (options, a, b) {
    var direction = 0;
    if (options[0] !== undefined && options[1] !== undefined) {
      var key = options[0];
      var value = options[1] == 'desc' ? 1 : -1;
      if (a[key] < b[key]) {
        direction = value;
      }
      if (a[key] > b[key]) {
        direction = value * -1;
      }
    }
    return direction;
  }
});
