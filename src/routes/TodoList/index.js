
import { useState, useEffect, useContext } from 'react'
import styles from './TodoList.module.scss'
import { CheckIcon, Magnify } from '../../assets/svgs'
import { useHorizontalScroll } from './useSideScroll'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom'
import TodoListContext from '../../store/todoList-context'
import themeContext from '../../store/theme-context'

const cx = classNames.bind(styles)

const INIT_CATEGORY = ['Task', 'Study', 'Appointment', 'Exercise', 'Etc']

const CATEGORY_COLOR = { Task: 'green', Study: 'blue', Appointment: 'yellow', Exercise: 'black', Etc: 'gray' }

const CATEGORY_WIDTH = 190

function TodoList() {
  const { todoList, dispatchTodoList } = useContext(TodoListContext)
  const { theme, setTheme } = useContext(themeContext)
  const [category] = useState(INIT_CATEGORY)
  const [filterCategory, setFilterCategory] = useState('All')

  const [isTaskLeft, setIsTaskLeft] = useState(false)
  const [taskId, setTaskId] = useState(0)

  const [isSearchClicked, setIsSearchClicked] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [debounceTimer, setDebounceTimer] = useState(0)

  const [today, setToday] = useState(new Date())

  const navigate = useNavigate()

  const handleClickAdd = () => navigate('add')

  const handleChangeTheme = () => {
    setTheme(!theme)
  }

  const handleChangeDone = (e) => {
    const { dataset, checked } = e.currentTarget
    const { id } = dataset

    dispatchTodoList({ type: 'CHECK_TODO', id, checked })
  }

  const handleFilterCategory = (e) => {
    const { dataset } = e.currentTarget
    const { value } = dataset
    filterCategory === value ? setFilterCategory('All') : setFilterCategory(value)
  }

  const handleTodoClick = (e, todoId) => {
    setIsTaskLeft((prev) => !prev)
    setTaskId(() => todoId)
  }

  const handleClickEdit = (e) => {
    const { id } = e.currentTarget.dataset
    const targetIndex = todoList.findIndex((todo) => todo.id === id)

    setIsTaskLeft((prev) => !prev)
    navigate('edit', { state: { targetTodo: todoList[targetIndex] } })
  }

  const handleClickDelete = (e) => {
    const { id } = e.currentTarget.dataset

    setTimeout(() => {
      dispatchTodoList({ type: 'DELETE_TODO', id })
    }, 200)
    setIsTaskLeft((prev) => !prev)
  }

  const checkArrayCategory = (arr, keyword) => {
    return arr.filter((obj) => obj.category === keyword)
  }

  const checkArrayDone = (arr, keyword) => {
    const newArr = checkArrayCategory(arr, keyword)
    return (newArr.filter((obj) => obj.done).length / newArr.length) * 100
  }

  const deboucingSearch = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    const newTimer = setTimeout(async () => {}, 200)
    setDebounceTimer(newTimer)
  }

  const handleSearchClick = () => {
    clearTimeout(debounceTimer)

    setSearchValue(() => '')
    setIsSearchClicked((prev) => !prev)
  }

  const handleSearchChange = (event) => {
    const text = event.currentTarget.value
    setSearchValue(() => text)
    if (text !== '') {
      deboucingSearch(text)
    } else if (text === '') {
      clearTimeout(debounceTimer)
    }
  }

  const getDDay = (deadLine) => {
    const goal = new Date(`${deadLine}T23:59:00+0900`)
    const difference = goal - today
    const dDay = Math.floor(difference / (1000 * 60 * 60 * 24))
    return dDay
  }

  const scrollRef = useHorizontalScroll()

  useEffect(() => {
    const now = new Date()

    setToday(() => now)
  }, [todoList])

  return (
    <div className={styles.todoList} data-theme={theme ? 'light' : 'dark'}>
      <div className={cx(styles.searchBox, { [styles.clicked]: isSearchClicked })}>
        <input
          className={cx(styles.searchInput, { [styles.clicked]: isSearchClicked })}
          type='text'
          value={searchValue}
          onChange={handleSearchChange}
          placeholder='search'
          disabled={!isSearchClicked}
        />
      </div>
      <Magnify className={styles.magnify} onClick={handleSearchClick} />

      <button type='button' className={styles.themeBtn} onClick={handleChangeTheme}>
        {theme ? (
          <span className='material-symbols-outlined'>light_mode</span>
        ) : (
          <span className='material-symbols-outlined'>dark_mode</span>
        )}
      </button>
      <div className={styles.centering}>
        <h1 className={styles.greetings}>TodoList</h1>
        <p className={styles.categoryTitle}>Categories</p>
        <div className={styles.categoriesWrapper} ref={scrollRef}>
          <ul className={styles.categories} style={{ width: `${CATEGORY_WIDTH * category.length + 70}px` }}>
            {category.map((item, idx) => (
              <li
                key={`category-${category[idx]}`}
                className={styles.category}
                data-value={item}
                onClick={handleFilterCategory}
                role='presentation'
              >
                <p className={styles.categoriesCount}>{checkArrayCategory(todoList, item).length} tasks</p>
                <p className={styles.categoriesTitle}>{item}</p>
                <div
                  className={styles.progressBar}
                  style={{ width: `${checkArrayDone(todoList, item)}%`, backgroundColor: `${CATEGORY_COLOR[item]}` }}
                >
                  <span style={{ backgroundColor: `${CATEGORY_COLOR[item]}` }}> </span>
                </div>
                <div className={styles.bar} />
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.tasksTitle}>
          Today&apos;s <span>{filterCategory}</span>
        </p>
        <ul className={styles.tasks}>
          {todoList.reduce((filterdTodoList, todo) => {
            if ((filterCategory === 'All' || filterCategory === todo.category) && todo.title.includes(searchValue)) {
              const { deadline } = todo
              const day = getDDay(deadline)

              filterdTodoList.push(
                <div key={`todoWrap-${todo.id}`} className={styles.wrapTodo}>
                  <li
                    key={`todo-${todo.id}`}
                    className={cx(styles.task, { [styles.slide]: isTaskLeft && taskId === todo.id })}
                  >
                    <div className={styles.checkboxWrapper}>
                      <input
                        type='checkbox'
                        checked={todo.done}
                        data-id={todo.id}
                        onChange={handleChangeDone}
                        className={todo.category.toLowerCase()}
                        style={
                          todo.done
                            ? { backgroundColor: `${CATEGORY_COLOR[todo.category]}` }
                            : { border: `2px solid ${CATEGORY_COLOR[todo.category]}` }
                        }
                      />
                      <CheckIcon />
                    </div>
                    <button
                      type='button'
                      className={styles.wrapTouch}
                      onClick={(e) => handleTodoClick(e, todo.id)}
                      aria-label='Todo Slide button'
                    >
                      <p className={classNames(styles.title, { [styles.done]: todo.done })}>{todo.title}</p>
                      <span className={classNames(styles.dDay, { [styles.dayRed]: day < 3 })}>
                        {day > 0 ? `D-${day}` : `D+${Math.abs(day)}`}
                      </span>
                    </button>
                  </li>
                  <div className={cx(styles.taskSlide, { [styles.slide]: isTaskLeft && taskId === todo.id })}>
                    <button data-id={todo.id} type='button' className={styles.editButton} onClick={handleClickEdit}>
                      Edit
                    </button>
                    <button data-id={todo.id} type='button' className={styles.deleteButton} onClick={handleClickDelete}>
                      Del{' '}
                    </button>
                  </div>
                </div>
              )
            }

            return filterdTodoList
          }, [])}
        </ul>
        <button type='button' className={styles.addButton} aria-label='Add button' onClick={handleClickAdd} />
      </div>
    </div>
  )
}

export default TodoList
