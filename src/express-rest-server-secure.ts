import express from 'express';
import bodyParser from 'body-parser';

import { Product } from './model/product';


import cors from 'cors';
import * as authController from './controller/AuthController';
import { Customer } from './model/customer';

const app = express();
const PORT = process.env.PORT || 9000;

let products: Array<Product>;

let customers: Array<Customer>;

function load(){
    products = new Array<Product>();
    products.push(new Product(1, "IPhone 11", 80000, "Mobiles"));
    products.push(new Product(2, "Dell Inspiron", 6000, "Laptops"));
    products.push(new Product(3, "Xbox One", 35000, "Gaming"));

    customers = new Array<Customer>();
    customers.push({id: 1, name: "Google", location: "Bangalore"});
    customers.push({id: 2, name: "Microsoft", location: "Hyderabad"});
    customers.push({id: 3, name: "Apple", location: "Bangalore"});
    customers.push({id: 4, name: "Reliance", location: "Mumbai"});
    customers.push({id: 5, name: "Infosys", location: "Bangalore"});
    customers.push({id: 6, name: "Tata Motors", location: "Pune"});
    customers.push({id: 7, name: "Wipro", location: "Bangalore"});
    customers.push({id: 8, name: "Hyundai", location: "Chennai"});

}
load();


app.use(bodyParser.json());

//Middleware(intercepts the request==> preprocessing)
app.use((req, resp, next) => {

    console.log(`In middleware ${req.originalUrl} , process id: ${process.pid}`);
    next();
});


//Enable CORS
app.use(cors());



app.use(bodyParser.json());

app.use("/secure_products", authController.authorizeRequest);
app.use("/secure_customers", authController.authorizeRequest);

app.post("/login", authController.loginAction);
app.post("/refreshToken", authController.refreshToken);


app.get("/products", (req, resp) => {

    resp.json(products);
});

app.get("/secure_products", (req, resp) => {

    resp.json(products);
});

app.get("/customers", (req, resp) => {

    resp.json(customers);
});
app.get("/secure_customers", (req, resp) => {

    resp.json(customers);
});

app.delete("/customers/:id", function(req, resp){

    console.log("Invoking /customers/" + req.params.id +  " DELETE request....");
    var id = parseInt( req.params.id);
    
    var index = customers.findIndex((cust) => cust.id === id);
  
    if(index != -1){
         customers.splice(index, 1);
         resp.json(null);
    }else{
        
        resp.status(404);
        resp.json(null);
    }
})

app.delete("/secure_customers/:id", function(req, resp){

    console.log("Invoking /customers/" + req.params.id +  " DELETE request....");
    var id = parseInt( req.params.id);
    
    var index = customers.findIndex((cust) => cust.id === id);
  
    if(index != -1){
         customers.splice(index, 1);
         resp.json(null);
    }else{
        
        resp.status(404);
        resp.json(null);
    }
})

app.post("/customers", (req, resp)=>{

    var customer = req.body;
    try {
        var index = customers.findIndex((cust) => cust.id === req.body.id);
        if(index !== -1){
            //Bad Request
            resp.status(400);
            resp.json(null);
        }
        else{
            customers.push(customer);
            resp.status(201);
            resp.setHeader("location", "customers/" + customer.id);
            resp.json(null);
        }
    } catch (error) {
        resp.status(503);
        resp.json(null);
    }
    
})

app.put("/customers", function(req, resp){

    console.log("Invoking /customers PUT request...." + req.body.id);
    
    var index = customers.findIndex((cust) => cust.id === req.body.id);

    
    if(index === -1){
        resp.status(404);
        resp.json(null);
    }else{
        
        
        console.log(index);
        customers[index] = req.body;
       
        resp.status(200);
        resp.json(null);
    }

    

})

app.post("/secure_customers", (req, resp)=>{

    var customer = req.body;
    try {
        var index = customers.findIndex((cust) => cust.id === req.body.id);
        if(index !== -1){
            //Bad Request
            resp.status(400);
            resp.json(null);
        }
        else{
            customers.push(customer);
            resp.status(201);
            resp.setHeader("location", "customers/" + customer.id);
            resp.json(null);
        }
    } catch (error) {
        resp.status(503);
        resp.json(null);
    }
    
})

app.put("/secure_customers", function(req, resp){

    console.log("Invoking /customers PUT request...." + req.body.id);
    
    var index = customers.findIndex((cust) => cust.id === req.body.id);

    
    if(index === -1){
        resp.status(404);
        resp.json(null);
    }else{
        
        
        console.log(index);
        customers[index] = req.body;
       
        resp.status(200);
        resp.json(null);
    }

    

})


app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT} with process id: ${process.pid}`);
})

