'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const secret = '#$*&%^&@#($(@'
//secret_key bebas mau memasukkan string apa, tapi value antara yang disign dan verify harus sama

function hashPassword(password) { //hash itu mengacak
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt) //hash password dengan salt, jadi ketika hash (proses mengacak) terkandung password dan salt
}

module.exports = {
    index: (req, res) => {
        const sql = 'select * from penduduk'
        db.query(sql, (err, result) => {
            if (err) throw (err)
            res.json({
                message: "Berhasil",
                data: result
            })
        })
    },
    getPenduduk: (req, res) => {
        const id = req.params.id

        let sql = `SELECT * FROM penduduk WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                if (result.length > 0) {
                    res.status(200).json({
                        message: 'Detail Penduduk by ID ' + id,
                        data: result
                    })
                } else {
                    res.status(404).json({
                        message: 'Penduduk not found'
                    })
                }
            }
        })
    },
    postPenduduk: (req, res) => {
        const { nama, alamat } = req.body
        const dataNewPenduduk = {
            nama,
            alamat
        }

        let sql = `INSERT INTO penduduk SET ?`
        db.query(sql, dataNewPenduduk, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(201).json({
                    message: 'New penduduk has been created',
                    data: {
                        id: result.insertId,
                        ...dataNewPenduduk
                    }
                })
            }
        })
    },
    deletePenduduk: (req, res) => {
        const { id } = req.params

        let sql = `DELETE FROM penduduk WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(200).json({
                    message: 'Penduduk has been deleted'
                })
            }
        })
    },
    putPenduduk: (req, res) => {
        const { id } = req.body
        const { nama, alamat } = req.body

        let sql = `UPDATE penduduk SET nama = '${nama}', alamat = '${alamat}' WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(200).json({
                    message: 'Penduduk has been updated',
                    data: {
                        id,
                        nama,
                        alamat
                    }
                })
            }
        })
    },
    registrasi: (req, res) => {
        const {
            nama,
            email,
            password
        } = req.body
        if (!nama, !email || !password) res.status(402).json({ message: 'nama,email,password harus diisi' })
        return db.query('insert into akun set ?', { nama, email, password: hashPassword(password) }, (err, result) => {
            if (err) return res.status(500).json({ err })
            return res.json({ message: 'registrasi berhasil', data: result })
        })
    },
    login: (req, res) => {
        const {
            email,
            password
        } = req.body
        if (!email || !password) res.status(402).json({ message: 'email,password harus diisi' })

        return db.query('select * from akun where email = ?', email, (err, result) => {
            if (err) return res.status(500).json({ err })
            const user = result[0]
            if (typeof user === 'undefined') return res.status(401).json({ message: 'user tidak ditemukan' })

            //jika inputan password sama dengan hash di db hasilnya akan true jika salah akan false, compareSync(data yg akan di enkrip, data yg dibandingkan)
            if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'password tidak sesuai' })

            //Pertama kita lakukan sign dengan kode berikut, yang akan menghasilkan sebuah token (encoded string)
            //Dalam sign token, kita bisa memasukkan berbagai data yang diperlukan seperti userId, userRole.
            //hasil token:
            //header berisi informasi tentang algoritma dan jenis token yang digunakan
            //Payload berisi data yang ingin dikirim melalui token, berupa data user
            //Signature adalah hash gabungan dari header, payload dan sebuah secret key
            const token = jwt.sign({ data: user }, secret)
            return res.json({ messsage: 'login berhasil silahkan menggunakan token dibawah ini untuk mengakses endpoint private lain', token })
        })
    },
    logout: (req, res) => {
        let token = req.get("authorization");
        let t = token.slice(7)
        jwt.destroy(t)
        res.json({ message: 'berhasil logout', t })
    },
    search: (req, res) => {
        let find = req.body.find
        let sql = "select * from pegawai where nip like '%" + find + "%' or nama like '%" + find + "%' or alamat like '%" + find + "%'"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            } else {
                let response = {
                    count: result.length,
                    pegawai: result
                }

                res.setHeader("Content-Type", "application/json")
                res.send(JSON.stringify(response))
            }
        })
    }
}