const {verify} = require('jsonwebtoken');
const secret = '#$*&%^&@#($(@'
//secret_key bebas mau memasukkan string apa, tapi value antara yang disign dan verify harus sama

module.exports={
    checkToken:(req,res,next)=>{
        let token = req.get("authorization");
        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkX2FrdW4iOjQsIm5hbWEiOiJhbmkiLCJlbWFpbCI6ImFuaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRxME1vRk1ZdmRidlBwZ2FDS0IuRTkuSmtzZXFJeExZb3lpRVVyRXBHUzlHZ0RSbXpudUo4LiJ9LCJpYXQiOjE2NDU0ODg3MjN9.-0knc3grAqKWzquuqT4F6ScvRBWWbXJzjTYcLhrV_eI
        

        if(token){
            let wow = token.slice(7)
            //hasil token:
            //header berisi informasi tentang algoritma dan jenis token yang digunakan
            //Payload berisi data yang ingin dikirim melalui token, berupa data user
            //Signature adalah hash gabungan dari header, payload dan sebuah secret key
            //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkX2FrdW4iOjQsIm5hbWEiOiJhbmkiLCJlbWFpbCI6ImFuaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRxME1vRk1ZdmRidlBwZ2FDS0IuRTkuSmtzZXFJeExZb3lpRVVyRXBHUzlHZ0RSbXpudUo4LiJ9LCJpYXQiOjE2NDU0ODg3MjN9.-0knc3grAqKWzquuqT4F6ScvRBWWbXJzjTYcLhrV_eI
            verify(wow,secret,(err,decoded)=>{
                //Jika token yang di berikan valid, maka klien diperbolehkan untuk mengakses, jika tidak, maka balas dengan pesan error
                if(err){
                    res.json({
                        success:0,
                        message:"Login First",
                        err
                    })
                }else{
                    let user = decoded.result
                    next()
                }
            })
        }else{
            res.json({
                success:0,
                message:"Access Denied : unauthorized user"
            })
        }
    }
}
