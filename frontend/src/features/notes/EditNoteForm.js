import React from "react";
import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditNoteForm = ({ users, note }) => {
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    {
      isLoading: isLoadingDel,
      isSuccess: isSuccessDel,
      isError: isErrorDel,
      error: errorDel,
    },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [isValidTitle, setIsValidTitle] = useState(false);
  const [isValidText, setIsValidText] = useState(false);
  const [completed, setCompleted] = useState(note.completed);
  const [selectedUser, setSelectedUser] = useState(note.user);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted(!completed);
  const onSelectedUserChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log(values);
    setSelectedUser(values[0]);
  };

  useEffect(() => {
    setIsValidTitle((prev) => title !== "" || title !== " ");
  }, [title]);
  useEffect(() => {
    setIsValidText((prev) => text !== "" || text !== " ");
  }, [text]);

  useEffect(() => {
    if (isSuccess || isSuccessDel) {
      console.log("success updating");
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isSuccessDel, navigate]);

  const canSave =
    title !== "" && text !== "" && selectedUser.length && !isLoading;

  const onSaveNotesClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await updateNote({
        userId: selectedUser,
        id: note.id,
        title,
        text,
        completed,
      });
    }
  };
  const onDeleteNoteClicked = async (e) => {
    e.preventDefault();
    await deleteNote(note.id);
  };

  const options = Object.values(users).map((user) => {
    return (
      <option key={user._id} value={user._id}>
        {user.username}
      </option>
    );
  });
  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !isValidTitle ? "form__input--incomplete" : "";
  const validTextClass = !isValidText ? "form__input--incomplete" : "";
  const validSelectedUserClass = !Boolean(selectedUser.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNotesClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteNoteClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          TITLE: <span className="nowrap">required</span>
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          required={true}
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          TEXT: <span className="nowrap">required</span>
        </label>
        <textarea
          className={`form__input ${validTextClass}`}
          id="text"
          name="text"
          required={true}
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="note-completed"
        >
          COMPLETED:
          <input
            className="form__checkbox"
            id="note-completed"
            name="note-completed"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          SELECT USER:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validSelectedUserClass}`}
          multiple={false}
          size="3"
          value={selectedUser}
          onChange={onSelectedUserChanged}
        >
          {options}
        </select>
        <div className="form__label" htmlFor="created_at">
          created_at: <span className="nowrap">{note.createdAt}</span>
        </div>
        <div className="form__label" htmlFor="updated_at">
          updated_at: <span className="nowrap">{note.updatedAt}</span>
        </div>
      </form>
    </>
  );
  return content;
};

export default EditNoteForm;
