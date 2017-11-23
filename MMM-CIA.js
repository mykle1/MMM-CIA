/* Magic Mirror
 * Module: MMM-CIA
 *
 * By Mykle1
 *
 */
Module.register("MMM-CIA", {

    // Module config defaults.           // Make all changes in your config.js file
    defaults: {
		colorCode: "Standard",           // Standard or Alternative
		focus_on: ["KJFK", "EGNX"],
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
		this.url = "https://avwx.rest/api/metar/" + this.config.focus_on;
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

        //	Rotating my data
    //    var CIA = this.CIA;
    //    var CIAKeys = Object.keys(this.CIA);
    //    if (CIAKeys.length > 0) {
    //        if (this.activeItem >= CIAKeys.length) {
    //            this.activeItem = 0;
    //        }
    //        var CIA = this.CIA[CIAKeys[this.activeItem]];
        //    var checkpoints = CIA['checkpoints']; // another array inside the first array
            //	console.log(checkpoints); // for checking
            //	console.log(this.CIA); // for checking


            // My data begins here
			
			var CIA = this.CIA;

            var top = document.createElement("div");
            top.classList.add("list-row");
			
			
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
			
			
		}	
			
		
			
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
			
			

    /*        // Altimeter
            var Altimeter = document.createElement("div");
            Altimeter.classList.add("xsmall", "bright", "Altimeter");
            Altimeter.innerHTML = "Altimeter: " + CIA.Altimeter;
            wrapper.appendChild(Altimeter);


            // Cloud-List
            var CloudList = document.createElement("div");
            CloudList.classList.add("xsmall", "bright", "CloudList");
            CloudList.innerHTML = "Cloud-List: " + CIA['Cloud-List'][0]; // moment(CIA.last_updated_at).local().format("ddd, MMM DD, YYYY, h:mm a");
            wrapper.appendChild(CloudList);


            // EndTime
            var EndTime = document.createElement("div");
            EndTime.classList.add("xsmall", "bright", "EndTime");
            EndTime.innerHTML = "End Time: " + CIA['End-Time'];
            wrapper.appendChild(EndTime);


            
			
			
			// Icing List
            var Icing = document.createElement("div");
            Icing.classList.add("xsmall", "bright", "Icing");
            Icing.innerHTML = "Icing List: " + CIA['Icing-List'];
            wrapper.appendChild(Icing);
			
			
			// Other conditions List
            var Other = document.createElement("div");
            Other.classList.add("xsmall", "bright", "Other");
            Other.innerHTML = "Other Conditions List: " + CIA['Other-List'];
            wrapper.appendChild(Other);
			
			
			// Probability of icing and conditions
            var Probability = document.createElement("div");
            Probability.classList.add("xsmall", "bright", "Probability");
            Probability.innerHTML = "Probability: " + CIA.Probability;
            wrapper.appendChild(Probability);
			
			
			// Raw-Line
            var RawLine = document.createElement("div");
            RawLine.classList.add("xsmall", "bright", "RawLine");
            RawLine.innerHTML = "RawLine: " + CIA['Raw-Line'];
            wrapper.appendChild(RawLine);
			
			
			// Start-Time
            var StartTime = document.createElement("div");
            StartTime.classList.add("xsmall", "bright", "StartTime");
            StartTime.innerHTML = "Start Time: " + CIA['Start-Time'];
            wrapper.appendChild(StartTime);
			
			
			// Turbulence List
            var TurbList = document.createElement("div");
            TurbList.classList.add("xsmall", "bright", "TurbList");
            TurbList.innerHTML = "Turbulence List: " + CIA['Turb-List'];
            wrapper.appendChild(TurbList);
			
			
			
			// Wind-Direction
            var WindDirection = document.createElement("div");
            WindDirection.classList.add("xsmall", "bright", "WindDirection");
            WindDirection.innerHTML = "Wind Direction: " + CIA['Wind-Direction'];
            wrapper.appendChild(WindDirection);
			
			
			
			// Wind-Gust
            var WindGust = document.createElement("div");
            WindGust.classList.add("xsmall", "bright", "WindGust");
            WindGust.innerHTML = "Wind Gust: " + CIA['Wind-Gust'];
            wrapper.appendChild(WindGust);
			
			
			
			// Wind-Shear
            var WindShear = document.createElement("div");
            WindShear.classList.add("xsmall", "bright", "WindShear");
            WindShear.innerHTML = "Wind Shear: " + CIA['Wind-Shear'];
            wrapper.appendChild(WindShear);
			
			
			
			// Wind-Speed
            var WindSpeed = document.createElement("div");
            WindSpeed.classList.add("xsmall", "bright", "WindSpeed");
            WindSpeed.innerHTML = "Wind Speed: " + CIA['Wind-Speed'];
            wrapper.appendChild(WindSpeed);
			
			
			// Type
            var Type = document.createElement("div");
            Type.classList.add("xsmall", "bright", "Type");
            Type.innerHTML = "Type: " + CIA.Type;
            wrapper.appendChild(Type);
			
			
			
			// Visibility
            var Visibility = document.createElement("div");
            Visibility.classList.add("xsmall", "bright", "Visibility");
            Visibility.innerHTML = "Visibility: " + CIA.Visibility;
            wrapper.appendChild(Visibility);
			
			
			
			
			
			


    /*        // expected_delivery date
            var expected_delivery = document.createElement("div");
            expected_delivery.classList.add("xsmall", "bright", "expected_delivery");
            if (CIA.expected_delivery != null) {
                expected_delivery.innerHTML = "Expected delivery on: " + moment(CIA.expected_delivery).local().format("ddd, MMM DD, YYYY");
                wrapper.appendChild(expected_delivery);
            } else {
                expected_delivery.innerHTML = "No expected delivery date!";
                wrapper.appendChild(expected_delivery);
            }

            // shipment_type
            var shipment_type = document.createElement("div");
            shipment_type.classList.add("xsmall", "bright", "shipment_type");
            if (CIA.shipment_type != null) {
                shipment_type.innerHTML = "Shipping: " + CIA.shipment_type;
                wrapper.appendChild(shipment_type);
            } else {
                shipment_type.innerHTML = "Shipping: If you're lucky!";
                wrapper.appendChild(shipment_type);
            }

            // status oh shipment
            var tag = document.createElement("div");
            tag.classList.add("xsmall", "bright", "status");
            tag.innerHTML = "Status: " + CIA.tag;
            wrapper.appendChild(tag);


            // Title of shipment (if any)
            var Title = document.createElement("div");
            Title.classList.add("xsmall", "bright", "Title");
            Title.innerHTML = "Title: " + CIA.title;
            wrapper.appendChild(Title);

            // objects that are inside an array that is inside an object
            // checkpoint location // only the last object in the array = checkpoints[checkpoints.length -1] @Cowboysdude //
            var location = document.createElement("div");
            location.classList.add("xsmall", "bright", "location");
            if (CIA.checkpoints.length != 0) {
                location.innerHTML = "Location: " + CIA.checkpoints[checkpoints.length - 1].location; // only the last object in the array = checkpoints[checkpoints.length -1] //
                wrapper.appendChild(location);
            } else {
                location.innerHTML = "Location: Who the fuck knows!";
                wrapper.appendChild(location);
            }


            // objects that are inside an array that is inside an object
            // checkpoint_time // only the last object in the array //
            var checkpoint_time = document.createElement("div");
            checkpoint_time.classList.add("xsmall", "bright", "checkpoint_time");
            if (CIA.checkpoints.length != 0) {
                checkpoint_time.innerHTML = "When: " + moment(CIA.checkpoints[checkpoints.length - 1].checkpoint_time).local().format("ddd, MMM DD, YYYY, h:mm a");
                wrapper.appendChild(checkpoint_time);
            } else {
                checkpoint_time.innerHTML = "When: Who the fuck cares!";
                wrapper.appendChild(checkpoint_time);
            }


            // objects that are inside an array that is inside an object
            // message from checkpoint // only the last object in the array //
            var message = document.createElement("div");
            message.classList.add("xsmall", "bright", "message");
            if (CIA.checkpoints.length != 0 && CIA.tag != "Delivered") {
                message.innerHTML = "Message: " + CIA.checkpoints[checkpoints.length - 1].message;
                wrapper.appendChild(message);
            } else if (CIA.tag == "Delivered") {
                message.innerHTML = "<marquee behavior='alternate' scrollamount='1'>Delivered!</marquee>";
                wrapper.appendChild(message);
            } else
				message.innerHTML = "Message: No data from courier!";
                wrapper.appendChild(message);
			
			
	//	} // <-- closes rotation 

    */    

        return wrapper;
		
    }, // <-- closes getDom


    processCIA: function(data) {
        this.CIA = data;
        console.log(this.CIA); // for checking //
        this.loaded = true;
    },

//    scheduleCarousel: function() {
//    //    console.log("Carousel of CIA fucktion!"); // for checking //
//        this.rotateInterval = setInterval(() => {
//            this.activeItem++;
//            this.updateDom(this.config.animationSpeed);
//        }, this.config.rotateInterval);
//    },

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