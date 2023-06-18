import { useMemo, useReducer, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import themeContext from '../store/theme-context'
import TodoListContext from '../store/todoList-context'
import { todoListReducer } from '../utils/reducer'
import AddTodo from './AddTodo'
import EditTodo from './EditTodo'
import styles from './Routes.module.scss'
import TodoList from './TodoList'

function App() {
  const [todoList, dispatchTodoList] = useReducer(todoListReducer, [])
  const [theme, setTheme] = useState(true)

  return (
    <div className={styles.app}>
      <TodoListContext.Provider
        value={useMemo(
          () => ({
            todoList,
            dispatchTodoList,
          }),
          [todoList]
        )}
      >
        <themeContext.Provider
          value={useMemo(
            () => ({
              theme,
              setTheme,
            }),
            [theme]
          )}
        >
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<TodoList />} />
              <Route path='add' element={<AddTodo />} />
              <Route path='edit' element={<EditTodo />} />
            </Routes>
          </BrowserRouter>
        </themeContext.Provider>
      </TodoListContext.Provider>
    </div>
  )
}

export default App