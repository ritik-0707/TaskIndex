//post method api:---
async function postJSON(data) {
  const url = "http://localhost:5000/";
  const requestOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    getData();
  } catch (error) {
    console.error("Error:", error);
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  var form = document.getElementById('myForm')
  form.addEventListener('submit', function (event) {
    event.preventDefault()
    let name = document.getElementById('todo_item').value;
    const data = { "todo": name }
    postJSON(data);
    document.getElementById("myForm").reset();
  })
});

//put api:-
async function updateData(_id, updatedData) {
  const confirmed = confirm(`"Are you sure you want to update this item?"`);
  if(confirmed){
  const url = `http://localhost:5000/update/${_id}`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  };
  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      getData();
      var errorMessage = document.getElementById("demo");
      errorMessage.textContent = `element Updated successfully!!`;
      errorMessage.style.display = "block";
      errorMessage.style.backgroundColor = "MediumSeaGreen";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 1000);
    } else {
      console.error('Error modifying data');
      var errorMessage = document.getElementById("demo");
      errorMessage.textContent = `ERROR: Unable to update ${updatedData.todo}!!`;
      errorMessage.style.display = "block";
      errorMessage.style.backgroundColor = "red";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}else{
    getData();
}
};

window.addEventListener("DOMContentLoaded", (event) => {
  var form = document.getElementById('myForm1')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    let name = document.getElementById('update_name').value;
    let id = document.getElementById('update_id').value;
    const data = { "todo": name }
    updateData(id, data);
    document.getElementById("myForm1").reset();
  })
});

//delete api:-
async function deleteData(_id) {
  const confirmed = confirm(`"Are you sure you want to delete this item?"`);
  if (confirmed) {
  const url = `http://localhost:5000/delete/${_id}`;
  const requestOptions = {
    method: 'DELETE'
  };
  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      getData();
      var errorMessage = document.getElementById("demo");
      errorMessage.textContent = `element deleted successfully!!`;
      errorMessage.style.display = "block";
      errorMessage.style.backgroundColor = "MediumSeaGreen";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 1000);
    } else {
      console.error('Error deleting data');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
} else {
  getData();
}
};

const getParticular = async (data) => {
  let response = await fetch(`http://localhost:5000/find/${data.todo}`,
    {
      method: 'get',
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
    });
  if (!response.ok) {
    var errorMessage = document.getElementById("demo");
    errorMessage.textContent = `ERROR: ${data.todo} is not FOUND!!`;
    errorMessage.style.display = "block";
    errorMessage.style.backgroundColor = "red";
    setTimeout(function () {
      errorMessage.style.display = "none";
    }, 3000);
  
  } else {
    let jsonData = await response.json();
    console.log(jsonData);
    if (jsonData.todo.length === 0) {
      var errorMessage = document.getElementById("demo");
      errorMessage.textContent = `ERROR: ${data.todo} is not FOUND!!`;
      errorMessage.style.display = "block";
      errorMessage.style.backgroundColor = "red";
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 3000);
    }
     else {
    document.getElementById("userdata").innerHTML =jsonData.todo
    .map((user, cnt) =>
      `<tr>
      <th scope="row">${cnt + 1}</th>
      <td>${user.todo}</td>
      <td>${user._id}</td>
      <td><button type="button" class="btn btn-danger" onclick="deleteData('${user._id}')">Delete</button></td>
       </tr>`
    ).join("");
    }
  }
};

window.addEventListener("DOMContentLoaded", (event) => {
  var form = document.getElementById('formnav')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    let name = document.getElementById('todo_search').value;
    const data = { "todo": name }
    getParticular(data);
    document.getElementById("formnav").reset();
  })
});


const getData = async () => {
  let response = await fetch("http://localhost:5000/getData",
    {
      method: 'get',
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
    });
  let jsonData = await response.json();
  console.log(jsonData);
  document.getElementById("userdata").innerHTML = jsonData.todo
    .map((user, cnt) =>
      `<tr>
         <th scope="row">${cnt + 1}</th>
            <td>${user.todo}</td>
            <td>${user._id}</td>
            <td><button type="button" class="btn btn-danger" onclick="deleteData('${user._id}')">Delete</button></td>
            </tr>`
    ).join("");
};

getData();