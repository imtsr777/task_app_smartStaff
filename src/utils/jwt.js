import jwt from 'jsonwebtoken'

export default {
	sign: closeKey => jwt.sign(closeKey, process.env.TOKEN_KEY),
	verify: openKey => jwt.verify(openKey, process.env.TOKEN_KEY)
}