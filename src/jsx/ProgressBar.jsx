/**
 * ProgressBar
 */
var ProgressBar = React.createClass({
  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      class: '',
      icon: '',
      total: 0,
      value: 0
    };
  },

  /**
   * render
   */
  render: function () {
    var percent = this.props.total == 0 ? 0 : Math.round(this.props.value / this.props.total * 100);
    return (
      <div className="media">
        <div className={this.props.class == '' ? 'media-left' : 'media-left text-' + this.props.class}>
          <span className={this.props.icon == '' ? 'glyphicon glyphicon-minus-sign' : 'glyphicon glyphicon-' + this.props.icon} />
        </div>
        <div className="media-body">
          <h5 className="media-heading">
            <strong className={this.props.class == '' ? null : 'text-' + this.props.class}>{this.props.value + ' / ' + this.props.total}</strong>
            <small>{' (' + percent + '%)'}</small>
          </h5>
          <div className="progress">
            <div aria-valuemax="100" aria-valuemin="0" aria-valuenow={percent} className={this.props.class == '' ? 'progress-bar' : 'progress-bar progress-bar-' + this.props.class} role="progressbar" style={{width: percent + '%'}}>
              <span className="sr-only">{percent + '%'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
