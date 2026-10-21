/* Magic Mirror
 * Node Helper: MMM-DailyBibleVerse
 *
 * By Arthur Garza
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function () {
		console.log("Started node_helper.js for MMM-DailyBibleVerse.");
	},

	socketNotificationReceived: function (notification, payload) {
		console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "START") {
			this.bibleGatewayRequest(payload);
		}
	},

	bibleGatewayRequest: async function (version) {
		const encodedVersion = encodeURIComponent(version || "ESV");
		const bibleGatewayURL = `https://www.biblegateway.com/votd/get/?format=json&version=${encodedVersion}`;

		try {
			const response = await fetch(bibleGatewayURL);
			if (!response.ok) {
				console.error(`${this.name}: HTTP error ${response.status} when fetching verse of the day.`);
				return;
			}
			const result = await response.json();
			this.sendSocketNotification("BIBLE_GATEWAY_RESULT", result);
		} catch (error) {
			console.error(`${this.name}: Failed to fetch verse of the day:`, error);
		}
	}
});

