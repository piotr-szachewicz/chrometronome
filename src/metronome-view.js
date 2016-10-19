var ReactDOM = require('react-dom');
var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			bpm: 90,
			switchedOn: false
		};
	},

	valueChanged: function(ev) {
		var value = parseInt(ev.target.value);
		this.setState({bpm: value})
	},

	startClicked: function(ev) {
		this.setState({switchedOn: true});
	},

	stopClicked: function(ev) {
		this.setState({switchedOn: false});
	},

	componentWillMount() {
		this.clickSound = new Audio('click.mp3');
		this.worker = new Worker('../worker.js');

		this.worker.addEventListener('message', this.playClick);
	},

	componentDidUpdate(prevProps, prevState) {
		this.worker.postMessage({type: 'stop'});

		if (this.state.switchedOn) {
			this.worker.postMessage({type: 'start', interval: this.milisecondsBetweenClicks()});
		}
	},

	playClick() {
		this.clickSound.play();
	},

	milisecondsBetweenClicks() {
		return 60000/this.state.bpm;
	},

	render: function() {
		return <div>
			<input type='number' onChange={this.valueChanged} value={this.state.bpm} min='1' max='300'/>
			<button type="button" onClick={this.startClicked}>Start</button>
			<button type="button" onClick={this.stopClicked}>Stop</button>
		</div>;
	}
});