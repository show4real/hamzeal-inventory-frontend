import React from 'react';
import {
  Col,
  Row,
  Nav,
  Card,
  Table,
  Form,
  Button,
  ButtonGroup,
  Breadcrumb,
  InputGroup,
  Dropdown,
} from "@themesberg/react-bootstrap";
import moment from "moment";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe, faPhone, faVoicemail } from '@fortawesome/free-solid-svg-icons';
import { addCompanyProfile, getCompany } from "../../services/companyService"
import { toWords } from "../../services/numberWordService"


export class Invoice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      company: props.company,

      user: props.user,
      loading: false,
      saving: false,
    };
  }

  getWords(amount) {
    return toWords(amount)
  }


  totalCost = () => {
    const { items } = this.props;

    var total = 0;
    for (let v = 0; v < items.length; v++) {
      total += items[v].rate * items[v].quantity;
    }
    return total;
  };
  formatCurrency2(x) {

    if (x !== null && x !== 0 && x !== undefined) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${parts.join(".")}`;
    }
    return 0;
  }

  formatCurrency(y, x) {
    if (x !== 'null' && x !== '0') {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${y}${parts.join(".")}`;
    }
    return '0';
  }


  render() {
    const { invoice, user, previous_payment, pos_items, items, company } = this.props;

    return (
      <div style={{ padding: 10, }}>
        {Object.keys(invoice).length !== 0 &&
          <body>
            <header >

              <div class="logo" style={{ fontWeight: 600, color: 'black' }}><img width={100} src={`${company && company.logo_url}`} /></div>
              <h1 style={{ fontWeight: 600, fontFamily: 'monaco, Consolas, Lucida Console, monospace', textAlign: 'center', color: 'black' }}>
                {company !== null ? company.name : ' '}
              </h1>
            </header>




            <table  >
              <tbody>
                <tr >
                  <th class="center-align" colspan="2"><span class="receipt" style={{ whiteSpace:'pre-line',fontWeight: 600, fontSize: 20, lineHeight: 1.6, fontFamily: 'monaco, Consolas, Lucida Console, monospace', color: 'black' }}>
                    {company && company.invoice_header}
                  </span></th>
                </tr>
                {company && <tr>
                  <th class="center-align"><span class="receipt" style={{ fontWeight: 600, fontSize: 20, lineHeight: 1.6, fontFamily: 'monaco, Consolas, Lucida Console, monospace', color: 'black' }}>
                    <span><FontAwesomeIcon icon={faPhone} /> {company.phone_one}, &nbsp;{company.phone_two}</span><span>&nbsp;&nbsp;
                      <FontAwesomeIcon icon={faGlobe} />&nbsp;{company.website}</span>
                  </span></th>

                </tr>}
              </tbody>
            </table>

            <table class="bill-details" style={{ marginTop: 30, marginLeft:23 }}>
              <tbody>

                <tr >
                  <td style={{ fontWeight: 600, color: 'black', fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', lineHeight: 1.6 }}><span>
                    Date:{moment(invoice.issued_date).format('MMM DD YYYY')}<br />
                    {invoice.due_date === invoice.issued_date ? '' : `  Due:` + moment(invoice.due_date).format('MMM DD YYYY')}<br /></span>
                    Invoice #:{invoice.invoice_no}<br />
                    <span style={{whiteSpace:'pre-line'}}>
                      {company && company.address}<br />
                    </span>

                  </td>




                  <td style={{ paddingRight: 92, textAlign: 'right', fontWeight: 600, fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', color: 'black', lineHeight: 1.6 }}>
                    <span>
                      {invoice.client.name}<br />
                      {invoice.client.address}<br />
                      {invoice.client.phone}<br />
                      {invoice.client.email !== '' ? invoice.client.email : ''}

                    </span>
                  </td>
                </tr>
                <tr>


                </tr>

              </tbody>
            </table>

            <table style={{marginLeft:25, marginTop:15, fontSize:20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', fontWeight:700, color: 'black'}}>
              <thead style={{ }}>
                <tr>
                  {/* <th class="heading name" style={{ paddingLeft:10, color:'black', fontFamily: 'monaco, Consolas, Lucida Console, monospace', textAlign:'justify', fontSize:18, fontWeight:700}}>Item</th> */}
                  <th>Description</th>
                  <th >Qty</th>
                  <th>Rate</th>
                  <th>Cost</th>
                </tr>
              </thead>

              <tbody>
                
                 {Object.keys(pos_items).length !== 0 ? pos_items.map((item, key) => {

                      return (
                        <tr style={{}}>
                         

                          <td >{item.order.product_name}</td>
                          <td style={{ verticalAlign: 'top' }}>{item.qty_sold}</td>
                          <td style={{ verticalAlign: 'top' }}>{this.formatCurrency2(item.selling_price)}</td>
                          <td style={{ verticalAlign: 'top' }}>{this.formatCurrency2(item.selling_price*item.qty_sold)}</td>
                        </tr>

                      );
                      }) : ''}
                      <tr>
                  <td colSpan={3}>

                  </td>
                  <td >
                    <tr style={{ paddingTop: 20 }}>
                      <td>Total:{this.formatCurrency(invoice.currency, invoice.amount)}</td>
                    </tr>

                    <tr style={{ paddingTop: 10 }}>
                      <td>Paid:{this.formatCurrency(invoice.currency, invoice.total_payment)}</td>


                    </tr>
                    <tr style={{ paddingTop: 10 }}>
                      {invoice.total_balance > 0 && <>
                        <td>Balance:{this.formatCurrency(invoice.currency, invoice.total_balance)}</td>
                      </>}
                    </tr>
                  </td>
                </tr>




              </tbody>
            </table>
           


            <div style={{
              fontWeight: 800, textTransform: 'uppercase', paddingLeft: 20, fontSize: '13px', color: 'black', fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace',
              verticalAlign: 'bottom', lineHeight: 1.6, marginTop: 30
            }}><strong>Amount in word:{this.getWords(invoice.amount) + ` ` + invoice.currency}</strong></div>


            <div style={{
              fontWeight: 800, paddingLeft: 20, fontSize: '13px', color: 'black', fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace',
              verticalAlign: 'bottom', lineHeight: 1.6
            }}><strong>{company && company.invoice_footer_one}</strong></div>
            <div style={{
              fontWeight: 700, paddingLeft: 20, fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', color: 'black',
              verticalAlign: 'bottom'
            }}>Terms and Condition!</div>
            <div style={{whiteSpace:'pre-line',
              fontWeight: 800, paddingLeft: 20, fontSize: 20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', color: 'black',
              verticalAlign: 'bottom', lineHeight: 1.6, marginBottom: 30
            }}>

              {company && company.invoice_footer_two}
            </div>


            <table style={{marginLeft:20}}>
              <tr >
                <td colSpan={3}>&nbsp;&nbsp;  __________________________</td>


              </tr>
              <tr style={{ marginBottom: '20px' }}>
                <td><span style={{ fontSize: 20, paddingLeft:20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', paddingLeft: 10, color: 'black' }}>Customer Signature</span></td>
              </tr>
              <tr style={{ marginBottom: '20px' }}>
                <td><span style={{ fontSize: 20, paddingLeft:20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', paddingLeft: 10, color: 'black' }}></span></td>
              </tr>

              <tr style={{ marginTop: 40, }}>
                <td><span style={{ fontSize: 20, paddingLeft:20, fontFamily: 'monaco, Consolas, Lucida Console, monospace', paddingLeft: 10, color: 'black' }}>Cashier: {invoice.cashier_name}</span></td>
              </tr>
            </table>

          </body>
        }
      </div>

    );
  }
}
export default Invoice;