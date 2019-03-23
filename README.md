## MMM-NotificationTrigger
MMM-NotificationTrigger is a simple notification relay which can convert notifications from `TRIGGER_NOTIFICATION` to `FIRE_NOTIFICATION`
Many MagicMirror modules have their own incoming and outgoing notification messages. But most of them are not compatible. This module can translate notifications among other modules.
You can use this module to chain modules to work together.

### Screenshot
This works in background, so there is no screenshot.

### Updated
**2018-10-02**
- `exec` is added. Now you can execute your external shell command or script by notification.


### Installation

```sh
git clone https://github.com/eouia/MMM-NotificationTrigger.git
```

### Configuration Sample
```javascript
{
  module: 'MMM-NotificationTrigger',
  //This module works in Background, so you don't need to describe `position`.
  config: {
    useWebhook: false, // If you want to activate webhook as Notification emitter, set true. (eg. IFTTT)
    triggers:[ // Array of triggers.
      {
        trigger: "INCOMINIG_NOTIFICATION", //REQUIRED
        triggerSenderFilter: (sender) => { //OPTIONAL should return true or false
          if (sender == "....") {
            return true
          }
          return false
        },
        triggerPayloadFilter: (payload) => { //OPTIONAL should return true or false
          if (typeof payload.value !== 'undefined' && payload.value > 0) {
            return true
          }
          return false
        },
        fires: [ // Array of fires. You can enable multi-firing with one trigger.
          {
            fire:"OUTGOING_NOTIFICATION", //REQUIRED
            payload: (payload) => { //OPTIONAL. transform received payload to what your target module wants.
              return payload
            },
            delay: 1000, //OPTIONAL, if this is set, your outgoing notification will be fired after delay.
            exec: "ls -l" //OPTIONAL, if exists, this script will be executed, and the result will be returned with "OUTGOING_NOTIFICATION_RESULT" and payload.  Can also be specified as a function which accepts the payload as an argument and returns the command to execute.
          },
        ],
      },
    ]
  },
}

```

Sample for MMM-AssistantMk2 transcriptionHooking demo.
```javascript
{
  module: "MMM-NotificationTrigger",
  config: {
    triggers:[
      {
        trigger: "ASSISTANT_ACTION",
        triggerSenderFilter: (sender) => {
          console.log(sender)
          if (sender.name == 'MMM-AssistantMk2') {
            return true
          } else {
            return false
          }
        },
        triggerPayloadFilter: (payload) => {
          console.log(payload)
          return true
        },
        fires: [
          {
            fire:"SHOW_ALERT",
            payload: (payload) => {
              return {
                type: "notification",
                title: payload.type,
                message: payload.command
              }
            },
          },
        ],
      },
    ]
  }

},
```

sample for MMM-Motion-Detection. This smaple just relay notification to ALERT module to display message, but you can modify for your purpose.
```javascript
{
  module: "MMM-NotificationTrigger",
  config: {
    useWebhook:true,
    triggers:[
      {
        trigger: "motion-detected",
        fires: [
          {
            fire:"SHOW_ALERT",
            payload: function() {
              return {
                type:"notification",
                title:"motion detector",
                message: "motion detected"
              }
            },
          }
        ]
      },
      {
        trigger: "motion-stopped",
        fires: [
          {
            fire:"SHOW_ALERT",
            payload: function() {
              return {
                type:"notification",
                title:"motion detector",
                message: "motion stopped"
              }
            }
          }
        ]
      },
    ]
  }
},
```

### useWebhook
You can use this module as endpoint of webhook for IFTTT.
Set your IFTTT recipe like this. (as `Make a web request` part)
- URL: `your mirror static IP or domain`/webhook
- Method: post or get
- Content-Type: anything or application/json
- Body :
```json
{
  "sender": {
    "name":"..."
  },
  "notification": "...",
  "payload":{
     ...
  }
 }
```
#### Configuration Example for IFTTT relaying to ALERT module.
```javascript
//in your configuration
{
      module: "MMM-NotificationTrigger",
      config: {
        useWebhook:true,
        triggers:[
          {
            trigger: "IFTTT_COMMAND",
            fires: [
              {
                fire:"SHOW_ALERT",
                payload: function(payload) {
                  return payload
                },
              },
            ],
          },
	]
      }
 }
```
In your IFTTT Applet setting Body
```json
{
  "sender": {
    "name":"IFTTT"
  },
  "notification": "IFTTT_COMMAND",
  "payload":{
     "title": "From IFTTT",
     "message": "This message is comming from IFTTT",
     "timer":5000
  }
 }
```

### exec Example
```javascript
{
  module: "MMM-NotificationTrigger",
  config: {
    triggers:[
      {
        trigger: "DOM_OBJECTS_CREATED",
        fires: [
          {
            fire:"MY_COMMAND",
            exec: "sleep 5; ls -l"
          },
        ],
      },
    ]
  }
},
```
When `trigger` is emitted, `MY_COMMAND` notification will be fired. then, `MY_COMMAND_RESULT` notification will be fired with the payload which contains result of command. 

Or you can also use function as `exec` like this;
```js
exec: (payload) => {
  return "/somewhere/my/script.sh " + payload.option
}
```
Thanks to @dgburr for making this PR.
