import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/api/products')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          alert('An error occurred');
        });
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


  const handleCreateClick = () => {
    setIsEditing(true);
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
          fetchData();
        })
        .catch(error => {
          alert('An error occurred');
        });
  }

  const handleEditClick = (item) => {
    setIsEditing(true);
    setNewProduct(item);
  }

  const handleUpdateProduct = () => {
    axios.put('http://localhost:8080/api/products/update', newProduct)
        .then(response => {
          alert('Product updated successfully');
          setIsEditing(false);
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
        </div>
        {/*form create and update*/}
        {isEditing && (
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
              </button>
            </div>
        )}
      </>
  );
}

export default App;
