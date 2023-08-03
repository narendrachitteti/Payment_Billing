const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Test',
  port: 5432,
});

const getInvoices = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM invoice', (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  });
};

const createInvoice = (body) => {
  return new Promise(function (resolve, reject) {
    const {
      currentDate,
      invoiceNumber,
      customerName,
      Email,
      phoneNumber,
      notes,
      total,
      subTotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      items,
    } = body;

    pool.query(
      'INSERT INTO invoice (currentDate,invoiceNumber,customerName,Email, phoneNumber, notes,total,subTotal,taxRate,taxAmount,discountRate,discountAmount,items) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        currentDate,
        invoiceNumber,
        customerName,
        Email,
        phoneNumber,
        notes,
        total,
        subTotal,
        taxRate,
        taxAmount,
        discountRate,
        discountAmount,

        JSON.stringify(items),
      ],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`A new invoice has been added with ID: ${results.rows[0].id}`);
      }
    );
  });
};

const deleteInvoice = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query('DELETE FROM invoices WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(`Invoice deleted with ID: ${id}`);
    });
  });
};

module.exports = {
  getInvoices,
  createInvoice,
  deleteInvoice,
};
