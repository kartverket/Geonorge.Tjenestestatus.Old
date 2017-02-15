/**
 * ServiceDetail
 */
var ServiceDetail = React.createClass({
  /**
   * componentWillReceiveProps
   */
  componentWillReceiveProps: function (props) {
    if (props.uuid != '') {
      var diff = Math.floor((Date.now() - this.state.lastUpdated) / 60000);
      if (props.uuid != this.props.uuid || diff > 2) {
        this.setState({
          isDetailLoading: true,
          isResponseLoading: true
        }, this.loadDetailData);
      } else {
        this.forceUpdate();
      }
    }
  },

  /**
   * componentWillUnmount
   */
  componentWillUnmount: function() {
    if (this.serverRequestDetail !== undefined) {
      this.serverRequestDetail.abort();
    }
    if (this.serverRequestResponse !== undefined) {
      this.serverRequestResponse.abort();
    }
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
      chartData: [],
      isDetailLoading: false,
      isResponseLoading: false,
      lastUpdated: 0
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
        <div className="row">
          <div className="col-sm-12">
            <ResponsiveContainer height={300}>
              <LineChart data={this.state.chartData}>
                <Line dataKey="svartid" dot={false} type="monotone" />
                <XAxis dataKey="timestamp" interval={11} tick={<TickAxisX />} />
                <YAxis tick={<TickAxisY />} />
                <CartesianGrid strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <table className="table">
              <colgroup>
                <col width="30%" />
                <col width="70%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>Navn</th>
                  <td>{this.getState('name')}</td>
                </tr>
                <tr>
                  <th>Eier</th>
                  <td>{this.getState('eier')}</td>
                </tr>
                <tr>
                  <th>Svartid</th>
                  <td>{this.getState('svartid', '0')} sek</td>
                </tr>
                <tr>
                  <th>Sjekket</th>
                  <td>
                    <time dateTime={this.getState('sjekket')}>{this.getState('ts', 0).toMinutes()}</time>
                  </td>
                </tr>
                <tr>
                  <th>Oppetid</th>
                  <td>{this.getState('uptime')}%</td>
                </tr>
                <tr>
                  <th>Melding</th>
                  <td>{this.getState('melding')}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <a className="thumbnail" href={this.state.url} target="_blank">
              <img alt="" src={this.state.url} />
            </a>
          </div>
          <div className="col-sm-8">
            <table className="table">
              <colgroup>
                <col width="7%" />
                <col width="70%" />
                <col width="16%" />
                <col width="7%" />
              </colgroup>
              <tbody>
                <StatusItem params={this.state.connect}>
                  <h5>Får respons fra GetCapabilities</h5>
                  <p>Testkallet fikk respons fra GetCapabilities-kall mot adressen</p>
                </StatusItem>
                <StatusItem params={this.state.email}>
                  <h5>Har utfylt kontaktepostadresse</h5>
                  <p>GetCapabilities responsen inneholder en epostadresse til kontaktperson hos tjenesteansvarlig</p>
                </StatusItem>
                <StatusItem params={this.state.cors}>
                  <h5>CORS parametre er satt korrekt</h5>
                  <p>HTTP responsen for GetCapabilities-kallet inneholder korrekte  CORS parametre i feltet Access-Control-Allow-Origin</p>
                </StatusItem>
                <StatusItem params={this.state.epsgSupported}>
                  <h5>Støtter EPSG:32633 eller 25833</h5>
                  <p>GetCapabilities oppgir at tjenesten støtter EUREF89 UTM sone 33 eller ETRS89 UTM sone 33</p>
                </StatusItem>
                <StatusItem params={this.state.hasGFI}>
                  <h5>Støtter egenskapsspørringer</h5>
                  <p>GetCapabilities responsen oppgir at tjenesten støtter GetFeatureInfo-kallet</p>
                </StatusItem>
                <StatusItem params={this.state.hasLegend}>
                  <h5>Støtter tegnforklaringer</h5>
                  <p>GetCapabilities responsen oppgir at tjenesten støtter GetLegendGraphics-kallet eller LegendURL-kallet</p>
                </StatusItem>
                <StatusItem params={this.state.hasACA}>
                  <h5>Oppgir nødvendig lisensinformasjon</h5>
                  <p>Tjenesten oppgir både Attribution og AccessConstraints</p>
                </StatusItem>
                <StatusItem params={this.state.gfiOnGroupError}>
                  <h5>Støtter egenskapsspørringer på gruppelag</h5>
                  <p>GetCapabilities responsen oppgir at tjenesten støtter GetFeatureInfo-kallet for gruppelag</p>
                </StatusItem>
                <StatusItem params={this.state.svgError}>
                  <h5>Korrekt text/xml+svg decoding</h5>
                  <p>Noen kartklienter (Adaptive) har problemer med å dekode '+'-tegnet i responser, derfor tester vi dette</p>
                </StatusItem>
                <StatusItem params={this.state.stylesError}>
                  <h5>Parameteren 'style' er valgfri</h5>
                  <p>Noen kartklienter (ESRI) er har problemer med å fortolke 'style'-parameteren, selv om den er tom</p>
                </StatusItem>
                <StatusItem params={this.state.bbox}>
                  <h5>Oppgir dekningsområde</h5>
                  <p>Tjenesten oppgir hvilket område dataene befinner seg innenfor angitt som en BoundingBox</p>
                </StatusItem>
                <StatusItem params={this.state.featuresVisible}>
                  <h5>Objekter er synlige innenfor dekningsområdet</h5>
                  <p>For sikre at det kan gis brukerstøtte for hvor objektene faktisk befinner seg. Man kan da spørre på f.eks 100x100 px og se hvor data befinner seg.</p>
                </StatusItem>
                <StatusItem params={this.state.numLayers}>
                  <h5>Antall tjenestelag</h5>
                  <p>Antall lag som er satt opp i tjenesten. Jo flere lag desto tregere kan tjenesten respondere</p>
                </StatusItem>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },

  /**
   * getState
   */
  getState: function (name, fallback) {
    if (fallback === undefined) {
      fallback = '';
    }
    var value = this.state.hasOwnProperty(name) ? this.state[name] : '';
    return value === undefined || value === null || value === '' ? fallback : value;
  },

  /**
   * loadDetailData
   */
  loadDetailData: function () {
    var self = this;
    this.serverRequestDetail = axios.get('https://status.geonorge.no/monitorApi/serviceDetail?uuid=' + this.props.uuid).then(function (response) {
      var newState = response.data;
      newState.lastUpdated = Date.now();
      newState.ts = new Date(newState.sjekket).getTime();
      newState.isDetailLoading = false;
      self.setState(newState, self.tabSetName);
    });
    this.serverRequestResponse = axios.get('https://status.geonorge.no/monitorApi/responseList?uuid=' + this.props.uuid).then(function (response) {
      self.setState({
        chartData: response.data,
        isResponseLoading: false
      });
    });
  },

  /**
   * tabSetName
   */
  tabSetName: function () {
    this.props.tabSetName(this.props.uuid, this.state.name);
  }
});
