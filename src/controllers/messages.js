import model from '../middleware/model.js'
import path from 'path'

const GET = async (request, response, next) => {
	try {
		const { f_id, t_id } = ( request.query)
		const messages = await model.message({ f_id, t_id })
		
		response.json(messages);
	} catch(error) {
		return next(error)
	}
}

const POST = async (request, response, next) => {
	try {
		const newMessage = {}
		const fromUserId = request.userId

		if(request.files){
			const { file } = request.files
			const { toUserId } = request.body
			const fileName = file.name.replace(/\s/g, '')
			const type = file.mimetype.split('/')

			newMessage.textMessage = '/profileImg/' + fileName
			newMessage.type = type[0]
			newMessage.fromUserId = fromUserId
			newMessage.toUserId = toUserId 

			const message = await model.sendMessage(newMessage)
			
			file.mv(path.join(process.cwd(), 'src', 'files', 'profileImg', fileName))
			
			response.json({
				status: 201,
				message: 'New message created!',
				newMessage: message
			})
		} else {
			const { textMessage, type, toUserId } = request.body
			
			newMessage.textMessage = textMessage
			newMessage.type = type
			newMessage.fromUserId = toUserId
			newMessage.toUserId = fromUserId 

			const message = await model.sendMessage(newMessage)
			
			response.json({
				status: 201,
				message: 'New message created!',
				newMessage: message
			})
		}
		
	} catch(error){
		return next(error)
	}
}

export default {
	GET,
	POST
}