import jwt from '../utils/jwt.js'

const tokenValid = (request, response, next) => {
	try {
		
		const { userId } = jwt.verify(request.headers.token)
		
		return next()
	} catch(error) {
		return next(error)
	}
}

export default tokenValid;