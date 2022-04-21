
const profileAvatar = document.querySelector('.profile-avatar')
const profileName     = document.querySelector('.profile-name')
const chatsList = document.querySelector('.chats-list')
const chatMain =  document.querySelector('.chat-main')

const username = window.localStorage.getItem('username')
const img = window.localStorage.getItem('img')
const token = window.localStorage.getItem('token')

if(!token) {
    window.localStorage.removeItem('img')
    window.localStorage.removeItem('username')
    window.location = '/login'
}

async function tokenValid(){
    let response = await fetch('/token',{
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    })

    let data = await response.json()
    if(data.status != 555) {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('img')
        window.location = '/login'
    }
}

tokenValid()

let clickUser

profileAvatar.src = img
profileName.textContent = username

async function groupMembersRender() {
    let response = await fetch('/users', {
    	method: 'GET',
    	headers: {
            'token': token,
    		'Content-Type': 'application/json'
    	}
    })
    const users = await response.json()

    chatsList.innerHTML = null

    users.data.filter(user => {
    	if(user.username != username && user.profile_img != img){
    		let li = document.createElement('li')
    		li.className = 'chats-item'
	        li.innerHTML= `
	            <img src='${user.profile_img}' alt="profile-picture" />
	            <p>${user.username}</p>
	        `
	        li.onclick = ()=>{
                headerUser.textContent = user.username
                clickUser = user
	        	onUser(user)
	        }
	        chatsList.append(li)
    	}
    })
}

groupMembersRender()


async function mySelf(){
    let response = await fetch('/users/me', {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    })
    return await response.json()
}


// Socket
let reseiver = ''
let sender = ''
let toUserId
const socket = io()

socket.on('connection')

socket.emit('user_connected', username + img)

sender = username + img

function onUser(user){
	reseiver = user.username + user.profile_img
    toUserId =  user.user_id

    messagesRenderer(user)
}

socket.on('user_connected', data => {
    groupMembersRender()
})



socket.on('new_message', async (data) =>{
    if(data.type){
        messagesRenderer(clickUser)
    }
    else {
    	let response = await fetch('/messages',{
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                textMessage: data.message,
                type: 'text',
                toUserId: data.id
            })
        })
        let q = await response.json()
    }
        messagesRenderer(clickUser)
    
})



// Active Page
emojiBtn.onclick = () => {
    textInput.value += '😃'
}

form.onsubmit = async (event)=>{
    event.preventDefault()

    let my = await mySelf()

    socket.emit('send_message', {
        sender,
        reseiver,
        message: textInput.value,
        id: my.data[0].user_id
    })

    let obj = {
        text: textInput.value,
        username,
        img
    }

    messagesRenderer(clickUser,obj)
    textInput.value = ''
}


uploads.onchange = async (event) => {
    event.preventDefault()

    let my = await mySelf()

    let formData = new FormData()
    formData.append('file', uploads.files[0])
    formData.append('toUserId', clickUser.user_id)

    let response = await fetch('/messages', {
        method: 'POST',
        headers: {
            'token': token
        },
        body: formData
    })

    let uploadFile = await response.json()

    socket.emit('send_message', {
        sender,
        reseiver,
        message: uploadFile.newMessage[0].text_message,
        type: 'file',
        id: my.data[0].user_id
    })

    messagesRenderer(clickUser)
}


async function messagesRenderer(user,obj) {
   let  myData = await mySelf()

    let response = await fetch('/messages?f_id='+ myData.data[0].user_id + '&t_id='+toUserId, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type':'application/json'
        }
    })

    let data = await response.json()
    let string = ""

    data.map(message => {
        if (message.type == 'text') {
            let id = (message.to_user_id == toUserId)
            let my = myData.data[0]
            string += `
                <div class="msg-wrapper ${(id ? "msg-from" : "")}">
                    <img src="${!id ? user.profile_img : my.profile_img}" alt="profile-picture" />
                    <div class="msg-text">
                        <p class="msg-author">${!id ? user.username : my.username}</p>
                        <p class="msg">${message.text_message}</p>
                    </div>
                </div>
            `
        } else {
            let id = (message.to_user_id == toUserId)
            let my = myData.data[0]
            string += `
                <div class="msg-wrapper ${id ? "msg-from" : ""}">
                    <img src=${!id ? user.profile_img : my.profile_img} alt="profile-picture" />
                    <div class="msg-text">
                        <p class="msg-author">${!id ? user.username : my.username}</p>
                        <object data=${message.text_message} class="msg object-class"></object>
                        <a href="/download?fileName=${message.text_message}">
                            <img src="./img/download.png" width="25px" />
                        </a>
                    </div>
                </div>
            `
            }
    })

    if(obj){ 
        string += `
            <div class="msg-wrapper msg-from">
                <img src="${obj.img}" alt="profile-picture" />
                <div class="msg-text">
                    <p class="msg-author">${obj.username}</p>
                    <p class="msg">${obj.text}</p>
                </div>
            </div>
        `
    }
    chatMain.innerHTML = string
}
