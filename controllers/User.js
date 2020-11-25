const model = require('../models');
const md5 = require('md5')
const { Op } = require('sequelize')

const create = (req, res) => {
    const { password, ...rest } = req.body
    try {
        model.user.create({
            password: md5(password),
            ...rest
        })
            .then((doc) => {
                return res.json({ status: true, message: 'OK', data: doc })
            })
            .catch((err) => {
                console.log(err)
                return res.json({ status: false, message: 'Username sudah digunakan!' })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const show = async (req, res) => {
    const { page, q, limit } = req.query
    try {
        const opt = {
            attributes: ['id', 'fullname', 'username', 'role'],
            page: (page <= 0) ? 1 : page,
            paginate: limit,
            where: { [Op.or]: [{ fullname: { [Op.like]: `%${q}%` } }, { username: q }] },
            order: [['fullname', 'ASC']]
        }
        const data = await model.user.paginate(opt)
        return res.json({ status: true, message: 'OK', data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const update = async (req, res) => {
    const { id } = req.body
    try {
        const update = await model.user.update(req.body, { where: { id } })
        if (update[0] == 1) {
            return res.json({ status: true, message: 'OK', data: update })
        }
        return res.json({ status: false, message: 'Data tidak ditemukan!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const remove = (req, res) => {
    const { id } = req.body
    try {
        if (!id) return res.status(400).json('ID wajib diisi!')
        model.user.destroy({ where: { id } })
            .then(() => {
                return res.json({ status: true, message: 'Data berhasil dihapus', data: {} })
            })
            .catch(() => {
                return res.json({ status: false, message: 'Data tidak ditemukan' })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

module.exports = { show, create, update, remove }