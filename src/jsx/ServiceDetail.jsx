/**
 * ServiceDetail
 */
var ServiceDetail = React.createClass({
  /**
   * componentWillReceiveProps
   */
  componentWillReceiveProps: function (props) {
    if (props.uuid != '') {
      var self = this;
      this.serverRequest = axios.get('https://status.geonorge.no/testmonitorApi/serviceDetail?uuid=' + props.uuid).then(function (response) {
        self.setState(response.data, self.tabSetName);
      });
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
      uuid: '',
    };
  },

  /**
   * getInitialState
   */
  getInitialState: function () {
    return {
    };
  },

  /**
   * propTypes
   */
  propTypes: {
    isActive: React.PropTypes.bool,
    tabSetName: React.PropTypes.func.isRequired,
    uuid: React.PropTypes.string
  },

  /**
   * render
   */
  render: function () {
    return (
      <div className={this.props.isActive ? 'servicedetail active' : 'servicedetail'}>
        <div className="well well-sm">
          <strong>UUID:</strong>
          {' '}
          {this.props.uuid}
        </div>
        <div className="row">
          <div className="col-sm-4">
            <table className="table">
              <tbody>
                <tr>
                  <th>Navn</th>
                  <td>{this.state.name}</td>
                </tr>
                <tr>
                  <th>Eier</th>
                  <td>{this.state.eier}</td>
                </tr>
                <tr>
                  <th>Svartid</th>
                  <td>{this.state.svartid}</td>
                </tr>
                <tr>
                  <th>Sjekket</th>
                  <td>{this.state.sjekket}</td>
                </tr>
                <tr>
                  <th>Oppetid</th>
                  <td>{this.state.uptime}</td>
                </tr>
                <tr>
                  <th>Melding</th>
                  <td>{this.state.melding}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm-8">
            Graph
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <a className="thumbnail" href={this.state.url} target="_blank">
              <img alt="" src={this.state.url} />
            </a>
          </div>
          <div className="col-sm-8">
            <ul className="list-group">
              <li className="list-group-item">
                <span className="badge">14</span>
                <a className="text-success" href="#">
                  <span className="glyphicon glyphicon-ok-sign" />
                  {' '}
                  <strong className="display-block">Får respons fra GetCapabilities</strong>
                  {' '}
                  <span className="glyphicon glyphicon-new-window" />
                </a>
                <br />
                <small className="display-block">Testkallet fikk respons fra GetCapabilities-kall mot adressen</small>
              </li>
              <li className="list-group-item">
                <span className="badge">no</span>
                <a className="text-danger" href="#">
                  <span className="glyphicon glyphicon-exclamation-sign" />
                  {' '}
                  <strong className="display-block">Oppgir nødvendig lisensinformasjon</strong>
                </a>
                <br />
                <small className="display-block">Tjenesten oppgir både Attribution og AccessConstraints</small>
              </li>
            </ul>
          </div>
        </div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  },

  /**
   * tabSetName
   */
  tabSetName: function () {
    this.props.tabSetName(this.props.uuid, this.state.name);
  }
});
