const assert = require("node:assert/strict")
const { describe, test } = require("node:test")

let moduleDefinition = null

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

const createInstance = (config = {}) => {
	const sentNotifications = []
	const socketNotifications = []
	const instance = Object.create(moduleDefinition)
	instance.config = {
		useWebhook: false,
		triggers: [],
		...config,
	}
	instance.sendNotification = (notification, payload) => {
		sentNotifications.push({ notification, payload })
	}
	instance.sendSocketNotification = (notification, payload) => {
		socketNotifications.push({ notification, payload })
	}

	return { instance, sentNotifications, socketNotifications }
}

describe("module lifecycle", () => {
	test("sends INIT in start", () => {
		const { instance, socketNotifications } = createInstance()

		instance.start()

		assert.equal(socketNotifications.length, 1)
		assert.equal(socketNotifications[0].notification, "INIT")
	})
})

describe("socket notification handling", () => {
	test("forwards webhook payload when webhook support is enabled", () => {
		const { instance } = createInstance({ useWebhook: true })
		const receivedNotifications = []
		instance.notificationReceived = (notification, payload, sender) => {
			receivedNotifications.push({ notification, payload, sender })
		}

		instance.socketNotificationReceived("WEBHOOK", {
			notification: "RANDOM_EVENT",
			payload: { enabled: true },
			sender: { id: "webhook" },
		})

		assert.deepEqual(receivedNotifications, [
			{
				notification: "RANDOM_EVENT",
				payload: { enabled: true },
				sender: { id: "webhook" },
			},
		])
	})

	test("ignores webhook payload when webhook support is disabled", () => {
		const { instance } = createInstance({ useWebhook: false })
		let receivedCount = 0
		instance.notificationReceived = () => {
			receivedCount += 1
		}

		instance.socketNotificationReceived("WEBHOOK", {
			notification: "RANDOM_EVENT",
			payload: "incoming",
			sender: null,
		})

		assert.equal(receivedCount, 0)
	})

	test("emits *_RESULT notification on EXEC_RESULT", () => {
		const { instance, sentNotifications } = createInstance()
		const execPayload = {
			fire: "PAGE_SELECT",
			code: 0,
			stdout: "ok",
		}

		instance.socketNotificationReceived("EXEC_RESULT", execPayload)

		assert.deepEqual(sentNotifications, [
			{
				notification: "PAGE_SELECT_RESULT",
				payload: execPayload,
			},
		])
	})
})
