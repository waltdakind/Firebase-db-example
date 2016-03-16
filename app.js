
//https://trainzzz.firebaseio.com/
var nextTrain = '';
var minutesToNextTrain = '';
var trainRef = new Firebase("https://trainzzz.firebaseio.com/");
var scheduleRef = trainRef.child('trainSchedule');
var sessionRef = trainRef.child('sessionTime');

//var sessionRef = new Firebase("https://trainzzz.firebaseio.com/sessionTime");
// var now1 = parseInt(moment().format('HH'));
// var now2 = parseInt(moment().format('mm'));
// var nowInSeconds = (now1*60*60)+(now2*60);

// https://auth.firebase.com/auth/github/callback


//timer interval function
// var i = setInterval(function() { timeUpdate(); }, 1000*60);


//  moment().tz("America/New_York");
$("#send").click(function(){
  pushData();
});
$(window).keyup(function(e) { 
  if(e.keyCode == 13){
    pushData();
  }
});
function pushData(){
      var train = $("#train").val().trim();
      var destination = $("#destination").val().trim();
      var frequency = $("#frequency").val().trim();
      var startTime = $("#startTime").val().trim();

  if(train != "" && destination != "" && frequency != "" && startTime != ""){
//var modStartTime = moment(startTime).format("HH:mm");
     
    $("#train").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#startTime").val("");

    scheduleRef.push({
      train: train,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      refTime:nowInMinutes,
    });
  }
}
scheduleRef.on("child_added", function(snap){
    var midnightUnix = (moment(startTime).startOf('day').subtract(4, 'hours').unix());  //4 hrs adjust to GMT 
    var now = moment().subtract(4, 'hours').unix(); //4 hr GMT adjust
sessionRef.update({sessionTime:now});
nowInMinutes = parseInt(now/60 - midnightUnix/60);
console.log(nowInMinutes);
var modifiedStartTime = moment(snap.val().startTime, 'HH:mm').toObject();

    var startTimeInMinutes = modifiedStartTime.hours*60 + modifiedStartTime.minutes;
    var modStartTime =  moment(snap.val().startTime, 'HH:mm').subtract(4, 'hours').unix();  // adjust four hour offset from GMT
    var diffStartNow =  startTimeInMinutes - nowInMinutes;
    var minutesToNextTrain = parseInt(snap.val().frequency) + parseInt(diffStartNow%snap.val().frequency);
    var nextTrain = moment().add(minutesToNextTrain, 'minutes').format('HH:mm');

//scheduleRef.update({minutesToNextTrain: parseInt(snap.val().frequency) + parseInt(diffStartNow%snap.val().frequency)});
console.log(moment(snap.val().startTime, 'HH:mm').subtract(4, 'hours').unix());

    $("tbody").append("<tr><td>"+snap.val().train+"</td><td>"+snap.val().destination+"</td><td>"+snap.val().frequency+"</td><td>"+snap.val().startTime+"</td><td>" + nextTrain + "</td><td>" + minutesToNextTrain + "</td></tr>");
console.log(snap.val().train);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// notes
// push time to schedule.ref on interval 


