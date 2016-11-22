/**
 * FormGroupSearch
 */
var FormGroupSearch = React.createClass({
  /**
   * componentWillReceiveProps
   */
  componentWillReceiveProps: function (props, state) {
    if (props.value != this.state.value) {
      console.log('props', props, this.props);
      console.log('state', state, this.state);
      this.setState({
        value: props.value
      });
    }

    /*if (props.uuid != '' && props.uuid != this.props.uuid) {
      this.setState({
        isDetailLoading: true,
        isResponseLoading: true
      }, this.loadDetailData);
    }*/
  },

  /**
   * getDefaultProps
   */
  getDefaultProps: function () {
    return {
      value: ''
    };
  },

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
    callback: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  },

  /**
   * render
   */
  render: function () {
    var isDisabled = false;
    if (this.state.value.length < 2) {
      isDisabled = true;
    }
    if (this.state.value == this.props.value) {
      isDisabled = true;
    }
    return (
      <div className="form-group form-group-search">
        <input className="form-control" onChange={this.changeHandler} onKeyUp={this.searchHandler} placeholder="Søk..." value={this.state.value} />
        <a className={this.state.value.length > 0 ? 'input-control times' : 'hidden'} href="#" onClick={this.clearHandler}>&times;</a>
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
    if (this.props.value == '') {
      this.setState({
        value: ''
      });
    } else {
      this.props.callback('');
    }
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
    if (this.state.value == this.props.value) {
      performSearch = false;
    }
    if (this.state.value.length < 2) {
      performSearch = false;
    }
    if (performSearch) {
      this.props.callback(this.state.value);
    }
  }
});
