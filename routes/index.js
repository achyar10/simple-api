const { Router } = require('express')
const { login } = require('../controllers/Auth')
const User = require('../controllers/User')
const Customer = require('../controllers/Customer')
const Inventory = require('../controllers/Inventory')

const route = Router()

// Auth
route.route('/auth/login').post(login)

// User
route.route('/user').get(User.show)
route.route('/user').post(User.create)
route.route('/user').put(User.update)
route.route('/user').delete(User.remove)

// Customer
route.route('/customer').get(Customer.show)
route.route('/customer').post(Customer.create)
route.route('/customer').put(Customer.update)
route.route('/customer').delete(Customer.remove)

// Inventory
route.route('/inventory').get(Inventory.show)
route.route('/inventory').post(Inventory.create)
route.route('/inventory').put(Inventory.update)
route.route('/inventory').delete(Inventory.remove)
route.route('/inventory/scan').post(Inventory.scan)

module.exports = route