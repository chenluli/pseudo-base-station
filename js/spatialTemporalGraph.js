var spatialTemporalGraph = {
	name: "spatialTemporalGraph",

	initialize: function() {
		var self = this;
		self._addListener();
	},
	_addListener: function() {
		var self = this;
		observerManager.addListener(self);
	},
	OMListen: function(message, data) {
		var self = this;
		if(message === "") {
			//handle message
		}
	}
}