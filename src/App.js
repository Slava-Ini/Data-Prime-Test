/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import styles from './App.module.css';
import Rectangle from './svg/rectangle.svg';
import Arrow from './svg/arrow.svg';


function App() {

	const [isTaskFocused, setIsTaskFocused] = useState(false);
	const [isCommentary, setIsCommentary] = useState(false);

	const textRef = useRef(null);

	// Фокус на инпуте при открытии панели
	useEffect(() => {
		if (isTaskFocused) textRef.current.focus();
	}, [isTaskFocused]);

	// Отображение открытой панели 
	const focusTask = (e) => {
		setIsTaskFocused(true);
	};

	// Скрытие панели при клике на фон
	const blurTask = (e) => {
		if (event.target.id === 'app') {
			setIsTaskFocused(false);
		}
	};

	// Создание комментария при вводе двух слэшей
	const handleTextInput = (e) => {

		const lastTwoSymbols = e.target.textContent.slice(-2);

		if (lastTwoSymbols === '//' && !isCommentary) {
			let startIndex = e.target.textContent.length - 2;
			let selection = window.getSelection();
			let range = document.createRange();
			// Создание области
			range.setStart(textRef.current.firstChild, startIndex);
			range.setEndAfter(textRef.current.firstChild);
			// Выделение созданной области
			selection.removeAllRanges();
			selection.addRange(range);
			// Изменение цвета для комментария с заменой тега
			// <font> на <span>
			document.execCommand('styleWithCSS', false, true);
			document.execCommand('foreColor', false, '#c98313');
			document.execCommand('styleWithCSS', false, false);
			// Создание области на конец текста если комментарий 
			// на пустой строке, то область в конце единственного нода
			// иначе в конце второго
			if (e.target.textContent === '//') {
				range.setStartAfter(textRef.current.firstChild);
				range.setEndAfter(textRef.current.firstChild);
			} else {
				range.setStart(textRef.current, 2);
				range.setEnd(textRef.current, 2);
			}
			// Перенос курсора на область в конце текста
			selection.removeAllRanges();
			selection.addRange(range);
			// Добавление плейсхолдера для комментария
			document.execCommand('insertHTML', false, '<span placeholder=" write note" id="commentary-placeholder"><span>');
			// Избежание ошибки при многократном вводе слэшей
			setIsCommentary(true);
		} else if (lastTwoSymbols !== '//' && isCommentary) {
			// Удаление плейсхолдера при вводе текста
			const placeholder = document.getElementById('commentary-placeholder');
			if (placeholder) placeholder.remove();
		} else if (lastTwoSymbols == '//' && isCommentary) {
			// Возвращение плейсхолдера при отсутсвии текста после слэшей
			const placeholder = document.getElementById('commentary-placeholder');
			if (!placeholder) {
				document.execCommand('insertHTML', false, '<span placeholder=" write note" id="commentary-placeholder"><span>');
			}
		}

		// Переключение флага присутствия комментария
		if (!e.target.textContent.match(/.*\/{2}.*/) && isCommentary) {
			setIsCommentary(false);
		}
	};

	// Возвращение прежнего цвета текста после удаления комментария
	const handleBeforeInput = (e) => {
		if (!e.target.textContent.match(/.*\/{2}.*/) && !isCommentary) {
			const spans = document.querySelectorAll('span');
			for (let span of spans) {
				span.remove();
			}
		}
	};

	return (
		<div className={styles.app} onClick={blurTask} id='app'>
			{
				isTaskFocused ?
					(
						<div className={`${styles.task} ${styles.task_focused}`}>
							<div className={styles.popper_container}>
								<div className={styles.popper_rectangle}></div>
							</div>
							<div
								className={styles.input_text}
								placeholder='Write a new task'
								contentEditable={true}
								onKeyUp={handleTextInput}
								onKeyDown={handleBeforeInput}
								ref={textRef}
							>
							</div>
							<button className={styles.calendar}></button>
							<button className={styles.list}>
								<img
									className={styles.list_rectangle}
									src={Rectangle}
									alt='rectangle'
								/>
								<div className={styles.list_text}>No list</div>
								<img
									className={styles.list_arrow}
									src={Arrow}
									alt='arrow'
								/>
							</button>
						</div>
					) :
					(
						<div
							className={`${styles.task} ${styles.task_unfocused}`}
							onClick={focusTask}
						>
							<label>Write a new task</label>
						</div>
					)
			}
		</div>

	);
}

export default App;


