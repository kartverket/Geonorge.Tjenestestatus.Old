/**
 * StatusItem
 */
var StatusItem = React.createClass({
  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      children: {},
      description: '',
      name: ''
    };
  },

  /**
   * propTypes
   */
  propTypes: {
    children: React.PropTypes.node.isRequired,
    params: React.PropTypes.object
  },

  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      params: {}
    };
  },

  /**
   * render
   */
  render: function () {
    var answer = this.props.params.svar;
    if (answer === undefined || answer === null) {
      answer = '-';
    }
    var assessment = this.props.params.vurdering;
    if (assessment === undefined || assessment === null) {
      assessment = 'skip';
    }
    var testvalue = this.props.params.testverdi;
    if (testvalue === undefined || testvalue === null) {
      testvalue = '';
    }

    var rowClass = 'statusitem';
    var iconClass = 'glyphicon glyphicon-option-horizontal';
    switch (assessment) {
      case 'yes':
        rowClass += ' success';
        iconClass = 'glyphicon glyphicon-ok-sign text-success';
        break;
      case 'no':
        rowClass += ' danger';
        iconClass = 'glyphicon glyphicon-remove-sign text-danger';
        break;
      case 'soso':
        rowClass += ' warning';
        iconClass = 'glyphicon glyphicon-warning-sign text-warning';
        break;
      case 'skip':
        rowClass += ' warning text-muted';
        break;
    }

    var anchorIcon = testvalue.indexOf('mailto:') == 0 ? 'glyphicon glyphicon-envelope' : 'glyphicon glyphicon-new-window';

    return (
      <tr className={rowClass}>
        <td className="text-center">
          <span className={iconClass} />
        </td>
        <td>
          {this.props.children}
        </td>
        <td className="text-right">
          <strong>{answer}</strong>
        </td>
        <td className="text-center">
          <a className={testvalue == '' ? 'hidden' : null} href={testvalue} target="_blank">
            <span className={anchorIcon} />
          </a>
        </td>
      </tr>
    );
  }
})
