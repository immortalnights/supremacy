define(['backbone.marionette',
       'tpl!platoons/templates/layout.html',
       'tpl!platoons/templates/platoondetails.html'],
       function(Marionette,
                template,
                platoonDetailsTemplate) {
	'use strict';

	var Layout = Marionette.View.extend({
		template: template,

		regions: {
			platoonDetailsLocation: '#platoondetails'
		},

		ui: {
			platoonSelector: 'select[name=platoon]',
			troopCount: 'input[name=troops]',
			maximizeTroops: 'button[data-control=maxtroops]'
		},

		events: {
			'change @ui.platoonSelector': 'onChangePlatoon',
			'change @ui.troopCount': 'onChangeTroopCount',
			'click @ui.maximizeTroops': 'onClickedMaxTroops'
		},

		initialize: function(options)
		{
			Marionette.View.prototype.initialize.call(this, options);
		},

		onRender: function()
		{

		},

		onChangePlatoon: function()
		{
			console.log("Platoon changed", this.ui.platoonSelector.find(':selected').val());
		},

		onChangeTroopCount: _.debounce(function()
		{
			console.log("Troop count changed", this.ui.troopCount.val());
		}),

		onClickedMaxTroops: function()
		{
			this.ui.troopCount.val(200).change();
		},

		displayPlatoonInformation: function()
		{
			this.showChildView('platoondetails', new Marionette.View({
				model: platoon
			}));
		}
	});

	return Layout;
});
