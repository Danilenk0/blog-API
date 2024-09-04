import jwt from 'jsonwebtoken'

export default function getToken(id){
            return jwt.sign(
            {
                        _id:id 
            },
            process.env.SECRET_KEY,
            {expiresIn:'30d'}
)
}