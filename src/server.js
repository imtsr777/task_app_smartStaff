import express from 'express';
import fileUpload from 'express-fileupload'
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path'

const PORT = process.env.PORT || 3000
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
 
// Static
app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.join(process.cwd(),'src', 'public')))
app.use(express.static(path.join(process.cwd(), 'src', 'files')))

// Frontend pages
app.get('/',(request,response)=>{
  response.sendFile(path.join(process.cwd(), 'src', 'views', 'index.html'))
})

app.get('/login',(request,response)=>{
  response.sendFile(path.join(process.cwd(), 'src', 'views', 'login.html'))
})

app.get('/register',(request,response)=>{
  response.sendFile(path.join(process.cwd(), 'src', 'views', 'register.html'))
})

app.get('/download', (request,response)=>{
    const { fileName } = request.query
    response.download(path.join(process.cwd(), 'src', 'files', fileName))
})  

// Routes
import config from '../config.js'
import tokenValidRoutes from './routes/tokenValid.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import messRoutes from './routes/messages.js'

// Backend
app.use('/auth',authRoutes)
app.use('/token',tokenValidRoutes)
app.use('/users',userRoutes)
app.use('/messages', messRoutes)


// Socket
let users = {}
io.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on('user_connected', (username) => {
        users[username] = socket.id
        io.emit('user_connected', username)
  })
    socket.on('send_message',data => {
        let socketId = users[data.reseiver]
    
        io.to(socketId).emit('new_message',data)
    })
});

// ErrorHandler 
app.use((error, request, response, next) => {
    return response.status(error.status).send(error)
})

httpServer.listen(PORT, () => console.log('Server is running on http://localhost:' + PORT));