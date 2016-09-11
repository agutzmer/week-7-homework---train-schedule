

// Initialize Firebase
 var config = {
    apiKey: "AIzaSyDD5wXykChNaYkoEx1KV-dapZfDNUecNrE",
    authDomain: "armintrainschecule.firebaseapp.com",
    databaseURL: "https://armintrainschecule.firebaseio.com",
    storageBucket: "armintrainschecule.appspot.com",
  };
  firebase.initializeApp(config);

// Global variables
var database = firebase.database();
var currentMoment;
var currentTime;
var minutesAwayUnix;
var nextArrivalDisplay;
var displayTimeToArrival;

// Button for adding a schedule
$("#submitButton").on("click", function(){
	// Grabs user input
	var	trainName = $("#trainNameInput").val().trim();
	var trainDestination = $("#destinationInput").val().trim();
	var trainScheduled = moment($("#scheduledInput").val().trim(), "HH:mm a").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();

//
// Here comes the math for Next Arrival column
//
	currentMoment = moment();
	currentTime = moment(currentMoment, "HH:mm a").format("X");
	minutesAwayUnix = moment(currentTime).subtract(trainScheduled, 'minutes');
	nextArrivalDisplay = moment.unix(trainScheduled).format("HH:mm a");

	var currentHour = Number(moment().format("HH"));
	var currentMinute = Number(moment().format("mm") );
	var currentTimeInMinutes = Number ((currentHour * 60) + currentMinute);

	var scheduledHour = Number (moment($("#scheduledInput").val().trim(), "HH:mm a").format("HH"));
	var scheduledMinute = Number (moment($("#scheduledInput").val().trim(), "HH:mm a").format("mm"));
	var scheduledTimeInMinutes = Number ((scheduledHour * 60) + scheduledMinute);

	var timeToArrivalInMinutes = 0;

// Determine if the next train arrives today or tomorrow

	if (scheduledTimeInMinutes > currentTimeInMinutes) {
		timeToArrivalInMinutes = scheduledTimeInMinutes - currentTimeInMinutes;
	}
	else {
		// add the remains of the day to the scheduled time of arrival tomorrow
		timeToArrivalInMinutes = scheduledTimeInMinutes + ( ( 24 * 60) - currentTimeInMinutes);  
	}

// Convert timeToArrivalInMinutes to string hours and minutes

	displayTimeToArrival = (Math.floor (timeToArrivalInMinutes / 60)).toString() + " Hours, " + (timeToArrivalInMinutes % 60 ).toString() + " Minutes";
	
	// Creates local "temporary" object for train data
	var newTrainSchedule = {
		train:  trainName,
		destination:  trainDestination,
		schedule: trainScheduled,
		frequency:  trainFrequency,
		next: nextArrivalDisplay,
		timeTo: displayTimeToArrival 
	}

	// Upload train schedule data to the database
	database.ref().push(newTrainSchedule);

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#scheduledInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});


// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
	database.ref().on("child_added", function(childSnapshot, prevChildKey){


	// Grab the display data
	var trainName = childSnapshot.val().train;
	var trainDestination = childSnapshot.val().destination;
	var trainScheduled = childSnapshot.val().schedule;
	var trainFrequency = childSnapshot.val().frequency;
	var nextArrivalDisplay = childSnapshot.val().next;
	var displayTimeToArrival = childSnapshot.val().timeTo;


	// Add each train's data into the table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrivalDisplay + "</td><td>" + displayTimeToArrival + "</td></tr>");

});





