var Helper = (function() {
  return {

    fixPrice(obj) {
      const possibilites = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      let valueArray = obj.value.split('');
      let lastElement = valueArray[valueArray.length - 1];
      if(!(lastElement in possibilites) && lastElement !== ',' && lastElement !== '.') {
        valueArray[valueArray.length - 1] = "";
        var updateValue = valueArray.join("");
        document.getElementById(obj.id).value = updateValue;
      }
    },

    seePwd(event) {
      event.preventDefault();
      var pwdInput = document.getElementById('pwd');
      var buttonSeePwd = document.getElementById('buttonSeePwd');
      if(pwdInput.type === 'password') {
        pwdInput.type = 'text';
        buttonSeePwd.innerText = "Ocultar Senha";
      } else {
        pwdInput.type = 'password';
        buttonSeePwd.innerText = "Exibir Senha";
      }
    },

    fixPhone(phone) {
      phone = phone.replace('(', '').replace(')','');
      if(phone.length == 2) {
        document.getElementById('phone').value = '(' + phone + ')';
      }
    },

    messageDetails(id) {
      simpleGetAjax('/message-details?id=' + id);
    },

    changeMessageStatus(id, status) {
      simpleGetAjax('/change-status-message?id=' + id + "&status=" + status);
    },

    deleteMessage(id) {
      simpleGetAjax('/delete-message?id=' + id);
    },

    deleteReadedMessage() {
      simpleGetAjax('/delete-readed-messages');
    },

    printData(id, title) {
      var content = document.getElementById(id); // it is a table
      var fontSize = document.getElementById('fontSize').value;
      content.style.fontSize = fontSize + 'px';

      var myWindow = window.open("");
      myWindow.document.write('<html><head>');
      myWindow.document.write('<title>' + title + '</title>');
      myWindow.document.write('</head><body>');
      myWindow.document.write(content.outerHTML);
      myWindow.document.write('</body></html>');
      myWindow.print();
      content.style.fontSize = '16px';
      myWindow.close();

    },

  }
})();

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

function simplePostAjax(url=null, form=null) {
  var xhr = new XMLHttpRequest();
  var formData = new FormData(form)

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

var User = (function () {
  return {
    getOrderHistory: function (userId, userName) {
      let url = '/user-order-history?userId='+userId+"&userName="+userName ;
      simpleGetAjax(url);
    }
  }
})();

var Admin = (function() {
  return {

    profile: function() {
      // show the formulary
      var variableContent = document.getElementById('variableContent');
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          variableContent.innerHTML = this.response;
        } else {
          variableContent.innerHTML = "<h3 class='text-canter'>carregando...</h3>";
        }
      }
      xhr.open('GET', '/profile', true);
      xhr.send();
    },

    updateProfile: function(event) {
      event.preventDefault();
      var email = document.getElementById('email').value;
      var pwd = document.getElementById('pwd').value;
      if(email == '' || pwd == '') {
        alert('Email e senha são obrigatórios');
      } else {
        var variableContent = document.getElementById('variableContent');
        var profileForm = document.getElementById('profileForm');
        var formData = new FormData(profileForm)
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            variableContent.innerHTML = this.response;
          } else {
            variableContent.innerHTML = "<h3 class='text-canter'>carregando...</h3>"
          }
        }
        xhr.open('POST', profileForm.getAttribute('action'), true);
        xhr.send(formData);
      }

    },

    userDetails(userId) {
      var url = '/user-details?userId='+userId;
      simpleGetAjax(url);
    },

    settings() {
      simpleGetAjax('/admin-settings');
    },

    changePhone() {
      var phone = document.getElementById('phone').value;
      var url = '/change-phone?phone=' + phone;

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        variableContent.innerHTML = xhr.response;
      }

      xhr.open('GET', url, true);
      xhr.send();
    },

    changeFontSize() {

      var fontSize = document.getElementById('fontSize').value;
      var url = '/change-font-size?fontSize=' + fontSize;

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        variableContent.innerHTML = xhr.response;
      }

      xhr.open('GET', url, true);
      xhr.send();

    }

  }
})();

var Category = (function() {
  var variableContent = document.getElementById("variableContent");

  return {
    new() {
      document.getElementById('main-menu').className="main-menu navbar-collapse collapse";
      simpleGetAjax('/new-category');
    },

    saveCategory() {
      var categoryForm = document.getElementById('categoryForm');
      simplePostAjax('/url-test', categoryForm);
    },

    formEditCategory(id) {
      var url = '/edit-category?id=' + id;
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
    },

    editCategory() {
      let categoryForm = document.getElementById('categoryForm');
      simplePostAjax('/edit-category', categoryForm);
    },

    deleteCategory() {
      let categoryId = document.getElementById('categoryForm').id.value;
      simpleGetAjax(`/delete-category?categoryId=${categoryId}`);
    }
  }

})()

var Product = (function() {
  var variableContent = document.getElementById("variableContent");

  return {
    new() {
      document.getElementById('main-menu').className="main-menu navbar-collapse collapse";
      simpleGetAjax('/new-product');
    },

    save() {
      var url = '/new-product';
      var productForm = document.getElementById('productForm');
      simplePostAjax(url, productForm);
    },

    formEditProduct(id) {
      var url = '/edit-product?id=' + id;
      simpleGetAjax(url);
    },

    editProduct() {
      var productForm = document.getElementById('productForm');
      simplePostAjax('/edit-product', productForm);
    },

    deactivate(id) {
      var id = document.getElementById('id').value;
      var url = '/deactivate?id='+id;
      simpleGetAjax(url);
    },

    activate(id) {
      var id = document.getElementById('id').value;
      var url = '/activate?id='+id;
      simpleGetAjax(url);
    },

    performStockControl(value) {
      var controlStockDependence = document.getElementById('controlStockDependence');
      var units = document.getElementById('units');
      if(value == 1) {
        controlStockDependence.hidden=false;
        units.hidden=false;
      } else {
        controlStockDependence.hidden=true;
        units.hidden=true;
      }
    },

    searchProduct(event) {
      event.preventDefault();
      var infoSearch = document.getElementById('infoSearch').value;
      var searchResult = document.getElementById('searchResult');
      var url = '/send-info-search?infoSearch=' + infoSearch;
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          searchResult.innerHTML = xhr.response;
        } else {
          searchResult.innerHTML = "<h3>Carregando...</h3>";
        }
      }

      xhr.open('GET', url, true);
      xhr.send();
    }

   }
})();

var Banner = (function() {
  return {
    new() {
      console.log('test');
      document.getElementById('main-menu').className="main-menu navbar-collapse collapse";
      simpleGetAjax('/new-banner');
    },

    saveBanner() {
      var url = '/new-banner';
      var bannerForm = document.getElementById('bannerForm');
      simplePostAjax(url, bannerForm);
    },

    delete(id, name) {
      var url = '/delete-banner?id=' + id + '&name=' + name;
      simpleGetAjax(url);
    }
  }
})();

var Neighborhood = (function() {
  return {
    new() {
      document.getElementById('main-menu').className="main-menu navbar-collapse collapse";
      simpleGetAjax('/new-neighborhood');
    },

    save() {
      var url = '/new-neighborhood';
      var form = document.getElementById('neighborrodForm');
      simplePostAjax(url, form);
    },

    formEditNeighborhood(id) {
      var url = '/edit-neighborhood?id=' + id;
      simpleGetAjax(url)
    },

    edit() {
      var neighborhoodForm = document.getElementById('neighborhoodForm');
      var url = '/edit-neighborhood';
      simplePostAjax(url, neighborhoodForm)
    },

    deactivate(id) {
      var url = '/deactivate-neighborhood?id=' + id;
      simpleGetAjax(url);
    },

    activate(id) {
      var url = '/activate-neighborhood?id=' + id;
      simpleGetAjax(url);
    }
  }
})();

var Deliveryman = (function() {
  return {
    new() {
      var url = '/new-deliveryman';
      simpleGetAjax(url);
    },

    save(event) {
      event.preventDefault();
      var url = '/new-deliveryman';
      var deliverymanForm = document.getElementById('deliverymanForm');
      simplePostAjax(url, deliverymanForm);
    },

    deliverymanDetails(id) {
      var url = "/edit-deliveryman?id="+id;
      simpleGetAjax(url);
    },

    edit() {
      var url = "/edit-deliveryman";
      var deliverymanForm = document.getElementById('deliverymanForm');
      simplePostAjax(url, deliverymanForm);
    },

    delete(id) {
      var url = '/delete-deliveryman?id='+id;
      simpleGetAjax(url);
    },

    sendToDeliveryman(orderId) {
      var stdmForm = document.createElement('form');
      stdmForm.method='POST';
      stdmForm.action='/send-to-deliveryman';

      // order id
      var orderId = document.getElementById('orderId').innerHTML;
      var orderIdInput = document.createElement('input');
      orderIdInput.name='orderId';
      orderIdInput.value=orderId;
      stdmForm.appendChild(orderIdInput);

      // client name
      var clientName = document.getElementById('clientName').innerHTML;
      var clientNameInput = document.createElement('input');
      clientNameInput.name='clientName';
      clientNameInput.value=clientName;
      stdmForm.appendChild(clientNameInput);

      // credit card
      var creditCard;
      var creditCardInput = document.createElement('input');
      creditCardInput.name='creditCard';
      try {
        creditCard = document.getElementById('creditCard').innerHTML;
      } catch (error) {
        console.error('captured error: ' + error);        
      }  
      creditCardInput.value=creditCard;    
      stdmForm.appendChild(creditCardInput);

      // money
      var money;
      var moneyInput = document.createElement('input');
      moneyInput.name='money';
      try {
        money = document.getElementById('money').innerHTML;
      } catch (error) {
        console.error('captured error: ' + error);        
      }
      moneyInput.value=money;      
      stdmForm.appendChild(moneyInput);

      // public place
      var publicPlace = document.getElementById('publicPlace').innerHTML;
      var publicPlaceInput = document.createElement('input');
      publicPlaceInput.name='publicPlace';
      publicPlaceInput.value=publicPlace;
      stdmForm.appendChild(publicPlaceInput);

      // number
      var _number = document.getElementById('_number').innerHTML;
      var _numberInput = document.createElement('input');
      _numberInput.name='_number';
      _numberInput.value=_number;
      stdmForm.appendChild(_numberInput);

      // neighborhood
      var neighborhood = document.getElementById('neighborhood').innerHTML;
      var neighborhoodInput = document.createElement('input');
      neighborhoodInput.name='neighborhood';
      neighborhoodInput.value=neighborhood;
      stdmForm.appendChild(neighborhoodInput);

      // total
      var total = document.getElementById('total').innerHTML;
      var totalInput = document.createElement('input');
      totalInput.name='total';
      totalInput.value=total;
      stdmForm.appendChild(totalInput);

      // rest
      var rest;
      var restInput = document.createElement('input');
      restInput.name='rest';
      try {
        rest = document.getElementById('rest').innerHTML;
      } catch (error) {
        console.error('captured error: ' + error);        
      } 
      restInput.value=rest;     
      stdmForm.appendChild(restInput);
      
      simplePostAjax(null, stdmForm);

    },

    chooseDeliveryman() {
      var chooseDmForm = document.getElementById('chooseDmForm');
      simplePostAjax(null, chooseDmForm);
    },

    reviewDelivery(orderId) {
      var url = '/review-delivery?orderId='+orderId;
      simpleGetAjax(url);       
    }, 

    cancelDelivery(deliveryId, orderId) {
      var url = '/delete-delivery?deliveryId='+deliveryId+'&orderId='+orderId;
      simpleGetAjax(url);
    }

  }
})();

var Order = (function() {
  return {
    orderDetail(orderId, userId) {
      var url = '/order-details?orderId=' + orderId + '&userId=' + userId;
      simpleGetAjax(url);
    },

    markAsFuldilled(id) {
      var url = '/mark-as-fulfilled?id='+id;
      simpleGetAjax(url);
    },

    nofitication() {
      var url =  '/show-nofitications';
      var xhr = new XMLHttpRequest();
      var showNotifications = document.getElementById('showNotifications');
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          // Helper.cleanCache();
          showNotifications.innerHTML = xhr.response;
        }
      };
      xhr.open('GET', url, true);
      xhr.send();
    },

  }
})();

(function() {
  Order.nofitication();
  setInterval(function() {
    Order.nofitication();
  }, 10000);
})();
