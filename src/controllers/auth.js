import model from '../middleware/model.js'
import jwt from '../utils/jwt.js'
import path from 'path'

const LOGIN = async (request, response, next) => {
	try {
		const { username, password } = request.body
		const user = await model.login({username,password})
		
		response.json({
			message: 'The user successfully has login!',
			data: user[0],
			token: jwt.sign({userId: user[0].user_id})
		})
	} catch(error) {
		return next(error)
	}
}

const REGISTER = async (request, response, next) => {
	try {
		const { file } = request.files
		const fileName = file.name.replace(/\s/g, '')
		const { username, email, password  } = request.body
		
		const newUser = {
			username,
			email,
			password,
			profile_img: '/profileImg/' + fileName
		}

		const user = await model.register(newUser)

		file.mv(path.join(process.cwd(), 'src', 'files', 'profileImg', fileName))
		
		response.json({
			message: 'The user successfully has  registered!',
			data: user[0],
			token: jwt.sign({userId: user[0].user_id})
		})
		
	} catch(error) {
		return next(error)
	}
}

export default  {
	LOGIN,
	REGISTER
}