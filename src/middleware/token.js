import jwt from '../utils/jwt.js'

const token = (request, response, next) => {
	try {
		
		const { userId } = jwt.verify(request.headers.token)
		request.userId = userId
		
		return next()
	} catch(error) {
		return next(error)
	}
}

export default token;