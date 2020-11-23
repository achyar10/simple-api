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
                return res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json('Username sudah digunakan!')
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
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
        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

const update = async (req, res) => {
    const { id } = req.body
    try {
        const update = await model.user.update(req.body, { where: { id } })
        if (update[0] == 1) {
            return res.json('OK')
        }
        return res.status(404).json('Data tidak ditemukan!')
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

const remove = (req, res) => {
    const { id } = req.body
    try {
        if (!id) return res.status(400).json('ID wajib diisi!')
        model.user.destroy({ where: { id } })
            .then(() => {
                return res.json('Data berhasil dihapus')
            })
            .catch(() => {
                return res.status(404).json('Data tidak ditemukan!')
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

module.exports = { show, create, update, remove }