/* Magic Mirror
 * Module: MMM-CIA
 *
 * By Mykle1
 *
 */
Module.register("MMM-CIA", {

    // Module config defaults.           // Make all changes in your config.js file
    defaults: {
		ICAO: "uudd",
		colorCode: "Standard", // Standard or Alternative
        useHeader: false, // false if you don't want a header      
        header: "", // Change in config file. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000, // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
    //    rotateInterval: 30 * 1000, // 30 second rotation of items
        updateInterval: 10 * 60 * 1000, // 10 minutes

    },

    getStyles: function() {
        return ["MMM-CIA.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        //  Set locale.
		this.url = "https://avwx.rest/api/metar/" + this.config.ICAO;
    //    this.url = "https://avwx.rest/api/taf/uudd";
        this.CIA = {};
    //    this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Fly the friendly skies . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


		// My data begins here
		
		var CIA = this.CIA;

		var top = document.createElement("div");
		top.classList.add("list-row");
		
		
		// start config opton for color coding
		if (this.config.colorCode != "Standard"){
		
		// Alternative color coding
		if (CIA['Flight-Rules'] == "VFR"){
			var bullet = '<font color = green> &#x29BF </font>';
		} else if (CIA['Flight-Rules'] == "MVFR"){
			var bullet = '<font color = blue> &#x29BF </font >';
		} else if (CIA['Flight-Rules'] == "IFR"){
			var bullet = '<font color = red> &#x29BF </font>';
		} else if (CIA['Flight-Rules'] == "LIFR"){
			var bullet = '<font color = magenta> &#x29BF </font>';
		} else {
			var bullet = '<font color = grey> &#x29BF </font>';
		}
		
	} else {
		
		// Standard color coding
		if (CIA['Flight-Rules'] == "VFR"){
			var bullet = '<font color = blue> &#x29BF </font>';
		} else if (CIA['Flight-Rules'] == "MVFR"){
			var bullet = '<font color = green> &#x29BF </font >';
		} else if (CIA['Flight-Rules'] == "IFR"){
			var bullet = '<font color = yellow> &#x29BF </font>';
		} else if (CIA['Flight-Rules'] == "LIFR"){
			var bullet = '<font color = red> &#x29BF </font>';
		} else {
			var bullet = '<font color = grey> &#x29BF </font>';
		}
		
	} // end config option for color coding
			
			
			
			
			
		// FlightRulesBullet/Airport/Wind-Direction/Wind_Speed&Units.Wind-Speed/Cloud List/Temperature&Units/Dewpoint/Altimeter&Units
		var FlightRules = document.createElement("div");
		FlightRules.classList.add("xsmall", "bright", "FlightRules");
		FlightRules.innerHTML =
		
			bullet + " &nbsp" + CIA.Station + 
			" &nbsp &nbsp &nbsp " + CIA['Wind-Direction'] + "@" + CIA['Wind-Speed'] + CIA.Units['Wind-Speed'] +
			" &nbsp " + CIA['Cloud-List'][0] +
			" &nbsp " + CIA.Temperature + CIA.Units['Temperature'] + "/" + CIA.Dewpoint +
			" &nbsp " + CIA.Visibility + CIA.Units.Visibility;
			
		wrapper.appendChild(FlightRules);
		
		
		// Remarks/Zulu Time
		var Remarks = document.createElement("div");
		Remarks.classList.add("xsmall", "bright", "Remarks");
		Remarks.innerHTML = " &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp" 
							+ CIA.Remarks + " &nbsp " +CIA.Time;
		wrapper.appendChild(Remarks);

	return wrapper;
		
    }, // <-- closes getDom


    processCIA: function(data) {
        this.CIA = data;
        console.log(this.CIA); // for checking //
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getCIA();
        }, this.config.updateInterval);
        this.getCIA(this.config.initialLoadDelay);
    },

    getCIA: function() {
        this.sendSocketNotification('GET_CIA', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CIA_RESULT") {
            this.processCIA(payload);
            this.rotateInterval == null;
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});