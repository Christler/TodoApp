const uri = 'api/TodoItems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function updateItem(itemId) {
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById(`checkBox${itemId}`).checked,
        name: document.getElementById(`name${itemId}`).textContent
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    return false;
}

function editName(itemId) {
    let textNode = document.getElementById(`name${itemId}`);
    let textBox = document.getElementById(`textBox${itemId}`);
    let editButton = document.getElementById(`editButton${itemId}`);
    let saveButton = document.getElementById(`saveButton${itemId}`);

    textNode.style.display = "none";
    editButton.style.display = "none";
    saveButton.style.display = "block";
    textBox.style.display = "block";

    saveButton.setAttribute("onclick", `saveEdit(${itemId})`);
}

function saveEdit(itemId) {
    let textNode = document.getElementById(`name${itemId}`);
    let textBox = document.getElementById(`textBox${itemId}`);
    let editButton = document.getElementById(`editButton${itemId}`);
    let saveButton = document.getElementById(`saveButton${itemId}`);

    textNode.textContent = textBox.value;
    textBox.style.display = "none";
    textNode.style.display = "block";

    saveButton.style.display = "none";
    editButton.style.display = "block";

    updateItem(itemId);
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerHTML = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.checked = item.isComplete;
        isCompleteCheckbox.setAttribute('onclick', `updateItem(${item.id})`);
        isCompleteCheckbox.setAttribute("id", `checkBox${item.id}`);
        isCompleteCheckbox.setAttribute("class", "form-check-input");

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('id', `editButton${item.id}`);
        editButton.setAttribute('onclick', `editName(${item.id})`);
        editButton.setAttribute("class", "btn btn-secondary")

        let saveButton = document.createElement('button');
        saveButton.innerText = "Save";
        saveButton.setAttribute('id', `saveButton${item.id}`);
        saveButton.setAttribute("class", "btn btn-primary");
        saveButton.style.display = "none";

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'X';
        deleteButton.setAttribute("class", "btn btn-danger")
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createElement('span');
        textNode.textContent = item.name;
        textNode.setAttribute("class", "todoName");
        textNode.setAttribute("id", `name${item.id}`);
        let textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.setAttribute("id", `textBox${item.id}`);
        textBox.style.display = "none";
        td2.appendChild(textNode);
        td2.appendChild(textBox);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);
        td3.appendChild(saveButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}