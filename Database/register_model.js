const Pool = require('pg').Pool
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'postgres',
password: 'Test',
port: 5432,
});

const getMerchants = () => {
    return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM register_data ', (error, results) => {
    if (error) {
    reject(error)
    }
    resolve(results.rows)
    })
    })
    }
    const createMerchant = (body) => {
    return new Promise(function(resolve, reject) {
    const { username, email, password, repassword} = body
    pool.query('INSERT INTO register_data (username, email, password, repassword) VALUES ($1, $2, $3, $4) RETURNING *', [
        username, email, password, repassword], (error, results) => {
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