const config = {
	address: "0.0.0.0",
	ipWhitelist: [],
	logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
	modules: [
		{
			module: "alert"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			position: "top_left",
			header: "Demo Calendar",
			config: {
				calendars: [
					{
						url: "https://calendar.google.com/calendar/ical/en.german%23holiday%40group.v.calendar.google.com/public/basic.ics",
						symbol: "calendar"
					}
				]
			}
		},
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "MMM-NotificationTrigger",
			config: {
				useWebhook: false,
				triggers: [
					{
						// Example 1: Hide/show calendar when user presence changes
						trigger: "USER_PRESENCE",
						triggerPayloadFilter: payload => typeof payload === "boolean",
						fires: [
							{
								fire: "MODULE_TOGGLE",
								payload: { module: "calendar" }
							}
						]
					},
					{
						// Example 2: Show alert when calendar events are loaded
						trigger: "CALENDAR_EVENTS",
						triggerPayloadFilter: payload => Array.isArray(payload) && payload.length > 0,
						fires: [
							{
								fire: "SHOW_ALERT",
								payload: {
									type: "notification",
									title: "Calendar Loaded",
									message: "Holiday calendar events are ready"
								},
								delay: 1000
							}
						]
					},
					{
						// Example 3: Execute shell command and show result
						trigger: "BUTTON_PRESSED",
						triggerSenderFilter: sender => sender.name === "MMM-ButtonEvents",
						fires: [
							{
								fire: "SYSTEM_INFO",
								payload: { source: "button" },
								exec: "date"
							}
						]
					}
				]
			}
		}
	]
}

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config
}
