import { ClientError } from '../utils/errors.js'
import Joi from 'joi'

const schema = Joi.object({
	username: Joi.string().min(3).max(30).alphanum().required(),
	password: Joi.string().min(4).max(8).required()
})

const loginValid = (request, response, next) => {
	
	try {
		schema.validate(request.body)
		
		return next()
	} catch(error) {
		return next(error)
	}
}

const registerValid = (request, response, next) => {
	const schemaEmail = Joi.object({
		email: Joi.string()
				  .min(17).max(60)
				  .pattern(new RegExp(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/))
				  .required()
	})

	try {
		if (!request.files) throw new ClientError(401,'File not included!')
		const { file } = request.files

		if(!['image/jpeg', 'image/jpg','image/png'].includes(file.mimetype)){
		 	throw new ClientError(415, 'File format must be .jpg, .png or .jpeg!')
		}

		const { username, email, password } = request.body
		schema.validate({ username, password })
		schemaEmail.validate({ email })
		
		return next()
	} catch(error) {
		return next(error)
	}
}

export default {
	loginValid,
	registerValid
}