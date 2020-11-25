const model = require('../models');
const { Op } = require('sequelize')

const create = (req, res) => {
    try {
        model.inventory.create(req.body)
            .then((doc) => {
                return res.json({ status: true, message: 'OK', data: doc })
            })
            .catch((err) => {
                console.log(err)
                return res.json({ status: false, message: 'Barcode sudah digunakan!' })
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
            page: (page <= 0) ? 1 : page,
            paginate: limit,
            where: { status: true, [Op.or]: [{ desc: { [Op.like]: `%${q}%` } }, { barcode: q }] },
            order: [['desc', 'ASC']]
        }
        const data = await model.inventory.paginate(opt)
        return res.json({ status: true, message: 'OK', data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const scan = async (req, res) => {
    const { barcode } = req.body
    try {
        if (!barcode) return res.status(400).json('Barcode wajib diisi!')
        const data = await model.inventory.findOne({ where: { barcode } })
        if (data) {
            return res.json({ status: true, message: 'OK', data })
        }
        return res.json({ status: false, message: 'Barang tidak ditemukan!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const update = async (req, res) => {
    const { id } = req.body
    try {
        const update = await model.inventory.update(req.body, { where: { id } })
        if (update[0] == 1) {
            return res.json({ status: true, message: 'OK', data: {} })
        }
        return res.json({ status: false, message: 'Barang tidak ditemukan!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}

const remove = (req, res) => {
    const { id } = req.body
    try {
        if (!id) return res.status(400).json('ID wajib diisi!')
        model.inventory.destroy({ where: { id } })
            .then(() => {
                return res.json({ status: true, message: 'OK', data: {} })
            })
            .catch(() => {
                return res.json({ status: false, message: 'Barang tidak ditemukan!' })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Internal Server error' })
    }
}


module.exports = { show, create, scan, update, remove }