import fetch from '../utils/postgres.js'

const loginQuery = `
	SELECT
		user_id,
		username,
		profile_img
	FROM users
	WHERE username = $1 AND password = crypt($2, password)
`

const registerQuery = `
	INSERT INTO users(username, email, password, profile_img) VALUES
	($1, $2, crypt($3, gen_salt('bf')), $4)
	RETURNING user_id, username, profile_img
`

const usersQuery = `
	SELECT
		user_id,
		username,
		profile_img
	FROM users
	WHERE user_id != $1
`

const userQuery = `
	SELECT
		user_id,
		username,
		profile_img
	FROM users
	WHERE user_id = $1
`

const messQuery = `
	SELECT
		*
	FROM messages
	WHERE (from_user_id = $1 AND to_user_id = $2) 
	OR (from_user_id = $2 AND to_user_id = $1);
`

const sendMessQuery = `
	INSERT INTO messages (text_message, type, from_user_id, to_user_id) VALUES
	($1, $2,$3, $4) RETURNING text_message, type,from_user_id,to_user_id;
`

const login = ({username,password}) => fetch(loginQuery, username, password)
const register = ({username, email, password, profile_img}) => {
	return fetch(registerQuery, username, email, password, profile_img)
}
const users = (userId) => fetch(usersQuery,(userId ? userId : 0)) 
const user = (userId) => fetch(userQuery,(userId ? userId : 0)) 
const message = ({ f_id, t_id }) => fetch(messQuery, f_id, t_id)
const sendMessage = ({textMessage,type,fromUserId,toUserId}) => {
	return fetch(sendMessQuery,textMessage,type,fromUserId,toUserId)
}

export default {
	login,
	register,
	users,
	user,
	message,
	sendMessage
}