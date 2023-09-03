const form = document.querySelector(".signup form"),
continueBtn = form.querySelector(".button input"),
errorText = form.querySelector(".error-text");

form.onsubmit = (e)=>{
    e.preventDefault();
}

// -------------- bring not available usernames -------------
let xhr = new XMLHttpRequest();
let takenNames = [];
xhr.open("GET", backendURL+"/unique-client-names", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = ()=>{
  if(xhr.readyState === XMLHttpRequest.DONE){
      if(xhr.status === 200){
          console.log(xhr.response)
          let data = JSON.parse(xhr.response);
          takenNames = data;
      }
  }
}
xhr.send();
// -------------------------------------------------------------

continueBtn.onclick = ()=>{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", backendURL+"/signup", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE){
          if(xhr.status === 200){
              let data = xhr.response;
              console.log("------------vagi print signup data------");
              console.log(data);
              if(data != null){
                location.href="login.html";
              }else{
                errorText.style.display = "block";
                errorText.textContent = data;
              }
          }
      }
    }
    // ------------------ Get form input values ---------------------
    const username = document.getElementById('username').value;

    if (takenNames == null) takenNames = [];
    if (takenNames.includes(username)) {
      errorText.style.display = "block";
      errorText.textContent = "username " + username + " already in use!!!";
      return;
    }
    const password = document.getElementById('password').value;
    if (username != "" && password != null && password != "") {
      const requestBody = {
        clientName: username,
        clientSecret: password
      };
      xhr.send(JSON.stringify(requestBody)); 
    } 
} 