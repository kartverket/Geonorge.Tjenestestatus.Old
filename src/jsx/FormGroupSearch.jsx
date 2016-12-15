/**
 * FormGroupSearch
 */
var FormGroupSearch = React.createClass({
  /**
   * getInitialState
   */
  getInitialState: function () {
    return {
      value: ''
    };
  },


  /**
   * propTypes
   */
  propTypes: {
    callback: React.PropTypes.func.isRequired
  },

  /**
   * render
   */
  render: function () {
    return (
      <div className="form-group form-group-search">
        <input className="form-control" onChange={this.changeHandler} onKeyUp={this.searchHandler} placeholder="Søk..." value={this.state.value} />
        <a className={this.state.value.length > 1 ? 'input-control times' : 'hidden'} href="#" onClick={this.clearHandler}>&times;</a>
        <a className="input-control search" href="#" onClick={this.searchHandler}>
          <span className="glyphicon glyphicon-search" />
        </a>
      </div>
    );
  },

  /**
   * changeHandler
   */
  changeHandler: function (event) {
    this.setState({
      value: event.target.value
    });
  },

  /**
   * clearHandler
   */
  clearHandler: function (event) {
    event.preventDefault();
    this.setState({
      value: ''
    }, this.sendCallback);
  },

  /**
   * searchHandler
   */
  searchHandler: function (event) {
    var performSearch = false;
    if (event.type == 'click') {
      event.preventDefault();
      performSearch = true;
    }
    if (event.type == 'keyup' && event.key == 'Enter') {
      performSearch = true;
    }
    if (this.state.value.length < 2) {
      performSearch = false;
    }
    if (performSearch) {
      this.sendCallback();
    }
  },

  /**
   * sendCallback
   */
  sendCallback: function () {
    this.props.callback(this.state.value);
  }
});
