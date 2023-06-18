import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uuid from 'react-uuid'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowUp, MdOutlineEditCalendar } from 'react-icons/md'
import { Circle } from '../../assets/svgs'
import TodoListContext from '../../store/todoList-context'
import { dateFormatter } from '../../utils'
import styles from './AddTodo.module.scss'
import classNames from 'classnames/bind'
import themeContext from '../../store/theme-context'

const cx = classNames.bind(styles)

const CATEGORY_LIST = ['Task', 'Study', 'Appointment', 'Exercise', 'Etc']
const CATEGORY_COLOR = {
  Task: 'green',
  Study: 'blue',
  Appointment: 'yellow',
  Exercise: 'black',
  Etc: 'gray',
}
const TODAY = dateFormatter(new Date())

function AddTodo() {
  const { dispatchTodoList } = useContext(TodoListContext)
  const { theme } = useContext(themeContext)
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState(TODAY)
  const [category, setCategory] = useState('Etc')
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => navigate(-1)

  const handleChangeTitle = (e) => {
    setTitle(e.currentTarget.value)
  }

  const handleChangeDeadline = (e) => {
    setDeadline(e.currentTarget.value)
  }

  const handleToggleOption = () => {
    setShowOptions((prev) => !prev)
  }

  const handleSelectCategory = (e) => {
    setCategory(e.currentTarget.name)
    setShowOptions((prev) => !prev)
  }

  const handleSubmitTodo = (e) => {
    e.preventDefault()

    if (title.trim().length === 0) return

    const newTodo = {
      id: uuid(),
      title,
      deadline,
      category,
      done: false,
    }

    dispatchTodoList({ type: 'ADD_TODO', newTodo })
    navigate('/')
  }

  const categoryRef = useRef()
  const handleClickOutSide = (e) => {
    if (showOptions && !categoryRef.current.contains(e.target)) setShowOptions(false)
  }

  useEffect(() => {
    if (showOptions) document.addEventListener('mousedown', handleClickOutSide)
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  })

  return (
    <div className={styles.todoList} data-theme={theme ? 'light' : 'dark'}>
      <button type='button' className={styles.closeButton} onClick={handleClose} aria-label='close-button'>
        <AiOutlineClose />
      </button>
      <form action='' onSubmit={handleSubmitTodo}>
        <input
          data-theme={theme ? 'light' : 'dark'}
          className={styles.taskInput}
          type='text'
          placeholder='Enter new task'
          value={title}
          onChange={handleChangeTitle}
        />
        <button type='submit' className={styles.addButton}>
          New task
          <MdKeyboardArrowUp />
        </button>
      </form>
      <div className={styles.optionsWapper}>
        <div className={styles.calendarBox}>
          <MdOutlineEditCalendar />
          <input
            data-theme={theme ? 'light' : 'dark'}
            type='date'
            value={deadline}
            min={TODAY}
            onChange={handleChangeDeadline}
            className={styles.dateInput}
          />
          <span className={styles.optionTitle}>{deadline === TODAY ? 'TODAY' : deadline.slice(5)}</span>
        </div>

        <div className={styles.categoryBox} ref={categoryRef}>
          <button
            type='button'
            className={cx(styles.optionTitle, category.toLocaleLowerCase())}
            onClick={handleToggleOption}
          >
            <Circle fill={CATEGORY_COLOR[category]} />
            <span className={styles.categorName}>{category}</span>
          </button>
          {showOptions && (
            <div className={styles.optionsWrapper}>
              {CATEGORY_LIST.map((categoryName) => (
                <div key={`category-${categoryName}`} className={classNames(styles.option)}>
                  <button
                    type='button'
                    className={categoryName.toLocaleLowerCase()}
                    onClick={handleSelectCategory}
                    name={categoryName}
                  >
                    <Circle
                      fill={CATEGORY_COLOR[categoryName]}
                      onClick={handleSelectCategory}
                      data-category={CATEGORY_COLOR[categoryName]}
                    />
                    <span className={styles.categorName}>{categoryName}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddTodo