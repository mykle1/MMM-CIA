/* Magic Mirror
 * Module: MMM-CIA
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const async = require('async');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },
	
	
	httpGet: function(url, callback) {
		const options = {
		url : "https://avwx.rest/api/metar/" + this.config.focus_on,
		json : true
	};
			request(options,
			function(err, res, body) {
			callback(err, body);
		}
	);
}

		async.map(urls, httpGet, function (err, res){
	if (err) return console.log(err);
		console.log(res);
});
	
	

/*    getCIA: function(url) {
        request({
            url: "https://avwx.rest/api/metar/" + this.config.focus_on,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
				console.log(response.statusCode + result); // for checking
                this.sendSocketNotification('CIA_RESULT', result);
            }
        });
    },
	
*/

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_CIA') {
            this.getCIA(payload);
        }
    }
});
