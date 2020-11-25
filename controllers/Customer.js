const model = require('../models');
const { Op } = require('sequelize')

const create = (req, res) => {
    try {
        model.customer.create(req.body)
            .then((doc) => {
                return res.json({ status: true, message: 'OK', data: doc})
            })
            .catch((err) => {
                console.log(err)
                return res.json({ status: false, message: 'Ada kesalahan sistem' })
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
            attributes: ['id', 'fullname', 'phone', 'address'],
            page: (page <= 0) ? 1 : page,
            paginate: limit,
            where: { [Op.or]: [{ fullname: { [Op.like]: `%${q}%` } }, { phone: q }] },
            order: [['fullname', 'ASC']]
        }
        const data = await model.customer.paginate(opt)
        return res.json({ status: true, message: 'OK', data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const update = async (req, res) => {
    const { id } = req.body
    try {
        const update = await model.customer.update(req.body, { where: { id } })
        if (update[0] == 1) {
            return res.json({ status: true, message: 'OK', data: {} })
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
        model.customer.destroy({ where: { id } })
            .then(() => {
                return res.json({ status: true, message: 'OK', data: {} })
            })
            .catch(() => {
                return res.json({ status: false, message: 'Data tidak ditemukan!' })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

module.exports = { show, create, update, remove }