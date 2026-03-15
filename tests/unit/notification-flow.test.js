const assert = require("node:assert/strict")
const { afterEach, describe, test } = require("node:test")

let moduleDefinition = null
let originalSetTimeout = null

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

const createInstance = (config) => {
	const sentNotifications = []
	const socketNotifications = []
	const instance = Object.create(moduleDefinition)
	instance.config = config
	instance.sendNotification = (notification, payload) => {
		sentNotifications.push({ notification, payload })
	}
	instance.sendSocketNotification = (notification, payload) => {
		socketNotifications.push({ notification, payload })
	}

	return { instance, sentNotifications, socketNotifications }
}

const setImmediateTimeoutMock = () => {
	const timeoutCalls = []
	originalSetTimeout = global.setTimeout
	global.setTimeout = (callback, delay, ...args) => {
		timeoutCalls.push({ delay, args })
		callback(...args)
		return 1
	}

	return timeoutCalls
}

afterEach(() => {
	if (originalSetTimeout) {
		global.setTimeout = originalSetTimeout
		originalSetTimeout = null
	}
})

describe("basic notification forwarding", () => {
	test("passes through incoming payload by default", () => {
		const { instance, sentNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [{ fire: "PAGE_SELECT" }],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", { id: "sender" })

		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "incoming" },
		])
	})

	test("uses payload function return value", () => {
		const { instance, sentNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							payload: payload => `wrapped:${payload}`,
						},
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "wrapped:incoming" },
		])
	})

	test("fires all configured outgoing notifications", () => {
		const { instance, sentNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{ fire: "PAGE_SELECT" },
						{ fire: "PAGE_INCREMENT", payload: 2 },
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "incoming" },
			{ notification: "PAGE_INCREMENT", payload: 2 },
		])
	})
})

describe("exec handling", () => {
	test("forwards static exec commands to node helper", () => {
		const { instance, sentNotifications, socketNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							exec: "echo hello",
						},
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "incoming" },
		])
		assert.deepEqual(socketNotifications, [
			{
				notification: "EXEC",
				payload: {
					trigger: "RANDOM_EVENT",
					fire: "PAGE_SELECT",
					exec: "echo hello",
				},
			},
		])
	})

	test("evaluates exec callback with incoming payload", () => {
		const { instance, socketNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							exec: payload => `echo ${payload}`,
						},
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.equal(socketNotifications.length, 1)
		assert.equal(socketNotifications[0].notification, "EXEC")
		assert.equal(socketNotifications[0].payload.exec, "echo incoming")
	})
})

describe("delayed notification flow", () => {
	test("schedules delayed fire and emits notification", () => {
		const timeoutCalls = setImmediateTimeoutMock()
		const { instance, sentNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							delay: 500,
						},
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.equal(timeoutCalls.length, 1)
		assert.equal(timeoutCalls[0].delay, 500)
		assert.deepEqual(sentNotifications, [
			{ notification: "PAGE_SELECT", payload: "incoming" },
		])
	})

	test("sends delayed exec command after timeout callback", () => {
		setImmediateTimeoutMock()
		const { instance, socketNotifications } = createInstance({
			triggers: [
				{
					trigger: "RANDOM_EVENT",
					fires: [
						{
							fire: "PAGE_SELECT",
							delay: 100,
							exec: "echo delayed",
						},
					],
				},
			],
		})

		instance.notificationReceived("RANDOM_EVENT", "incoming", null)

		assert.deepEqual(socketNotifications, [
			{
				notification: "EXEC",
				payload: {
					trigger: "RANDOM_EVENT",
					fire: "PAGE_SELECT",
					exec: "echo delayed",
				},
			},
		])
	})
})
