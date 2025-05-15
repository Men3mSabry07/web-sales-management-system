var title = document.getElementById('title');
var Category = document.getElementById('category');
var price = document.getElementById('price');
var taxes = document.getElementById('taxes');
var ads = document.getElementById('ads');
var discount = document.getElementById('discount');
var Quantity = document.getElementById('quantity');
var Total = document.getElementById('total');
var btnCreate = document.getElementById('btnCreate');
var searchInput = document.getElementById('search');
var formDiv = document.getElementById('form_div');

const API_URL = 'https://6824611465ba0580339a064b.mockapi.io/products';

let mod = 'create'; 
let temp;  
var currentProductId; 


function getTotal() {
    if (price.value != '') {
        let result = (parseInt(price.value) + parseInt(taxes.value) + parseInt(ads.value) - parseInt(discount.value));
        Total.innerHTML = result;
        Total.style.color = '#e74c3c';
    } else {
        Total.innerHTML = '';
    }
}

let dataStorage = [];

fetchProducts();

async function fetchProducts() {
        const response = await fetch(API_URL);
        dataStorage = await response.json();
        display();
}

document.getElementById('myForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    var newProduct = {};
    newProduct.name = title.value; 
    newProduct.category = Category.value;  
    newProduct.price = price.value;  
    newProduct.taxes = taxes.value;  
    newProduct.ads = ads.value;  
    newProduct.discount = discount.value;
    newProduct.quantity = Quantity.value;
    newProduct.total = Total.innerHTML;  
      
        if (mod == 'create') {
            if (parseInt(newProduct.Quantity) > 1) {
                const promises = [];
                for (var i = 0; i < parseInt(newProduct.Quantity); i++) {
                    promises.push(
                        fetch(API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newProduct)
                        })
                    )
                }
                await Promise.all(promises);
            } else {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProduct)
                })   
            }
        } else {
            const response = await fetch(`${API_URL}/${currentProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            
            mod = 'create';
            btnCreate.innerHTML = 'Create Product';
            Quantity.parentElement.parentElement.style.display = 'block';
        }
        
        await fetchProducts();
        clearInputs();
});

function display() {
    var content = '';
    for (var i = 0; i < dataStorage.length; i++) {
        content += '<div class="grid-row">'+
                '<div class="table_cell">'+dataStorage[i].id+'</div>'+
                '<div class="table_cell">'+dataStorage[i].name+'</div>'+
                '<div class="table_cell">'+dataStorage[i].category+'</div>'+
                '<div class="table_cell">$'+dataStorage[i].price+'</div>'+
                '<div class="table_cell">$'+dataStorage[i].taxes+'</div>'+
                '<div class="table_cell">$'+dataStorage[i].ads+'</div>'+
                '<div class="table_cell">'+dataStorage[i].discount+'%</div>'+
                '<div class="table_cell">$'+dataStorage[i].total+'</div>'+
                
                '<div class="table_cell actions">'+
                    '<button onclick="Update(\''+dataStorage[i].id+'\')"  class="action-btn edit">Edit</button>'+
                    '<button onclick="deleteData(\''+dataStorage[i].id+'\')" class="action-btn delete">Delete</button>'+
                '</div>'+
            '</div>';
    }
    
    document.getElementById('table_data').innerHTML = content;
    
    var btnDelete = document.getElementById('DeleteAll');
    if (dataStorage.length > 0) {
        btnDelete.innerHTML = '<button onclick="deleteAllData()" class="btn_secondary">Delete All</button>';
    } else {
        btnDelete.innerHTML = '';
    }
}

display();

async function deleteData(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            }); 
            await fetchProducts();
        }
    }

async function deleteAllData() {
    if (confirm('Are you sure you want to delete all products?')) {
        const deletePromises = dataStorage.map(product => 
                fetch(`${API_URL}/${product.id}`, {
                    method: 'DELETE'
                })
            );
            
            await Promise.all(deletePromises);
            await fetchProducts(); 
        }
    }

async function Update(id) {
        formDiv.style.display = 'block';
        
        const product = dataStorage.find(item => item.id === id);
        
        currentProductId = id;
        
        title.value = product.name;
        price.value = product.price;
        Category.value = product.category;
        ads.value = product.ads;
        discount.value = product.discount;
        taxes.value = product.taxes;
        Quantity.value = product.quantity || 1;
        
        getTotal();
        
        Quantity.parentElement.parentElement.style.display = 'none';
        btnCreate.innerHTML = 'Update Product';
        mod = 'Update';
        
        document.querySelector('.form_title h2').textContent = 'Update Product';
    }

function clearInputs() {
    title.value = '';
    Category.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    Quantity.value = '';
    Total.innerHTML = '';
    document.querySelector('.form_title h2').textContent = 'Add New Product';
}

function searchProducts() {
  var searchValue = searchInput.value.toLowerCase();  
  var content = '';
  for (var i = 0; i < dataStorage.length; i++) {
    if (dataStorage[i].name.toLowerCase().indexOf(searchValue) !== -1 || searchValue === '') {
      content += '<div class="grid-row">'+
              '<div class="table_cell">'+dataStorage[i].id+'</div>'+
              '<div class="table_cell">'+dataStorage[i].name+'</div>'+ 
              '<div class="table_cell">'+dataStorage[i].category+'</div>'+ 
              '<div class="table_cell">$'+dataStorage[i].price+'</div>'+ 
              '<div class="table_cell">$'+dataStorage[i].taxes+'</div>'+ 
              '<div class="table_cell">$'+dataStorage[i].ads+'</div>'+ 
              '<div class="table_cell">'+dataStorage[i].discount+'%</div>'+ 
              '<div class="table_cell">$'+dataStorage[i].total+'</div>'+ 
              '<div class="table_cell actions">'+ 
                  '<button onclick="Update(+dataStorage[i].id )" class="action-btn edit">Edit</button>'+
                  '<button onclick="deleteData(+dataStorage[i].id )" class="action-btn delete">Delete</button>'+
              '</div>'+
          '</div>';
    }
  }
  document.getElementById('table_data').innerHTML = content;
}

