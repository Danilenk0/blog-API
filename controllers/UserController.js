import { validationResult } from "express-validator";
import UserModel from '../model/User.js'
import bcrypt from 'bcrypt'
import getToken from '../utils/getToken.js'


export default class UserController {

    static async register(req, res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }

            const doc = new UserModel({
                fullName:req.body.fullName,
                email:req.body.email,
                passwordHash:await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
                avatarUrl:req.body.avatarUrl
            })

            const user = await doc.save()

            const token = getToken(user._id)

            return res.json({
                success:true,
                token
            })

        } catch (error) {
            return res.status(500).json({
                message:"Не удалось зарегистрироваться",
                error
            })
        }
    }

    static async login(req, res){
        try {

            const user = await UserModel.findOne({email:req.body.email})
            if(!user){
                return res.status(404).json({
                    message:'Пользователь не найден'
                })
            }

            const isValidPasswor = await bcrypt.compare(req.body.password, user._doc.passwordHash)
            if(!isValidPasswor){
                return res.status(404).json({
                    message:'Неверный логин или пароль'
                })
            }

            const token = getToken(user._id)

        return res.json({
            success:true,
            token
        })
            
        } catch (error) {
            return res.status(500).json({
                message:"Не удалось авторизироваться"
            })
        }
    }

    static async getMe(req, res) {
        try {
            const user = await UserModel.findById(req._id); 
    
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден' 
                });
            }
    
            return res.json({
                success: true,
                user
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ошибка сервера',
                error: error.message
            });
        }
    }
}