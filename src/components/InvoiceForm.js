import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from 'react-icons/bi';
import { BiTrash } from 'react-icons/bi';
import InputGroup from 'react-bootstrap/InputGroup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../Invoice.css';
const styles = {
  


  section2: {
    display: 'flex',
    justifyContent: 'center',

  },
  loginBox2: {
    position: 'relative',
  },}
class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹',
     currentDate: new Date().toLocaleDateString(),
      invoiceNumber: 1,
      customerName: null,
      Email: null,
      phoneNumber: null,
      notes: null,
      total: '0.00',
      subTotal: '0.00',
      taxRate: null,
      taxAmount: '0.00',
      discountRate: null,
      discountAmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    };
    const updatedItems = [...this.state.items, newItem];
  this.setState({ items: updatedItems }, () => {
    
    this.handleCalculateTotal();
  });
}

handleCalculateTotal() {
  const items = this.state.items;
  let subTotal = 0;

  
  items.forEach((item) => {
    subTotal += parseFloat((item.price * item.quantity).toFixed(2));
  });

  const taxAmount = parseFloat(subTotal * (this.state.taxRate / 100)).toFixed(2);
  const discountAmount = parseFloat(subTotal * (this.state.discountRate / 100)).toFixed(2);
  const total = (subTotal - discountAmount + parseFloat(taxAmount)).toFixed(2);

  this.setState({
    subTotal: subTotal.toFixed(2),
    taxAmount: taxAmount,
    discountAmount: discountAmount,
    total: total
  });
}
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({items: newItems});
    this.handleCalculateTotal();
  };
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = async (event) => {
    event.preventDefault();
    this.handleCalculateTotal();

    try {
      const response = await axios.post('http://localhost:3001/invoice', {
        currentDate: this.state.currentDate,
        invoiceNumber: this.state.invoiceNumber,
        customerName: this.state.customerName,
        phoneNumber: this.state.phoneNumber,
        Email: this.state.Email,
        notes: this.state.notes,
        total: this.state.total,
        subTotal: this.state.subTotal,
        taxRate: this.state.taxRate,
        taxAmount: this.state.taxAmount,
        discountRate: this.state.discountRate,
        discountAmount: this.state.discountAmount,
        items: this.state.items,
      });

      console.log('Invoice saved successfully:', response.data);
      this.setState({ isOpen: true });
    } catch (error) {
      console.error('Error saving invoice:', error);
      
    }
  };
  closeModal = () => {
    this.setState({ isOpen: false }); 
  };

  render() {
    return (  <section style={styles.section2}>
      <div className="login-box" style={styles.loginBox2}>
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div class="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div class="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="currentdate">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                  <Form.Control type="number" value={this.state.invoiceNumber} name={"invoicenumber"} onChange={(event) => this.editField(event)} min="1" style={{
                      maxWidth: '70px'
                    }} required="required"/>
                </div>
              </div>
              <hr className="my-4"/>
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control placeholder={"Customer Name?"} rows={3} value={this.state.customerName} type="text" name="customerName" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                  <Form.Control placeholder={"Email address"} value={this.state.Email} type="email" name="Email" className="my-2" onChange={(event) => this.editField(event)} autoComplete="email" required="required"/>
                  <Form.Control placeholder={"Phone number"} value={this.state.phoneNumber} type="text" name="phoneNumber" className="my-2" autoComplete="address" onChange={(event) => this.editField(event)} required="required"/>
                </Col>

              </Row>
              <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items}/>
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:
                    </span>
                    <span>{this.state.currency}
                      {this.state.subTotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small ">({this.state.discountRate || 0}%)</span>
                      {this.state.currency}
                      {this.state.discountAmmount || 0}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:
                    </span>
                    <span>
                      <span className="small ">({this.state.taxRate || 0}%)</span>
                      {this.state.currency}
                      {this.state.taxAmmount || 0}</span>
                  </div>
                  <hr/>
                  <div className="d-flex flex-row align-items-start justify-content-between" style={{
                      fontSize: '1.125rem'
                    }}>
                    <span className="fw-bold">Total:
                    </span>
                    <span className="fw-bold">{this.state.currency}
                      {this.state.total || 0}</span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4"/>
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control placeholder="Thanks for your business!" name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={1}/>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100" >Review Invoice</Button>
              <InvoiceModal 
              showModal={this.state.isOpen} 
              closeModal={this.closeModal} 
              info={this.state} 
              items={this.state.items} 
              currency={this.state.currency} 
              subTotal={this.state.subTotal} 
              taxAmount={this.state.taxAmount} 
              discountAmount={this.state.discountAmount} 
              total={this.state.total}
              />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select onChange={event => this.onCurrencyChange({currency: event.target.value})} className="btn btn-light my-1" aria-label="Change Currency">
                  <option value="₹">Rs (Indian Rupees)</option>
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Signapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>   </div>
    </section>)
  }
}   
    class InvoiceItem extends React.Component {
      render() {
        var onItemizedItemEdit = this.props.onItemizedItemEdit;
        var currency = this.props.currency;
        var rowDel = this.props.onRowDel;
        var itemTable = this.props.items.map(function(item) {
          return (
            <ItemRow onItemizedItemEdit={onItemizedItemEdit} item={item} onDelEvent={rowDel.bind(this)} key={item.id} currency={currency}/>
          )
        });
        return (
          <div>
            <Table>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th>PRICE/RATE</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {itemTable}
              </tbody>
            </Table>
            <Button className="fw-bold" onClick={this.props.onRowAdd}>Add Item</Button>
          </div>
        );
    
      }
    
    }
    class ItemRow extends React.Component {
      onDelEvent() {
        this.props.onDelEvent(this.props.item);
      }
      render() {
        return (
          <tr>
            <td style={{width: '100%'}}>
              <EditableField
                onItemizedItemEdit={this.props.onItemizedItemEdit}
                cellData={{
                type: "text",
                name: "name",
                placeholder: "Item name",
                value: this.props.item.name,
                id: this.props.item.id,
              }}/>
              <EditableField
                onItemizedItemEdit={this.props.onItemizedItemEdit}
                cellData={{
                type: "text",
                name: "description",
                placeholder: "Item description",
                value: this.props.item.description,
                id: this.props.item.id
              }}/>
            </td>
            <td style={{minWidth: '70px'}}>
              <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
                type: "number",
                name: "quantity",
                min: 1,
                step: "1",
                value: this.props.item.quantity,
                id: this.props.item.id,
              }}/>
            </td>
            <td style={{minWidth: '130px'}}>
              <EditableField
                onItemizedItemEdit={this.props.onItemizedItemEdit}
                cellData={{
                leading: this.props.currency,
                type: "number",
                name: "price",
                min: 1,
                step: "0.01",
                presicion: 2,
                textAlign: "text-end",
                value: this.props.item.price,
                id: this.props.item.id,
              }}/>
            </td>
            <td className="text-center" style={{minWidth: '50px'}}>
              <BiTrash onClick={this.onDelEvent.bind(this)} style={{height: '33px', width: '33px', padding: '7.5px'}} className="text-white mt-1 btn btn-danger"/>
            </td>
          </tr>
        );
    
      }
    }
    class EditableField extends React.Component {
      render() {
        return (
          <InputGroup className="my-1 flex-nowrap">
            {
              this.props.cellData.leading != null &&
              <InputGroup.Text
                className="bg-light fw-bold border-0 text-secondary px-2">
                <span className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small" style={{width: '20px', height: '20px'}}>
                  {this.props.cellData.leading}
                </span>
              </InputGroup.Text>
            }
            <Form.Control
              className={this.props.cellData.textAlign}
              type={this.props.cellData.type}
              placeholder={this.props.cellData.placeholder}
              min={this.props.cellData.min}
              name={this.props.cellData.name}
              id={this.props.cellData.id}
              value={this.props.cellData.value}
              step={this.props.cellData.step}
              presicion={this.props.cellData.presicion}
              aria-label={this.props.cellData.name}
              onChange={this.props.onItemizedItemEdit}
              required
            />
          </InputGroup>
        );
      }
    }
    
    function GenerateInvoice() {
      html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [612, 792]
        });
        pdf.internal.scaleFactor = 1;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice-001.pdf');
      });
    }
    
    class InvoiceModal extends React.Component {
      constructor(props) {
        super(props);
      }
      render() {
        return(
          <div>
            <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
              <div id="invoiceCapture">
                <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                  <div className="w-100">
                    <h4 className="fw-bold my-2">{this.props.info.billFrom||'payment Billing'}</h4>
                    <h6 className="fw-bold text-secondary mb-1">
                      Invoice #: {this.props.info.invoiceNumber||''}
                    </h6>
                  </div>
                  <div className="text-end ms-4">
                    <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                    <h5 className="fw-bold text-secondary"> {this.props.currency} {this.props.total}</h5>
                  </div>
                </div>
                <div className="p-4">
                  <Row className="mb-4">
                    <Col md={4}>
                      <div className="fw-bold">Billed to:</div>
                      <div>{this.props.info.customerName||''}</div>
                      <div>{this.props.info.phoneNumber||''}</div>
                      <div>{this.props.info.Email||''}</div>
                    </Col>
                  </Row>
                  <Table className="mb-0">
                    <thead>
                      <tr>
                        <th>QTY</th>
                        <th>DESCRIPTION</th>
                        <th className="text-end">PRICE</th>
                        <th className="text-end">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.items.map((item, i) => {
                        return (
                          <tr id={i} key={i}>
                            <td style={{width: '70px'}}>
                              {item.quantity}
                            </td>
                            <td>
                              {item.name} - {item.description}
                            </td>
                            <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price}</td>
                            <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price * item.quantity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Table>
                    <tbody>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.subTotal}</td>
                      </tr>
                      {this.props.taxAmount !== 0.00 &&
                        <tr className="text-end">
                          <td></td>
                          <td className="fw-bold" style={{width: '100px'}}>TAX</td>
                          <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.taxAmount}</td>
                        </tr>
                      }
                      {this.props.discountAmount !== 0.00 &&
                        <tr className="text-end">
                          <td></td>
                          <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                          <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.discountAmount}</td>
                        </tr>
                      }
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.total}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {this.props.info.notes &&
                    <div className="bg-light py-3 px-4 rounded">
                      {this.props.info.notes}
                    </div>}
                </div>
              </div>
              <div className="pb-4 px-4">
                <Row>
                  <Col md={6}>
                    <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                      <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                      <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                      Download Copy
                    </Button>
                  </Col>
                </Row>
              </div>
            </Modal>
            <hr className="mt-4 mb-3"/>
          </div>
    );
  }
}
export default InvoiceForm;     