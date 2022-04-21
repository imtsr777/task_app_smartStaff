const token = window.localStorage.getItem('token')


if(token){
	window.lacation = '/'
}

form.onsubmit = async (event)=>{
	event.preventDefault()

	if(!usernameInput.value || !emailInput.value || !passwordInput.value) return;
	
	const formData = new FormData()
	formData.append('file', uploadInput.files[0])
	formData.append('username', usernameInput.value)
	formData.append('email', emailInput.value)
	formData.append('password', passwordInput.value)

	const response = await fetch('auth/register', {
		method: 'POST',
		body: formData
	})

	const user = await response.json()
	
	if(user.data){
		window.localStorage.setItem('username',user.data.username)
		window.localStorage.setItem('img',user.data.profile_img)
		window.localStorage.setItem('token',user.token)
		window.location = '/'
	}
}