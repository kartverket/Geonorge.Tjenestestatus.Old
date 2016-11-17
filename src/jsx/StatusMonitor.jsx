/**
 * StatusMonitor
 */
var StatusMonitor = React.createClass({
  /**
   * getInitialState
   */
  getInitialState: function () {
    return {
      tabs: [],
      uuid: ''
    };
  },

  /**
   * render
   */
  render: function () {
    var isListActive = this.state.uuid == '' ? true : false;
    var isDetailActive = !isListActive;
    return (
      <div className="container">
        <div className="page-header">
          <h1>Tjenestestatus</h1>
        </div>
        <NavTabs tabClose={this.tabClose} tabOpen={this.tabOpen} uuid={this.state.uuid}>{this.state.tabs}</NavTabs>
        <ServiceList isActive={isListActive} tabOpen={this.tabOpen} />
        <ServiceDetail isActive={isDetailActive} tabSetName={this.tabSetName} uuid={this.state.uuid} />
      </div>
    );
  },

  /**
   * tabClose
   */
  tabClose: function (uuid) {
    var newState = {};

    if (uuid == this.state.uuid) {
      newState.uuid = '';
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

    if (index == -1 && uuid != '') {
      newState.tabs = this.state.tabs.concat({
        uuid: uuid,
        name: ''
      });
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
