import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {registerValidation, loginValidation, postCreateValidation} from './validations/Validations.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import UserController from './controllers/UserController.js'
import PostController from './controllers/PostController.js'
import checkAuth from './utils/checkAuth.js'
import multer from 'multer'

dotenv.config();

const app = express();
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage})

mongoose.connect(process.env.DBCONNECT)
.then(()=>{
    console.log('Connect to database is fullfiled!')
})
.catch((error)=>{
    console.log(error)
})

app.post('/upload', (req, res)=>{
    upload.single('image')(req, res,(error)=>{
        if(error){
            return res.status(400).json({error})
        }
        res.json({
            message:'Файл загружен успешно'
        })
    })
})

app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts/', checkAuth, PostController.all)
app.get('/posts/:id',checkAuth, PostController.show)
app.post('/posts',checkAuth, postCreateValidation, handleValidationErrors, PostController.store)
app.patch('/posts/:id',checkAuth,postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id',checkAuth, PostController.remove)

app.listen(process.env.PORT,(error)=>{
    if(error){
        console.log(error)
    }

    console.log(`Server started on port ${process.env.PORT}`)
})
