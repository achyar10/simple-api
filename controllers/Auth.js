const model = require('../models')
const md5 = require('md5')

const login = async (req, res) => {
    const { username, password } = req.body
    try {
        if (!username) return res.status(400).json('Username tidak boleh kosong')
        if (!password) return res.status(400).json('Password tidak boleh kosong')
        const check = await model.user.findOne({
            where: { username, password: md5(password) }
        })
        if (check) {
            return res.json({
                username, fullname: check.fullname, role: check.role
            })
        }
        return res.status(400).json('Username atau Password salah!')
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal Server error')
    }
}

module.exports = { login }