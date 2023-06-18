export const todoListReducer = (todoList, action) => {
  if (action.type === 'CHECK_TODO') {
    const targetIndex = todoList.findIndex((todo) => todo.id === action.id)
    const newTodoList = [...todoList]
    newTodoList[targetIndex].done = action.checked

    return [...newTodoList]
  }

  if (action.type === 'ADD_TODO') return [action.newTodo, ...todoList]

  if (action.type === 'EDIT_TODO') {
    const targetIndex = todoList.findIndex((todo) => todo.id === action.id)
    const editedTodoList = [...todoList]
    editedTodoList[targetIndex].title = action.title
    editedTodoList[targetIndex].deadline = action.deadline
    editedTodoList[targetIndex].category = action.category

    return [...editedTodoList]
  }

  if (action.type === 'DELETE_TODO') {
    const targetIndex = todoList.findIndex((todo) => todo.id === action.id)
    todoList.splice(targetIndex, 1)

    return [...todoList]
  }

  return [...todoList]
}
