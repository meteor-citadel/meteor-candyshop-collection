module.exports = class Collection {

	constructor(mongoCollection, schema = {}, doBeforeSave = (selector, modifier) => modifier) {
		this.mongoCollection = mongoCollection
		this.schema = schema
		this.doBeforeSave = doBeforeSave
	}

	insert(data) {
		const processedData = this.doBeforeSave(null, data, null, { insert: true })
		check(processedData, this.schema)

		return this.mongoCollection.insert(processedData)
	}

	update(selector, modifier, options = {}) {

		const processedModifier = this.doBeforeSave(selector, modifier, options, { update: true })

		Object.keys((processedModifier.$set || {})).forEach(key => {
			check(processedModifier.$set[key], this.schema[key])
		})

		return this.mongoCollection.update(selector, processedModifier, options)
	}

	find(...args) {
		return this.mongoCollection.find(...args)
	}

	findOne(...args) {
		return this.mongoCollection.findOne(...args)
	}

	remove(...args) {
		return this.mongoCollection.remove(...args)
	}

}