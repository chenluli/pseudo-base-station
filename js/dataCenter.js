var dataCenter = {
	globalVariables: {
		'selectedBaseStation': null
	},
	setGlobalVariable: function(variableName, value, setter){
		this.globalVariables[variableName] = value;
		observerManager.post('set:' + variableName, value, setter);
	}
}