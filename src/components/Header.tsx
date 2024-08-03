import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, addTodo } from '../api/todos';
import { Error } from '../types/EnumError';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  showError: (error: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  tempTodo: Todo | null;
  onChange: (todo: Todo) => void;
  activeTodosIds: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  showError,
  setTempTodo,
  tempTodo,
  onChange,
  activeTodosIds,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const allAreCompleted = todos.every(todo => todo.completed);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, [todos, showError]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      showError(Error.emptyTitle);

      return;
    }

    setTempTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
      id: 0,
    });

    addTodo({ title: newTitle.trim(), completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        showError(Error.add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            todos.forEach(todo => {
              if (activeTodosIds.length) {
                if (activeTodosIds.includes(todo.id)) {
                  const updatedTodo = Object.assign({}, todo);

                  updatedTodo.completed = !todo.completed;

                  return onChange(updatedTodo);
                }
              } else {
                const updatedTodo = Object.assign({}, todo);

                updatedTodo.completed = !todo.completed;

                return onChange(updatedTodo);
              }
            });
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={field}
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
