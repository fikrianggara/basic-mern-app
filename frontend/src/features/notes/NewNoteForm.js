import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { json, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isValidTitle, setIsValidTitle] = useState(false);
  const [isValidText, setIsValidText] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onSelectedUserChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log(values);
    setSelectedUser(values);
  };
  useEffect(() => {
    setIsValidTitle((prev) => title !== "" || title !== " ");
  }, [title]);
  useEffect(() => {
    setIsValidText((prev) => text !== "" || text !== " ");
  }, [text]);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);
  const canSave =
    title !== "" && text !== "" && selectedUser.length && !isLoading;
  const onSaveNotesClicked = (e) => {
    e.preventDefault();
    if (canSave) {
      addNewNote({ userId: selectedUser, title, text });
    }
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
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title: <span className="nowrap">required</span>
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
          text: <span className="nowrap">required</span>
        </label>
        <input
          className={`form__input ${validTextClass}`}
          id="text"
          name="text"
          type="text"
          required={true}
          value={text}
          onChange={onTextChanged}
        />

        <label className="form__label" htmlFor="roles">
          select user:
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
      </form>
    </>
  );
  return content;
};

export default NewNoteForm;
