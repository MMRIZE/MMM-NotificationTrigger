## MMM-NotificationTrigger
MMM-NotificationTrigger is a simple notification converter.
Many MagicMirror modules have their own incoming and outgoing notification messages. But most of them are not compatible. This module can translate notifications among other modules.
You can use this module to chain modules to work together.

### Screenshot
This works in background, so there is no screenshot.

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
