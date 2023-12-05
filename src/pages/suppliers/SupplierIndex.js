import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "reactstrap";
import {
  getAllPurchaseOrders,
  addPurchaseorder,
} from "../../services/purchaseOrderService";
import { toast } from "react-toastify";
import {
  Col,
  Row,
  Card,
  Table,
  Button,
  ButtonGroup,
  Breadcrumb,
  Form,
} from "@themesberg/react-bootstrap";

import { Pagination } from 'antd';
import SpinDiv from "../components/SpinDiv";
import axios from "axios";
import settings from "../../services/settings";
import { authHeader } from "../../services/authHeader";
import { authService } from "../../services/authService";
import { counter } from "@fortawesome/fontawesome-svg-core";
import { Cart } from "../products/Cart";
import { AsyncPaginate } from "react-select-async-paginate";
import { getSuppliers,addSuppliers } from "../../services/supplierService";
import AddSupplier from "./AddSupplier";
import DeleteSupplier from "./DeleteSupplier";

export class SupplierIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      page: 1,
      rows: 10,
      loading: false,
      suppliers: [],
      order: "",
      value:"",
      total: 0,
      options:[]
    };
  }

  componentDidMount() {
    this.getSuppliers();
   
  }

  showToast = (msg) => {
    toast(<div style={{ padding: 20, color: "success" }}>{msg}</div>);
  };
  getSuppliers = () => {

    const { page, rows, order, search } = this.state;
    console.log(order);
    this.setState({ loading: true });
    getSuppliers({ page, rows, search }).then(
      (res) => {
        console.log(res);
        this.setState({
          loading: false,
          suppliers: res.suppliers.data,
          total: res.suppliers.total,
        });
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  };

  

  toggleFilter = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };
  
  
  onFilter = async (e, filter) => {
    console.log(filter);
    await this.setState({ [filter]: e });
    await this.getSuppliers();
  };

  onPage = async (page, rows) => {
    await this.setState({ page, rows });
    await this.getSuppliers();
  }

  
  toggleAddSupplier = () => {
    this.setState({ addSupplier: !this.state.addSupplier });
  };

  toggleDeleteSupplier = (deleteSupplier) => {
    this.setState({ deleteSupplier });
  }
  
  onChange = (e, state) => {
    this.setState({ [state]: e });
  };

  render() {
    const {
      suppliers,
      total,
      addSupplier,
      deleteSupplier,
      rows,
      page,
      search,
      loading,
    } = this.state;
    return (
      <>
        {addSupplier && (
          <AddSupplier
            saved={this.getSuppliers}
            addSupplier={addSupplier}
            toggle={() => this.setState({ addSupplier: null })}
          />
        )}

        {deleteSupplier && (
          <DeleteSupplier
            saved={this.getSuppliers}
            supplier={deleteSupplier}
            toggle={() => this.setState({ deleteSupplier: null })}
          />
        )}

        {loading && <SpinDiv text={"Loading..."} />}
        <Row style={{}}>
          <Col lg="12">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
              <div className="d-block mb-4 mb-md-0">
                <Breadcrumb
                  listProps={{
                    className: " breadcrumb-text-dark text-primary",
                  }}
                >
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#products">products</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="btn-toolbar mb-2 mb-md-0">
                <ButtonGroup>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => this.toggleAddSupplier()}
                  >
                    Create Suppliers
                  </Button>
                  <Button variant="outline-primary" size="sm"  
                  onClick={() => {this.props.history.push('/products')}}

                  >
                    Products
                  </Button>

                  
                 
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="7">
            <h6>Supliers({total})</h6>
           
          </Col>
    
          <Col lg="4" className="">
            <div style={{ display: "flex" }}>
              <Input
                placeholder="Search..."
                id="show"
                style={{ maxHeight: 45, marginRight: 5, marginBottom: 10 }}
                value={search}
                onChange={(e) => this.onChange(e.target.value, "search")}
                autoFocus
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    this.getSuppliers();
                    this.setState({
                      search: "",
                    });
                  }
                }}
              />
              <Button
                className="btn-icon btn-2"
                color="secondary"
                style={{ maxHeight: 45 }}
                size="sm"
                onClick={this.getSuppliers}
              >
                <i className="fa fa-search" />
              </Button>
            </div>
          </Col>
        </Row>
        
        <Card border="light" className="shadow-sm mb-4">
          
          <Card.Body className="pb-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0"
              style={{fontWeight:'bold'}}
            >
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Supplier</th>
                  <th className="border-0">Purchase Order Made</th>
                  <th className="border-0">Tracking ID</th>
                  <th className="border-0">City</th>

                  <th className="border-0">Country</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Phone</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, key) => {
                 
                  return (
                    <tr key={key}>
                      <td>{supplier.name}</td>
                      <td>{supplier.orders_count}</td>
                      <td>{supplier.supplier_id}</td>

                      <td>{supplier.city == null ? " " : supplier.city}</td>
                      <td>{supplier.country == null ? " " : supplier.country}</td>
                      <td>{supplier.email == null ? " " : supplier.email}</td>
                      <td>{supplier.phone == null ? " " : supplier.phone}</td>
                      

                      <td>
                       <ButtonGroup>
                       <Button variant="outline-primary" size="sm" onClick={() => {//console.log('111')
                            this.props.history.push('/supplier/'+supplier.id)
                          }}>
                          View
                        </Button>
                        <Button variant="outline-danger"  size="sm" onClick={() => {//console.log('111')
                           this.toggleDeleteSupplier(supplier)
                          }}>
                          Delete
                        </Button>
                       </ButtonGroup>
                      </td>
                    
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Row>
                  <Col md={12} style={{ fontWeight: "bold", paddingTop: 3 }}>
                    
                    {suppliers.length > 0 ? <Pagination
                      total={total}
                      showTotal={total => `Total ${total} Stocks`}
                      onChange={this.onPage}
                      pageSize={rows}
                      current={page}
                    /> :  <div style={{color: '#ccc', alignSelf: 'center', padding: 10, fontSize: 13}}>
                    <i className="fa fa-ban" style={{marginRight: 5}}/>
                    No Suppliers found
                  </div>}
                  </Col>
                </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default SupplierIndex;
