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

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerHTML = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const todosBody = document.getElementById("todos");
    todosBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.checked = item.isComplete;
        isCompleteCheckbox.setAttribute('onclick', `updateItem(${item.id})`);
        isCompleteCheckbox.setAttribute("id", `checkBox${item.id}`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'X';
        deleteButton.setAttribute('class', 'deleteButton');
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let todoName = document.createElement("div");
        todoName.setAttribute("class", "todoName");
        todoName.setAttribute("id", `name${item.id}`);
        todoName.innerHTML = item.name;

        let todoContainer = document.createElement("div");
        todoContainer.setAttribute("class", "todo");

        let checkmark = document.createElement("span");
        checkmark.setAttribute("class", "checkmark");

        let label = document.createElement("label");
        label.setAttribute("class", "checkbox");
        label.appendChild(todoName);
        label.appendChild(isCompleteCheckbox);
        label.appendChild(checkmark);

        todoContainer.appendChild(label);
        todoContainer.appendChild(deleteButton);

        todosBody.appendChild(todoContainer);

    });

    todos = data;
}