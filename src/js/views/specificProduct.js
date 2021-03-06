
import {burgerPageEventListener, cancelOrder, pageBackEventListener} from "../helpers/eventListeners";
import  CONSTANTS from "../helpers/constants";
import {State} from "../model";
import {logPlugin} from "@babel/preset-env/lib/debug";

const renderSpecificProductPage = () => {
    document.querySelector(".container").innerHTML += ` <div id="mainContainer">
         <div class="gridContainer">
         </div>
    </div>`;

    let productId = window.location.hash.split("/").pop();
    console.log(productId);

    fetch(`${CONSTANTS.HOST}/product?url=get-by-id&product_id=${productId}`).
        then(function(response){
          return response.json();
    }).then(function(data) {
        console.log(data[0].ingredients);

            let sp =  data.reduce((acc,current) => {
          return acc +=
              `<div class="item1">
            <h3>${current.name}</h3>
        </div>
        <div class="item2">
            <div class="pizza-img">
                <img class="spcProductImg" src=${current.imagePath} alt=${current.name}>
            </div>
            <div class="price">
                <label>Գին՝ ${current.currency}</label>
                <label class="productPrice">${current.price}</label>
            </div>
        </div>
          <div class="item3">
             <h4>Բաղադրություն</h4>
            <div class="ingredientsOfProduct">
          
            </div>
             <h4>Քանակ</h4>
            <div class="numberOfProduct">
                <div class="quantityOfProduct"> 
                <label>Կտոր</label>
                 <button id="subtract">-</button>
                <input type="text" id="quantity" value="1" name="quantity">
                <button id="add">+</button> 
                 </div>
                 <div class="totalPriceDiv">
                  <label>Ընդհանուր գին</label>
                <input type="text" id="totalPrice" value="${current.price}" name="quantity">
                </div>
               
            </div>
            <button id="addToBasket">Ավելացնել զամբյուղ</button>
        </div>`
      }, "");

           let item3 = data[0].ingredients.reduce((acc,current) => {
                return acc +=  `<label> ${current.name} </label>`
            },"")


        document.querySelector(".gridContainer")
            .insertAdjacentHTML("afterbegin", sp);
        document.querySelector(".ingredientsOfProduct")
            .insertAdjacentHTML("afterbegin", item3);

        let quantity = document.getElementById("quantity");
        let initialPrice = document.querySelector(".productPrice").innerHTML;
        let totalPrice = document.getElementById("totalPrice");
        document.getElementById("add").addEventListener("click", ()=>{
            quantity.value++;
            totalPrice.value = initialPrice * quantity.value; // si pongo el numero, no cambia auto..
        });
        document.getElementById("subtract").addEventListener("click", ()=>{
            if(quantity.value>0)
            {quantity.value--;
                totalPrice.value = +(initialPrice * quantity.value);
            }
        });

        document.getElementById("addToBasket").addEventListener("click", ()=>{

            let orderObj = {
                id : data[0].id,
                name : data[0].name,
                img : data[0].imagePath,
                price : Number(data[0].price),
                amount : Number(quantity.value),
                totalPrice : Number(totalPrice.value)
            }
            console.log("orderobj =  " ,orderObj);

            let basket = State.basket;

            console.log("basket",basket);


          let found = basket.find(element => element.id == orderObj.id); //find
           if(found) {
               found.amount += Number(orderObj.amount);
               found.totalPrice = Number(orderObj.totalPrice + found.totalPrice);
           }
           else {
               basket.push(orderObj);
           }

            //if(orderObj.id == basket.some(item => item.id == )
           // basket = basket.map(item => {
           //     console.log("basket");
           //     // (item.id == orderObj.id) {
           //     //  item.amount += orderObj.amount;
           //     //  item.price += orderObj.price;
           //     //  return item;
           //
           //  });



            console.log("basket pushed",basket);

            document.getElementById("basketCounter").innerHTML = State.basket.length;

        });


        burgerPageEventListener();
    });
};

export {renderSpecificProductPage};

// <label> Պանիր </label>