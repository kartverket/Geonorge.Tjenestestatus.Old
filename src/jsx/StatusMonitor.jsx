/**
 * StatusMonitor
 */
var StatusMonitor = React.createClass({
  /**
   * componentDidMount
   */
  componentDidMount: function () {
    var queryObject = this.getQueryObject();
    var uuid = queryObject.hasOwnProperty('uuid') ? queryObject.uuid : '';
    this.tabOpen(uuid);
  },

  /**
   * getInitialState
   */
  getInitialState: function () {
    return {
      tabs: [],
      uuid: '',
      view: 'none'
    };
  },

  /**
   * render
   */
  render: function () {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Tjenestestatus</h1>
        </div>
        <NavTabs tabClose={this.tabClose} tabOpen={this.tabOpen} uuid={this.state.uuid}>{this.state.tabs}</NavTabs>
        <ServiceList isActive={this.state.view == 'list' ? true : false} tabOpen={this.tabOpen} />
        <ServiceDetail isActive={this.state.view == 'detail' ? true : false} tabSetName={this.tabSetName} uuid={this.state.uuid} />
      </div>
    );
  },

  /**
   * getQueryObject
   */
  getQueryObject: function (queryString) {
    if (queryString === undefined || queryString === null || queryString === '') {
      var queryString = window.location.search;
    }
    var pairs = queryString.indexOf('?') === 0 ? decodeURIComponent(queryString).split('?').pop().split('&') : [];
    var queryObject = {};
    for (var i = 0, j = pairs.length; i < j; i++) {
      var kv = pairs[i].split('=');
      var key = kv[0].trim();
      var val = kv[1] == undefined || kv[1] == '' ? '' : kv[1].trim();
      if (val != '') {
        queryObject[key] = val;
      }
    }
    return queryObject;
  },

  /**
   * getQueryString
   */
  getQueryString: function (queryObject) {
    var queryString = '';
    var keys = Object.keys(queryObject);
    for (var i = 0, j = keys.length; i < j; i++) {
      var key = keys[i];
      queryString += i == 0 ? '?' : '&';
      queryString += key + '=' + queryObject[key];
    }
    return queryString;
  },

  /**
   * tabClose
   */
  tabClose: function (uuid) {
    var newState = {};

    if (uuid == this.state.uuid) {
      newState.uuid = '';
      newState.view = 'list';

      if (window.history && window.history.replaceState) {
        var queryObject = this.getQueryObject();
        delete queryObject.uuid;
        var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + this.getQueryString(queryObject);
        history.pushState(queryObject, null, newUrl);
      }
    }

    newState.tabs = [];
    for (var i = 0, j = this.state.tabs.length; i < j; i++) {
      if (this.state.tabs[i].uuid != uuid) {
        newState.tabs.push(this.state.tabs[i]);
      }
    }

    this.setState(newState);
  },

  /**
   * tabOpen
   */
  tabOpen: function (uuid) {
    var index = this.state.tabs.map(function (tab) { return tab.uuid; }).indexOf(uuid);
    var newState = {};

    newState.uuid = uuid;
    newState.view = uuid == '' ? 'list' : 'detail';

    if (index == -1 && uuid != '') {
      newState.tabs = this.state.tabs.concat({
        uuid: uuid,
        name: ''
      });
    }

    if (window.history && window.history.replaceState) {
      var queryObject = Object.assign({uuid: ''}, this.getQueryObject());
      if (queryObject.uuid != uuid) {
        if (uuid == '') {
          delete queryObject.uuid;
        } else {
          queryObject.uuid = uuid;
        }
        var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + this.getQueryString(queryObject);
        history.pushState(queryObject, null, newUrl);
      }
    }

    this.setState(newState);
  },

  /**
   * tabSetName
   */
  tabSetName: function (uuid, name) {
    var tabs = this.state.tabs;
    var index = tabs.map(function (item) { return item.uuid }).indexOf(uuid);
    if (index != -1 && tabs[index].name == '') {
      tabs[index].name = name;
      this.setState({
        tabs: tabs
      });
    }
  }
});
