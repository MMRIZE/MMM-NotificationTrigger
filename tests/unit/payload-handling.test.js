const assert = require("node:assert/strict")
const { beforeEach, describe, test } = require("node:test")

let moduleDefinition = null
let sentNotifications = []

global.Module = {
	register: (name, definition) => {
		if (name === "MMM-NotificationTrigger") {
			moduleDefinition = definition
		}
	},
}

global.Log = {
	log: () => null,
}

require("../../MMM-NotificationTrigger.js")

const assertConfiguredPayload = (instance, configuredPayload) => {
	instance.config.triggers[0].fires[0].payload = configuredPayload
	instance.notificationReceived("RANDOM_EVENT", "incoming", null)

	assert.deepEqual(sentNotifications, [
		{ notification: "PAGE_SELECT", payload: configuredPayload },
	])
}

describe("notification payload handling", () => {
	let instance = null

	beforeEach(() => {
		sentNotifications = []
		instance = Object.create(moduleDefinition)
		instance.config = {
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							payload: 0,
						},
					],
				},
			],
		}
		instance.sendNotification = (notification, payload) => {
			sentNotifications.push({ notification, payload })
		}
		instance.sendSocketNotification = () => null
	})

	test("uses configured payload value: 0", () => {
		assertConfiguredPayload(instance, 0)
	})

	test("uses configured payload value: false", () => {
		assertConfiguredPayload(instance, false)
	})

	test("uses configured payload value: empty string", () => {
		assertConfiguredPayload(instance, "")
	})

	test("uses configured payload value: null", () => {
		assertConfiguredPayload(instance, null)
	})

	test("falls back to incoming payload when fire payload is not configured", () => {
		delete instance.config.triggers[0].fires[0].payload
		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "incoming" },
		])
	})
})
