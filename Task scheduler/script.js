document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');
  
    // Fetch upcoming tasks from the backend
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        tasks.forEach(task => {
          const taskElement = createTaskElement(task);
          tasksContainer.appendChild(taskElement);
        });
      })
      .catch(error => console.error(error));
  });
  
  function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
  
    const titleElement = document.createElement('div');
    titleElement.classList.add('task-title');
    titleElement.textContent = task.title;
    taskElement.appendChild(titleElement);
  
    const actionsElement = document.createElement('div');
    actionsElement.classList.add('task-actions');
  
    const emailButton = document.createElement('button');
    emailButton.textContent = 'Set Email Notification';
    emailButton.addEventListener('click', () => setNotification(task.id, 'email'));
    actionsElement.appendChild(emailButton);
  
    const pushButton = document.createElement('button');
    pushButton.textContent = 'Set Push Notification';
    pushButton.addEventListener('click', () => setNotification(task.id, 'push'));
    actionsElement.appendChild(pushButton);
  
    taskElement.appendChild(actionsElement);
  
    return taskElement;
  }
  
  function setNotification(taskId, notificationType) {
    // Send a request to the backend to set the notification
    fetch('/setNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, notificationType }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Notification set successfully!');
        } else {
          alert('Failed to set notification.');
        }
      })
      .catch(error => console.error(error));
  }
  