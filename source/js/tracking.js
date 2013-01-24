var Tracking = (function(){
  var ws;

  // Support both the WebSocket and MozWebSocket objects
  if ((typeof(WebSocket) == 'undefined') &&
      (typeof(MozWebSocket) != 'undefined')) {
    WebSocket = MozWebSocket;
  }

  // Create the socket with event handlers
  function init() {
    var gesturesEnabled = false;
    var disableGesturesFor = function(delay) {
      gesturesEnabled = false;
      setTimeout(function(){
        gesturesEnabled = true;
      }, delay);
    }

    //Create and open the socket
    ws = new ReconnectingWebSocket("ws://localhost:6437/");
    ws.debug = true;

    // On successful connection
    ws.onopen = function(event) {
      gesturesEnabled = true;
    };
    
    // On message received
    ws.onmessage = function(event) {
      var obj = JSON.parse(event.data);
      // console.log(obj.hands.length)
      if(gesturesEnabled) {
        if(typeof(obj.hands) != 'undefined' && obj.hands.length > 0) 
        {
          var v = obj.hands[0].palmVelocity;
          if(v[0] > 1000) 
          {
            Reveal.navigateRight();
            console.log(v[0], v[1], v[2]);
            disableGesturesFor(1500);
          }
          else if(v[0] < - 1000) 
          {
            Reveal.navigateLeft();
            console.log(v[0], v[1], v[2]);
            disableGesturesFor(1500);
          }

          // console.log(obj["id"]);
        }
        else
        {
          // console.log("undefined object:", obj)
          // console.log("Parsing error", event.data)
        }
      }
      // var str = JSON.stringify(obj, undefined, 2);
    };

    ws.onclose = function(event){
      gesturesEnabled = false;
    }

    ws.onerror = function(event){
      gesturesEnabled = false;
    }
  }

  return {init: init};
})();
