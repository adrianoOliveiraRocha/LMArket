'use strict'

const Helper = {
  fixPhone(phone) {
    phone = phone.replace('(', '').replace(')','');
    if(phone.length == 2) {
      document.getElementById('phone').value = '(' + phone + ')';
    }
  },

  fixDate(date) {
    let input = document.getElementById('birthday');
    
    date.split('/').forEach(item => {
      if (isNaN(item)) input.value = null;
    })

    if(date.length === 2) input.value = date + '/';
    if(date.length === 5) input.value = date + '/';

  },

  comeBack() {
    document.location.href='/';
  },  

  getContainerCFHM() {
    let divContainerIsItMoney = document.getElementById('containerIsItMoney');
    // first column
    let mainDiv = document.createElement('div');
    mainDiv.className = 'row';
    
    let col_sm_3 = document.createElement('div');
    col_sm_3.className = 'col-sm-3';
    //label
    let label_form_control = document.createElement('label');
    label_form_control.htmlFor = 'changeForHowMuch';
    label_form_control.className = 'form-control text-center c2';
    label_form_control.innerText = 'Troco pra quanto?';
    col_sm_3.appendChild(label_form_control);
    
    let col_sm_9 = document.createElement('div');
    col_sm_9.className = 'col-sm-9';
    let inputChangeForHowMuch = document.createElement('input');
    inputChangeForHowMuch.type = 'number';
    inputChangeForHowMuch.className = 'form-control';
    inputChangeForHowMuch.name = 'changeForHowMuch';
    inputChangeForHowMuch.id = 'changeForHowMuch';
    col_sm_9.appendChild(inputChangeForHowMuch);
    
    mainDiv.append(col_sm_3);
    mainDiv.append(col_sm_9);

    divContainerIsItMoney.append(mainDiv);

    let hr = document.createElement('hr');
    divContainerIsItMoney.append(hr);

    return divContainerIsItMoney;
  },

  
};

function simpleGetAjax(url) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      variableContent.innerHTML = xhr.response;
    } else {
      variableContent.innerHTML = "<h3>Carregando...</h3>"
    }
  }

  xhr.open('GET', url, true);
  xhr.send();
}

function simplePostAjax(variableContent, form) {
  var xhr = new XMLHttpRequest();
  var formData = new FormData(form);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      variableContent.innerHTML = xhr.response;
    } else {
      variableContent.innerHTML = "<h3>Carregando...</h3>"
    }
  }

  xhr.open("POST", form.getAttribute('action'), true);
  xhr.send(formData);
}

const ShopingCart = {
  insertProduct: function(id) {
    var name = document.getElementById('name_' + id).value;
    var price = document.getElementById('price_' + id).value;
    var stock = document.getElementById('stock_' + id).value;
    var stockControl = document.getElementById('stockControl_' + id).value;
    data = {
      name: name,
      price: price,
      stock: stock,
      quantity: 1,
      subTotal: price,
      stockControl: stockControl,
      added: true
    }
    sessionStorage.setItem(id, JSON.stringify(data));    
    this.verify();   
  }, 

  verify: function() {
    var ids = Object.keys(sessionStorage);
    if(ids.length > 0) {
      ids.forEach(id => {
        var btnId = 'btnInsert_' + id;
        var btn = document.getElementById(btnId);
        if(btn !== null) {
          btn.innerHTML = "Adicionado";
          btn.style.backgroundColor = '#aabbcc';
          btn.style.color = "#233445";
        }
      })
    }
    document.getElementById('productsCounter').innerHTML = 
      '('+ids.length+')';    
    document.getElementById('productsCounterSmall').innerHTML = 
    '('+ids.length+')';
  },

  cleanSession: function() {
    sessionStorage.clear();
    document.getElementById('productsCounter').innerHTML = 0;
    window.location.href='/';
  },

  cancelOrder: function(event) {
    event.preventDefault();
    sessionStorage.clear();
    document.getElementById('productsCounter').innerHTML = 0;
    window.location.href='/';
  },

  deleteItem: function(id, event) {
    event.preventDefault();
    sessionStorage.removeItem(id);
    this.showCart();   
  },

  constructCarForm() {
    
    var cartForm = document.createElement("form");
    var ids = Object.keys(sessionStorage);
    ids.forEach(id => {
      var obj = JSON.parse(sessionStorage.getItem(id));
      
      var el = document.createElement('input');
      el.name = "id_" + id;
      el.value = id;
      cartForm.appendChild(el);

      var el = document.createElement('input');
      el.name = "name_" + id;
      el.value = obj.name;
      cartForm.appendChild(el);
      
      var el = document.createElement('input');
      el.name = "price_" + id;
      el.value = obj.price;
      cartForm.appendChild(el);

      var el = document.createElement('input');
      el.name = "stock_" + id;
      el.value = obj.stock;
      cartForm.appendChild(el);

      var el = document.createElement('input');
      el.name = "quantity_" + id;
      el.value = obj.quantity;
      cartForm.appendChild(el);

      var el = document.createElement('input');
      el.name = "subTotal_" + id;
      el.value = obj.subTotal;
      cartForm.appendChild(el);

      var el = document.createElement('input');
      el.name = "stockControl_" + id;
      el.value = obj.stockControl;
      cartForm.appendChild(el);

    });    
    
    return cartForm;
  },

  showCart: function() {  
    var carForm = this.constructCarForm();
    carForm.method = "post";
    carForm.action = "/show-cart";
    document.body.appendChild(carForm);
    carForm.submit();
  },

  alterQuantity: function(itemId, quantity) {
    var stockControl = parseInt(document.getElementById('stockControl_' + itemId).value);
    
    if(quantity) {
      var quantity = parseInt(quantity);
      var item = JSON.parse(sessionStorage.getItem(itemId));
      
      if(stockControl == 1 && quantity >= parseInt(item.stock)) { 
        alert("No momento, nós temos apenas " + parseInt(item.stock) 
          + " ítems no estoque");
          document.getElementById('show_quantity_'+itemId).value = item.stock;
          quantity = item.stock;
      }
      
      var strPrice = document.getElementById('price_' + itemId).value;
      price = (parseFloat(strPrice.replace(',', '.'))).toFixed(2);
      var newSubTotal = (quantity * price).toFixed(2);
      document.getElementById('subTotal_' + itemId).value = newSubTotal;      
      item.subTotal = newSubTotal;
      data = {
        name: document.getElementById('name_' + itemId).value,
        price: price,
        stock: item.stock,
        quantity: quantity, 
        subTotal: newSubTotal,
        stockControl: stockControl,
        added: true
      }

      sessionStorage.setItem(itemId, JSON.stringify(data));
      this.updateTotal();

    } else {
      console.log('quantity no sended');
    }      

  },

  updateTotal: function() {
    var ids = Object.keys(sessionStorage);
    var total = 0;
    ids.forEach(id => {
      var n = parseFloat((document.getElementById('subTotal_' + id).value).replace(",", "."));
      total = total + n;
    });
    document.getElementById('totalContainer').innerHTML = 'R$ ' 
      + (total.toFixed(2)).replace(".", ",");  
  },

  deliveryData: function() {
    var form = document.getElementById('formItems');
    form.submit();
  },

  useMyAddress(checked) {
    if(checked) {
      document.getElementById('_number').readOnly = true;
      document.getElementById('street').readOnly = true;
      document.getElementById('neighborhood').disabled = true;
      document.getElementById('complement').disabled = true;
    } else {
      document.getElementById('_number').readOnly = false;
      document.getElementById('street').readOnly = false;
      document.getElementById('neighborhood').disabled = false;
      document.getElementById('complement').disabled = false;
    }    
  },

  finalize() {
    var carForm = this.constructCarForm();
    console.log(carForm);
    carForm.method = "post";
    carForm.action = "/get-client-info";
    document.body.appendChild(carForm);
    carForm.submit();
  }
  
}

const Order = {
  orderLogin() {
    var form = document.getElementById('getClientInfoForm');
    simplePostAjax(null, form);      
  },

  sendOrder() {
    let variableContent = document.getElementById('variableContent');
    const sendOrderForm = document.getElementById('sendOrderForm');
    simplePostAjax(variableContent, sendOrderForm);
  },

  choosingPaymentMethod() {
    let containerIsItMoney = document.getElementById('containerIsItMoney');
    let paymentMethod = document.getElementById('paymentMethod').value;
    if(paymentMethod == 'money') {
      containerIsItMoney.innerText = null;
      // let divContainerIsItMoney = Helper.getContainerCFHM();
      containerIsItMoney.appendChild(Helper.getContainerCFHM());
    } else {
      containerIsItMoney.innerText = null;
    }
  },
};

const Message = {
  sendMessage: function(event) {
    event.preventDefault();
    var name = document.getElementById('name');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');
    var clientMessage = document.getElementById('message');
    var errorMessage = [];

    if(name.value == '') {
      name.style.borderColor = 'red';
      errorMessage.push("O campo nome é obrigatório.");
    } 

    if(phone.value == '' && email.value == '') {
      phone.style.borderColor = 'red';
      email.style.borderColor = 'red';
      errorMessage.push("Você deve informar o telefone ou o email.");
    }

    if(clientMessage.value == '') {
      clientMessage.style.borderColor = 'red';
      errorMessage.push("Você precisa digitar alguma mensagem.")
    }

    if(errorMessage == 0) {
      var formMessage = document.getElementById('formMessage');
      simplePostAjax(null, formMessage);
    } else {
      var errorsContainer = document.getElementById('errorsContainer');
      var showErros = '<div class="alert alert-danger text-center">';
      errorMessage.forEach(function(error) {
        showErros += '<p>' + error + '</p>';
      });
      showErros += '</div>';
      errorsContainer.innerHTML = showErros;
    }  

  }
}

const User = {
  isitLoged: function(loged) {
    if(loged === 'true') {
      var form = document.getElementById('getClientInfoForm');
      simplePostAjax(null, form);
    }
  }
}

const Manual = (function() {
  return {
    
    getContent(contentId) {
      var contentIds = [1, 2, 3, 4, 5, 6, 7];
      for(let i = 1; i <= contentIds.length; i++) {
        if(i == contentId){
          document.getElementById(i).style.display='block';
        } else {
          document.getElementById(i).style.display='none';
        }
      }
    },

  }
})();