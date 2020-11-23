const model = require('../models');
const { Op } = require('sequelize')

const create = (req, res) => {
    try {
        model.customer.create(req.body)
            .then((doc) => {
                return res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json('Ada kesalahan sistem')
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
            attributes: ['id', 'fullname', 'phone', 'address'],
            page: (page <= 0) ? 1 : page,
            paginate: limit,
            where: { [Op.or]: [{ fullname: { [Op.like]: `%${q}%` } }, { phone: q }] },
            order: [['fullname', 'ASC']]
        }
        const data = await model.customer.paginate(opt)
        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

const update = async (req, res) => {
    const { id } = req.body
    try {
        const update = await model.customer.update(req.body, { where: { id } })
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
        model.customer.destroy({ where: { id } })
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