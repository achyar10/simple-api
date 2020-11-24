const model = require('../models');
const moment = require('moment');
const { Op } = require('sequelize')

const show = async (req, res) => {
    const { page, q, limit, hold } = req.query
    try {
        const opt = {
            page: (page <= 0) ? 1 : page,
            paginate: limit,
            where: { hold, [Op.or]: [{ no_trans: { [Op.like]: `%${q}%` } }] },
            include: [{ model: model.transaction_detail, as: 'items' }],
            order: [['id', 'DESC']]
        }
        const data = await model.transaction.paginate(opt)
        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

const create = async (req, res) => {
    const { userId, customerId, customer_name, customer_phone, pay_method, cash, items, hold } = req.body
    const trans = await model.sequelize.transaction();
    try {
        const fullNo = `#${moment().format('YYMMDD')}/${moment().format('HHmmss')}`
        let total_disc = 0, total_qty = 0, total_hpp = 0, grand_total = 0
        for (const item of items) {
            total_disc += parseInt(item.disc)
            total_qty += parseInt(item.qty)
            total_hpp += parseInt(item.hpp) * parseInt(item.qty)
            grand_total += (parseInt(item.price) * parseInt(item.qty)) - parseInt(item.disc)
        }
        const join = [{ model: model.transaction_detail, as: 'items' }]
        const saveTrans = await model.transaction.create({
            no_trans: fullNo,
            userId, customerId, customer_name, customer_phone, pay_method, cash,
            total_disc, total_qty, total_hpp, grand_total, hold, items
        }, { include: join, transaction: trans })
        let promises = []
        items.map(el => {
            promises.push(model.inventory.decrement('stock', { by: el.qty, where: { id: el.inventoryId }, transaction: trans }))
        })
        await Promise.all(promises)
        await trans.commit()
        return res.json(saveTrans)
    } catch (error) {
        console.log(error)
        await trans.rollback()
        return res.status(500).json('Internal Server error')
    }
}

const cancel = async (req, res) => {
    const { transId } = req.body
    try {
        const check = await model.transaction.findOne({
            where: { id: transId },
            attributes: ['id'],
            include: [{ model: model.transaction_detail, as: 'items' }]
        })
        if (check) {
            let promises = [model.transaction.update({ cancel: true }, { where: { id: transId } })]
            let data = JSON.stringify(check)
            data = JSON.parse(data)
            if (data.items.length > 0) {
                data.items.map(el => {
                    promises.push(model.inventory.increment('stock', { by: el.qty, where: { id: el.inventoryId } }))
                })
            }
            Promise.all(promises)
            return res.json('OK')
        }
        return res.status(404).json('Data tidak ditemukan!')
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

const detail = async (req, res) => {
    const { transId } = req.body
    try {
        const opt = {
            where: { id: transId },
            include: [{ model: model.transaction_detail, as: 'items' }]
        }
        const data = await model.transaction.findOne(opt)
        if (data) {
            return res.json(data)
        }
        return res.status(404).json('Data not found!')
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

module.exports = { show, create, cancel, detail }