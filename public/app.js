// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const todoList = document.getElementById('todo-list');

    function fetchTodos() {
        fetch('/todos')
            .then(response => response.json())
            .then(todos => {
                todoList.innerHTML = '';
                todos.forEach(todo => {
                    const li = document.createElement('li');
                    li.dataset.id = todo.id;
                    if (todo.completed) li.classList.add('completed');
                    
                    li.innerHTML = `
                        <span>${todo.task}</span>
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    `;
                    todoList.appendChild(li);
                });
            });
    }

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: taskInput.value })
        }).then(() => {
            taskInput.value = '';
            fetchTodos();
        });
    });

    todoList.addEventListener('click', (event) => {
        const li = event.target.closest('li');
        const id = li.dataset.id;

        if (event.target.classList.contains('delete')) {
            fetch(`/todos/${id}`, {
                method: 'DELETE'
            }).then(() => fetchTodos());
        } else if (event.target.classList.contains('edit')) {
            const newTask = prompt('Edit task:', li.querySelector('span').textContent);
            if (newTask !== null) {
                fetch(`/todos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task: newTask, completed: li.classList.contains('completed') })
                }).then(() => fetchTodos());
            }
        } else {
            li.classList.toggle('completed');
            fetch(`/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: li.querySelector('span').textContent, completed: li.classList.contains('completed') })
            });
        }
    });

    fetchTodos();
});
