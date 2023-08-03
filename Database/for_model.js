const Pool = require('pg').Pool
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'login',
password: 'Test',
port: 5432,
});

const getMerchants = () => {
    return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM forgot_page ', (error, results) => {
    if (error) {
    reject(error)
    }
    resolve(results.rows)
    })
    })
    }
    const createMerchant = (body) => {
    return new Promise(function(resolve, reject) {
    const { newpassword, confirmpassword} = body
    pool.query('INSERT INTO forgot_page (newpassword, confirmpassword) VALUES ($1, $2) RETURNING *', [
        newpassword, confirmpassword], (error, results) => {
    if (error) {
    reject(error)
    }
    resolve(`A new merchant has been added added: ${results.rows[0]}`)
    })
    })
    }
    const deleteMerchant = () => {
    return new Promise(function(resolve, reject) {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM merchants WHERE id = $1', [id], (error, results) => {
        if (error) {
            reject(error)
            }
            resolve(`Merchant deleted with ID: ${id}`)
            })
            })
            }
            module.exports = {
            getMerchants,
            createMerchant,
            deleteMerchant,
            }