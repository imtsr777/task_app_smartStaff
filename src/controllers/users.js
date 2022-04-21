import model from '../middleware/model.js'

const GET = async (request, response, next) => {
	try {
		if (request.params.me == 'me'){
			const user = await model.user(request.userId)
			
			response.json({ 
				status: 200,
				data: user 
			});
		} else {
			const users = await model.users(request.userId)
			
			response.json({
				status: 200,
				data: users
			});
		}
	} catch(error) {
		return next(error)
	}
}

export default {
	GET
}