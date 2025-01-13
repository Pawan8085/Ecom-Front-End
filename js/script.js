$('#appname').on('click', function(){
    window.location = 'index.html';
  })
const jwt = getJwt();


function fetchCategories(){
    const url = `http://localhost:8080/app/category`
    fetch(url, {
        method: "GET"
    }).then((response) =>{
        if(response.ok){
            return response.json()
        }else {
            throw new Error("Failed to fetch data");
        }
    }).then((category)=>{
        console.log(category);
        appendCategories(category)
    }).catch((error) =>{
        
        console.error("Error:", error.message);
    })
}

function appendCategories(categories){

    categories.forEach(category =>{
        let catDiv = $('<div></div>').addClass('mycat').on('click', function(){
            fetchData(`http://localhost:8080/app/category/product/${category.cid}?page=0`)
           
            $('#categories').css('margin-top', "0");
        });
        console.log(category.image)
        let img = $('<img>')
            .attr('src', category.image)
            .attr('alt', category.name)     
            .addClass('category-image')

        let categoryName = $('<p></p>').text(category.category);
         catDiv.append(img, categoryName);   
        $('#category').append(catDiv);

    })
}

  
window.onload = function(){
        
    const url = "http://localhost:8080/app/customer/profile";
    fetch(url, {
      method: "GET", // or POST if needed
      headers: {
        Authorization: `Bearer ${jwt}`, // Add the JWT token in Authorization header
        "Content-Type": "application/json", // Adjust content type as per API
      },
      
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((customer) => {
       
        $('#username').text(customer.name);
        $('#username').attr('href' , 'profile.html')
      })
      .catch((error) => {
        console.error("Error:", error.message);
        $('#username').text('Login');
        $('#username').attr('href' , 'login.html');
      });

      // load categories
      fetchCategories();
  }
let currentFilter = ''
let filterValues = {
    minPrice : null,
    maxPrice  : null,
    minRating : null
}
$('#search').keypress(function (e) {
  if (e.which == 13) {
      let data = $('#search').val();
      const url = `http://localhost:8080/app/search?q=${data}&page=0`;
      if (data != '') fetchData(url);
      currentFilter = ''
    //   filterValues.minPrice = null;
    //   filterValues.maxPrice = null;
    //   filterValues.minRating = null;
  }
});

function fetchData(url) {
   
  const requestOptions = {
      method: 'GET',
  };

  return fetch(url, requestOptions)
      .then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
          // add filter and sorting option for product
          
        console.log(responseData)
          
          console.log('Response data:', responseData);
          appendData(responseData);
      })
      .catch((error) => {
          console.error('Error:', error);
          throw error;
      });
}

function appendData(data) {
   // clear previous content
   $("#resultdiv").empty();
   $('#message').empty();
   $('#categories').empty();
   $('#categories').css('margin-top', "0");
    if(data.data.length==0)  {
       
        $('#message').text('Result not found!').css({
            'text-align': 'center',
            'margin-top': '30px'
        })
        

        return ;
    }

    

    

    // Create products and filter elements using jQuery
    
    
    var filterAndSorting = $("<div></div>").attr('id', 'filter_and_sorting');

    // Create filter and sorting UI
    let filter = $("<h2></h2>").text("Filters");
    let price = $("<p></p>").text("Price");
    let min = $("<input>").attr({
        'id' : 'min-price',
        'placeholder': 'Min Price',
        'type': 'number',
    });
    let max = $("<input>").attr({
        'id' : 'max-price',
        'placeholder': 'Min Price',
        'type': 'number',
    });

    if(currentFilter == 'priceminmax'){
        min.val(filterValues.minPrice);
        max.val(filterValues.maxPrice);
    }

    let priceFilter = $('<button>Filter With Price</button>').on('click', function(){
        
        let minValue = $('#min-price').val();
        let maxValue = $('#max-price').val();
        let key = $('#search').val();
        
        currentFilter = 'priceminmax';
        
        const url = `http://localhost:8080/app/search/price?q=${key}&min=${minValue}&max=${maxValue}&page=0`;

      
        fetchData(url).then(() => {
            filterValues.minPrice = minValue;
            filterValues.maxPrice = maxValue;
            filterValues.minRating = null;
            $('#min-price').val(minValue); 
            $('#max-price').val(maxValue);
        });
       
    }).css('cursor', 'pointer')
    let rating = $("<p></p>").attr("id", "rating").text("CUSTOMER RATINGS");

    let rat_4 = $("<input>", {
        id: "rat_4",
        type: "checkbox",
        name: "r4",
        value: "4"
    }).on('change', function() {
        handleCheckboxChange(4); 
    });
    
    let leb1 = $("<label>", {
        for: "r4",
        text: "4★ & above"
    });
    
    let rat_3 = $("<input>", {
        id: "rat_3",
        type: "checkbox",
        name: "r3",
        value: "3"
    }).on('change', function() {
        handleCheckboxChange(3);
    });
    
    let leb2 = $("<label>", {
        for: "r3",
        text: "3★ & above"
    });
    
    let rat_2 = $("<input>", {
        id: "rat_2",
        type: "checkbox",
        name: "r2",
        value: "2"
    }).on('change', function() {
        handleCheckboxChange(2);
    });
    
    let leb3 = $("<label>", {
        for: "r2",
        text: "2★ & above"
    });
    
    let rat_1 = $("<input>", {
        id: "rat_1",
        type: "checkbox",
        name: "r1",
        value: "1"
    }).on('change', function() {
        handleCheckboxChange(1);
    });
    
    let leb4 = $("<label>", {
        for: "r1",
        text: "1★ & above"
    });

    $(document).ready(function() {
        if (currentFilter == 'minrating') {
            console.log(currentFilter);
            console.log(filterValues.minRating);
            $(`#rat_${filterValues.minRating}`).prop('checked', true);
        }
    });
    
    

    // Append filter elements to the filterAndSorting div
    filterAndSorting.append(filter, price, min, max, priceFilter, rating, rat_4, leb1, "<br>", rat_3, leb2, "<br>",  rat_2, leb3, "<br>", rat_1, leb4);

    // Append filterAndSorting and products to the resultdiv
    $("#resultdiv").append(filterAndSorting);
    let productResult =  $("<div></div>").attr("id" ,"product-result");

    let sorting = $("<div></div>").addClass("sort");
    let totalResults = $('<p></p>').text(`Showing ${(data.pageInfo.currentPage * data.pageInfo.recordPerPage)+1} - ${(data.pageInfo.currentPage+1)*data.pageInfo.recordPerPage <= data.pageInfo.totalRecords ? (data.pageInfo.currentPage+1)*data.pageInfo.recordPerPage : data.pageInfo.totalRecords} of ${data.pageInfo.totalRecords} results...`).css({
        'font-size' : '15px',
        'font-weight' : '400',
        
    })

    let sortByPrice = $("<div></div>").addClass("sort-by-price");

    let sortBy = $('<p></p>').text('Sort By').css('font-weight', '550');
    let priceLtoH = $('<p></p>').text('Price--Low to High').attr('id', 'price-lToh').on('click', function(){
       
        let key = $('#search').val();
        const url = `http://localhost:8080/app/search/asc?q=${key}&page=${0}`;

        currentFilter = 'asc';
        if (data != '') {
            fetchData(url).then(() => {
                // Reapply styles after data is fetched and rendered
                $('#price-lToh').css({
                    'text-decoration': 'underline',
                    'color': 'blue'
                });
            });
        }
           

    });
    let priceHtoL = $('<p></p>').text('Price--High to Low').attr('id', 'price-hTol').on('click', function(){
       

        let key = $('#search').val();
        const url = `http://localhost:8080/app/search/desc?q=${key}&page=${0}`;
        currentFilter = 'desc';
        if (data != '') {
            fetchData(url).then(() => {
                // Reapply styles after data is fetched and rendered
                $('#price-hTol').css({
                    'text-decoration': 'underline',
                    'color': 'blue'
                });
            });
        }

    });

    

    $(document).ready(function() {
        if(currentFilter == 'asc'){
           
            $('#price-lToh').css({
                'text-decoration': 'underline',
                'color': 'blue'
            })
        }
    });

    $(document).ready(function() {
        if(currentFilter == 'desc'){
            
            $('#price-hTol').css({
                'text-decoration': 'underline',
                'color': 'blue'
            })
        }
    });
    
    sortByPrice.append(sortBy, priceLtoH, priceHtoL);

    productResult.append(sorting);
    sorting.append(totalResults, sortByPrice);

    let products = $("<div></div>").attr('id', 'products');
    
    data.data.forEach(element => {
     
        let newDiv = $("<div></div>").addClass("productdiv");
    
        // Create and append the image section
        let imgDiv = $('<div></div>').addClass('product-img-div');
        let imgElement = $("<img>").attr("src", element.image).attr("alt", element.productName);
        imgDiv.append(imgElement);
    
        // Create and append the product details (name, rating, price)
        let priceRatingDiv = $('<div></div>').addClass('product-price-rating');
    
        // Product name
        if(element.productName.length >= 60){
            element.productName = element.productName.substring(0, 60)+'...';
        }
        let product = $("<p></p>").addClass('product-name').text(element.productName);
    
        // Rating section
        let ratingDiv = $('<div></div>').addClass('rating-div');
        let rating = $("<span></span>").text(`${element.rating}★`).addClass('rating-stars');
        let ratingCount = $("<span></span>").text(`(${element.ratingCount})`).addClass('rating-count');
        ratingDiv.append(rating, ratingCount);
    
        // Price
        let price = $("<p></p>").addClass('product-price').text(`₹${element.price}`);
    
        // Add to Cart button with icon
        let btn = $("<button></button>").addClass('cart-btn').on('click', function(){
            console.log(element.pId);
            addToCart(element.pid);
        });
        let cartIcon = $('<span></span>').addClass('material-symbols-outlined').text('shopping_cart').css('font-size', '16px');
        btn.append(cartIcon).append(' Add to Cart');
    
        // Append product name, rating, price, and button to the priceRatingDiv
        priceRatingDiv.append(product, ratingDiv, price, btn);
    
        // Append image and product info to the main product div
        newDiv.append(imgDiv, priceRatingDiv);
        imgDiv.on('click', function(){
            window.open(`viewproduct.html?pId=${element.pid}`, '_blank');
        })
        ratingDiv.on('click', function(){
            window.open(`viewproduct.html?pId=${element.pid}`, '_blank');
        })
        price.on('click', function(){
            window.open(`viewproduct.html?pId=${element.pid}`, '_blank');
        })
    
        // Append the product div to the products container
       products.append(newDiv);

        

       
    });

    productResult.append(products);
    let page = $("<div></div>").addClass("page");


    let curPageDiv = $('<div></div>').attr('id', "cur-page");
    let curPage = $('<p></p>').text(`Page ${data.pageInfo.currentPage+1} of ${data.pageInfo.totalPages}`).css({
        'font-size' : '14px',
        'width' : '10%'
    }) ;
    curPageDiv.append(curPage);

    let pageOptions = $('<div></div>').attr('id', "pages");

    if(data.pageInfo.currentPage > 0){
        let prevPage = $('<p></p>').text('PREVIOUS').on('click', function(){

            let key = $('#search').val();
            const url = 'http://localhost:8080/app/search'+getRightUrl(key, data.pageInfo.currentPage-1);
            if (data != '') fetchData(url);
        }).css({
            'color' : '#2874f0',
            'font-size' : '15px'
        }).hover(function(){
            $(this).css('cursor' , 'pointer');
        })
        pageOptions.append(prevPage);
    }

    if(data.pageInfo.currentPage < 5){
        for(let i = 1; i <= (data.pageInfo.totalPages < 10 ? data.pageInfo.totalPages : 10); i++){

            let pageDiv = $(`<div>${i}</div>`).addClass('page-div').attr('id', `p${i}`);
        
            // Append the page div to the page options container
            
            pageOptions.append(pageDiv);
            
            // Attach the click event listener to the pageDiv element
            pageDiv.on('click', function() {
                let key = $('#search').val();
                const url = 'http://localhost:8080/app/search'+getRightUrl(key, i-1);
                if (key != '') fetchData(url); // Correct the check here (key instead of data)
            });
           
        }
    }else{

        for(let i=(data.pageInfo.currentPage+1)-4; i<=data.pageInfo.currentPage; ++i){
            let pageDiv = $(`<div>${i}</div>`).addClass('page-div').attr('id', `p${i}`);
        
            // Append the page div to the page options container
            
            pageOptions.append(pageDiv);
            
            // Attach the click event listener to the pageDiv element
            pageDiv.on('click', function() {
                let key = $('#search').val();
                const url = 'http://localhost:8080/app/search'+getRightUrl(key, i-1);
                if (key != '') fetchData(url); // Correct the check here (key instead of data)
            });
        }

       
       
       
        for(let i=data.pageInfo.currentPage+1; i<=(data.pageInfo.currentPage+6 < data.pageInfo.totalPages ? data.pageInfo.currentPage+6 : data.pageInfo.totalPages); ++i){
            let pageDiv = $(`<div>${i}</div>`).addClass('page-div').attr('id', `p${i}`);
        
            // Append the page div to the page options container
            
            pageOptions.append(pageDiv);
            
            // Attach the click event listener to the pageDiv element
            pageDiv.on('click', function() {
                let key = $('#search').val();
                const url = 'http://localhost:8080/app/search'+getRightUrl(key, i-1);
    
                if (key != '') fetchData(url); // Correct the check here (key instead of data)
            });
        }
    }

    
    
    if(data.pageInfo.currentPage+1 < data.pageInfo.totalPages){
        let nextPage = $('<p></p>').text('NEXT').on('click', function(){
            
            let key = $('#search').val();
            const url = 'http://localhost:8080/app/search'+getRightUrl(key, data.pageInfo.currentPage+1);
            if (data != '') fetchData(url);
        }).css({
             'color' : '#2874f0',
            'font-size' : '15px'
            
        }).hover(function(){
            $(this).css('cursor' , 'pointer');
        })
        pageOptions.append(nextPage);
     }

    page.append(curPage, pageOptions);
    productResult.append(page);
    $("#resultdiv").append(productResult);

    // heilight current page
    $(`#p${data.pageInfo.currentPage+1}`).css({
        
        'border-radius' : '15px',
        'background-color' : '#2874f0',
        'color' : 'white',
        
        
     })

     
    
}
function getJwt() {
    const cookies = document.cookie; // Get all cookies as a single string
    const cookieArray = cookies.split("; "); // Split the string into individual cookies

    for (let cookie of cookieArray) {
      if (cookie.startsWith("jwt=")) {
        return cookie.substring(4); // Return the JWT value
      }
    }

    return null;
  }

  


function addToCart(pId) {
    
    const apiUrl = `http://localhost:8080/app/customer/cart/${pId}`;

    fetch(apiUrl, {
        method: 'POST', // Use POST to add the item to the cart
        headers: {
            'Authorization': `Bearer ${jwt}`, // Replace `jwt` with your actual JWT token
            'Content-Type': 'application/json', // Set content type as JSON
        },
        credentials: 'include' // Include cookies if required
    })
    .then(response => {
        if(response.status === 401){
            window.location = "login.html";
        }
        if (!response.ok) {
            
            return response.json().then(error => {
                throw new Error(error.message); // The error message returned by the API
            });
        }else{
            return response.text();
        }
    })
    .then(data => {
       swal('Product added to cart');
    })
    .catch(error => {
        swal(error.message)
        console.error('Error:', error.message);
    });
}


  

  

function getRightUrl(key, page){
    // alert(currentFilter)
    if(currentFilter == 'asc') return `/asc?q=${key}&page=${page}`
    if(currentFilter == 'desc') return `/desc?q=${key}&page=${page}`;
        
    if(currentFilter == 'priceminmax') return `/price?q=${key}&min=${filterValues.minPrice}&max=${filterValues.maxPrice}&page=${page}`;

    if(currentFilter == 'minrating') return `/rating?rating=${filterValues.minRating}&q=${key}&page=${page}`;
    

     return `?q=${key}&page=${page}`;
}

function handleCheckboxChange(ratingValue) {
    if ($(`#rat_${ratingValue}`).is(':checked')) {
        
        currentFilter = 'minrating';
        filterValues.minRating = ratingValue;

        let key = $('#search').val();
        const url = `http://localhost:8080/app/search/rating?rating=${filterValues.minRating}&q=${key}&page=0`;
        if (key != '') fetchData(url);


    } else {
        filterValues.minRating = null;
    }
}


