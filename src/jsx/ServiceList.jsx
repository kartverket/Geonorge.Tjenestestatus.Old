/**
 * ServiceList
 */
var ServiceList = React.createClass({
  /**
   * componentWillUnmount
   */
  componentWillUnmount: function() {
    this.serverRequest.abort();
    clearTimeout(this.timeoutHandler);
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
      lastUpdated: 0,
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
    if (this.timeoutHandler !== undefined) {
      clearTimeout(this.timeoutHandler);
      if (this.props.isActive == false) {
        delete this.timeoutHandler;
      }
    }

    var items = this.state.listItems.filter(function (item) {
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
    }, this.state.search);

    var listItems = [];
    var itemsFailed = 0;
    var itemCount = items.length;
    if (itemCount == 0) {
      var emptyMsg = '...';
      var emptyClass = 'active';
      listItems.push(
        <tr className={this.state.search == '' ? 'active' : 'danger'} key="empty">
          <td className="text-center" colSpan="5">
            <small>{this.state.search == '' ? 'Laster inn tjenester' : 'Søk etter "' + this.state.search + '" ga ingen treff'}</small>
          </td>
        </tr>
      );
    } else {
      items.sort(this.sortList.bind(null, [this.state.sortBy, this.state.sortDir]));
      for (var itemIndex = 0; itemIndex < itemCount; itemIndex++) {
        var item = items[itemIndex];
        if (item.status == false) {
          itemsFailed++;
        }
        listItems.push(<ListItemRow callback={this.props.tabOpen} checked={item.sjekket} key={item.uuid} name={item.service} owner={item.eier} response={item.svartid} status={item.status} ts={item.ts} uuid={item.uuid} />);
      }
    }

    if (this.props.isActive == true && this.state.isLoading == false) {
      var interval = this.timeoutHandler === undefined ? 0 : 10000;
      this.timeoutHandler = setTimeout(this.statusCheck, interval);
    }

    return (
      <div className={this.props.isActive ? 'servicelist active' : 'servicelist'}>
        <div className="row">
          <div className="col-sm-3">
            <p className="form-control-static">
              <strong>Sist oppdatert: </strong>
              {this.state.isLoading ? 'Laster inn...' : this.state.lastUpdated.toMinutes()}
            </p>
          </div>
          <div className="col-sm-3">
            <ProgressBar class="success" icon="ok-sign" total={itemCount} value={itemCount - itemsFailed} />
          </div>
          <div className="col-sm-3">
            <ProgressBar class="danger" icon="exclamation-sign" total={itemCount} value={itemsFailed} />
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
   * loadListItems
   */
  loadListItems: function () {
    var self = this;
    this.serverRequest = axios.get('https://status.geonorge.no/testmonitorApi/serviceList').then(function (response) {
      var items = [];
      for (var i = 0, j = response.data.length; i < j; i++) {
        var item = response.data[i];
        item.ts = new Date(item.sjekket).getTime();
        items.push(item);
      }
      self.setState({
        isLoading: false,
        lastUpdated: Date.now(),
        listItems: items
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
  },

  statusCheck: function () {
    var timeSinceLastReload = Math.floor((Date.now() - this.state.lastUpdated) / 1000);
    if (timeSinceLastReload > 120) {
      this.setState({
        isLoading: true
      }, this.loadListItems);
    } else {
      this.forceUpdate();
    }
  },
});
