import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Field, Form, Formik} from "formik";

function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPage, setTotalPage] = useState(0);
    const  [data, setData] = useState(null);
    const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [list, setList] = useState(true);
  // useEffect(() => {
  //   fetchData();
  // },[]);
  const fetchData = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    axios.get('http://localhost:8080/api/products')
        .then(response => {
            setTotalPage(parseInt((response.data.length / itemsPerPage) + 1))
            console.log(totalPage)
            setData(response.data.slice(startIndex, endIndex));
        })
        .catch(error => {
          alert('An error occurred');
        });
  }
    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }


    const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setNewProduct(prevState => {
      return {
        ...prevState,
        [fieldName]: fieldValue
      };
    });
  }
  const backToList = () => {
    setList(true)
      setIsEditing(false)
  }
  const handleCreateClick = () => {
      setList(false)
    setIsEditing(true)
    setNewProduct({
      name: '',
      price: '',
      quantity: ''
    });
  }

  const handleCreateProduct = () => {
    axios.post('http://localhost:8080/api/products/create', newProduct)
        .then(response => {
          alert('Product created successfully');
          setIsEditing(false);
          setList(true)
          fetchData();
        })
        .catch(error => {
          alert('An error occurred');
        });
  }

  const handleEditClick = (item) => {
      setList(false)
    setIsEditing(true);
    setNewProduct(item);
  }

  const handleUpdateProduct = () => {
    axios.put('http://localhost:8080/api/products/update', newProduct)
        .then(response => {
          alert('Product updated successfully');
          setIsEditing(false);
          setList(true)
          fetchData();
        })
        .catch(error => {
          alert('An error occurred');
        });
  }

  const DeleteProduct = (id) => {
    axios.delete(`http://localhost:8080/api/products/${id}`)
        .then(response => {
          alert('Product deleted successfully');
          setData(prevData => prevData.filter(item => item.id !== id));
        })
        .catch(error => {
          alert('An error occurred');
        });
  }
  const SearchByName = () => {
      console.log(newProduct)
      let nameP = newProduct.name
      console.log(nameP)
      axios.get(`http://localhost:8080/api/products/search?name=${nameP}`)
          .then(response => {
            setData(response.data)
        })
        .catch(error => {
          alert('An error occurred');
        });
  }

  return (
      <>
          {list && (
        <div>
            <div className="search-box">
                <div className="container text-center">
                    <div className="form-group d-inline-block" style={{maxWidth: '150px'}}>
                        <label className="form-label">Search By Name</label>
                        <input onChange={handleInputChange} required style={{width: '200px', textAlign: 'center'}} type="text"
                               className="form-control" name="name" />
                    </div>
                    <button onClick={SearchByName} style={{verticalAlign: 'middle', marginLeft: '60px', borderRadius: '13px'}} className="btn btn-primary">Search</button>
                </div>
            </div>
            <h2 style={{ textAlign: 'center', marginTop: '10px', marginBottom : '10px'}}>List Product</h2>
          <button style={{marginLeft : '450px'}} onClick={handleCreateClick} className="btn btn-primary">Create</button>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', border: '1px', width: '700px' }} className="table table-hover">
            <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th colSpan="2">#</th>
            </tr>
            </thead>
            <tbody>
            {data && data.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td><button style={{width : '70px'}} className="btn btn-warning" onClick={() => handleEditClick(item)}>Edit</button></td>
                  <td><button style={{width : '70px'}} onClick={() => DeleteProduct(item.id)} className="btn btn-danger">Delete</button></td>
                </tr>
            ))}
            </tbody>
          </table>
            <div style={{ textAlign: 'center', marginTop: '20px'}}>
            <button className="btn btn-outline-primary"  style={{ borderRadius: '15px', color: 'black' }}
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || !data}>Previous</button>
                <span style={{fontSize: '16px'}}>{currentPage} / {totalPage}</span>
            <button className="btn btn-outline-primary" style={{ borderRadius: '15px', color: 'black' }}
               onClick={() => handlePageChange(currentPage + 1)} disabled={!data || data.length < itemsPerPage}>Next</button>
        </div>
        </div>
          )}
        {/*form create and update*/}
        {isEditing && (
            //Formik
         //    <div style={{width: "500px", margin: 'auto'}}>
         //        <h2 style={{ textAlign: 'center', marginTop: '10px' }}>{newProduct.id ? 'Edit Product' : 'Create Product'}</h2>
         // <Formik initialValues={newProduct} onSubmit={newProduct.id ? handleUpdateProduct : handleCreateProduct}>
         //     <Form>
         //         <div className="mb-3">
         //             <label className="form-label">Name</label>
         //             <Field className="form-control" name={'name'}></Field>
         //         </div>
         //         <div className="mb-3">
         //             <label className="form-label">Price</label>
         //             <Field className="form-control" name={'price'}></Field>
         //         </div>
         //         <div className="mb-3">
         //             <label className="form-label">Quantity</label>
         //             <Field className="form-control" name={'quantity'}></Field>
         //         </div>
         //     </Form>
         // </Formik>
         //    </div>


            //Form thường
            <div style={{width: "500px", margin: 'auto'}}>
              <h2 style={{ textAlign: 'center', marginTop: '10px' }}>{newProduct.id ? 'Edit Product' : 'Create Product'}</h2>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" type="text" name="name"
                         value={newProduct.name} onChange={handleInputChange} />
                </div>
             <div>
                <label className="form-label">Price</label>
                <input className="form-control" type="text" name="price"
                       value={newProduct.price} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Quantity</label>
                <input className="form-control" type="text" name="quantity"
                       value={newProduct.quantity} onChange={handleInputChange} />
              </div>
              <button style={{ marginTop: '20px' }} className={newProduct.id ?
                  "btn btn-warning" : "btn btn-primary"} onClick={newProduct.id ?
                  handleUpdateProduct : handleCreateProduct}>
                {newProduct.id ? 'Update' : 'Create'}
              </button> <br/>
                <button style={{marginTop: '40px'}} className="btn btn-info" onClick={backToList}>Back to list</button>
            </div>
        )}
      </>
  );
}

export default App;
