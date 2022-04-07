'use strict'

const express = require('express')
const pendudukController = require('../controllers/penduduk.controller')
const router = new express.Router();
const {checkToken} = require("../auth/token_validation")
const {
    index,
    getPenduduk,
    postPenduduk,
    deletePenduduk,
    putPenduduk
} = require('../controllers/penduduk.controller')

router.route('/:id').get(getPenduduk).delete(deletePenduduk)
router.route('/').get(checkToken,index).post(checkToken,postPenduduk)

router.post("/daftar", pendudukController.registrasi)
router.post("/login", pendudukController.login)
router.get("/logout", pendudukController.logout)
router.post("/search", pendudukController.search)
router.post("/update", checkToken,putPenduduk)

module.exports = router