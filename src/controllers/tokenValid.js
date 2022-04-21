const TOKEN_VALID = (request, response, next) => {
	try {
		response.json({
			status: 555,
			message: 'Token valid!'
		})
	} catch(error) {
		return next(error)
	}
}

export default {
	TOKEN_VALID
}