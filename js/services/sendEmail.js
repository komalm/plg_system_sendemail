'use strict';

var sendEmailCount = 0;
var failEmailCount = 0;
tjSendEmail.Services.sendEmail = new (tjSendEmail.Services.Base.extend({
	url:"index.php?option=com_ajax&plugin=plg_System_Sendemail&format=json",
	config: {
		headers: {}
	},
	response: {
		"success": "",
		"message": ""
	},

	send: function (data, callback) {
			var postData;

			if (data.length != 0) {
				postData = data;
			}
			else
			{
				this.response.success = false;
				this.response.message = Joomla.JText._('COM_JGIVE_CONTROLLER_FALSE_RESPONSE');

				callback(this.response);

				return false;
			}

		return this.post(this.url, postData, this.config, callback);
	}
}));
