const token = window.localStorage.getItem('token')

if(token){
	window.lacation = '/'
}

formBtn.onsubmit = async (event)=>{
	event.preventDefault()

	if(!usernameInput.value || !passwordInput.value) return;

	const userData = {
		username: usernameInput.value,
		password: passwordInput.value
	}

	const response = await fetch('auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userData)
	})

	const user = await response.json()
	
	if(user.data){
		window.localStorage.setItem('username',user.data.username)
		window.localStorage.setItem('img',user.data.profile_img)
		window.localStorage.setItem('token',user.token)
		window.location = '/'
	}
}