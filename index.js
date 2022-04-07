'use strict'

const express = require("express")
const app = express()
app.use(express.json())

const db = require('./db')
db.connect(error => {
    if(error) throw error
    console.log("Mysql Connected")
})

app.get("/", (req,res) => {
    res.send({
        message: "Berhasil menjalankan GET",
        data:{
            description:
            "Endpoint ini menampilkan data"
        }
    })
})

app.use("/penduduk", require('./routes/penduduk.route'))

const port = 8000;
app.listen(port, () => console.log(`App sudah berjalan ${port}`))