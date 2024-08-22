import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState(() => localStorage.getItem('inputText') || '');
  const [highlightWord, setHighlightWord] = useState('');
  const [userWord, setUserWord] = useState('');
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(10);
  const [inputBorderColor, setInputBorderColor] = useState('border-black');
  const [noteTitle, setNoteTitle] = useState('');
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false); // To track if we are editing an existing note
  const [noteToEdit, setNoteToEdit] = useState(null); // The note currently being edited
  const [activeNote, setActiveNote] = useState(null); // To track the currently active note

  // Function to select a random word
  const selectRandomWord = () => {
    const words = inputText.split(' ').filter(word =>
      word.trim().length >= minLength && word.trim().length <= maxLength
    );
    if (words.length > 0) {
      setHighlightWord(words[Math.floor(Math.random() * words.length)]);
    } else {
      setHighlightWord('');
    }
  };

  useEffect(() => {
    selectRandomWord();
  }, [inputText, minLength, maxLength]);

  // Handle input changes
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
    localStorage.setItem('inputText', newText);
  };

  const handleUserWordChange = (e) => {
    setUserWord(e.target.value);
  };

  const handleMinLengthChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= maxLength) {
      setMinLength(value);
    }
  };

  const handleMaxLengthChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minLength) {
      setMaxLength(value);
    }
  };

  // Reset function
  const reset = () => {
    selectRandomWord();
    setUserWord('');
    setInputBorderColor('border-green-500');
  };

  useEffect(() => {
    if (userWord === highlightWord) {
      setUserWord('');
      setInputBorderColor('border-green-500');
      selectRandomWord();
    } else {
      setInputBorderColor('border-green-500');
    }
  }, [userWord, highlightWord]);

  // Handle note title change
  const handleNoteTitleChange = (e) => {
    setNoteTitle(e.target.value);
  };

  // Save or update note
  const saveOrUpdateNote = () => {
    if (!noteTitle || !inputText) {
      setError('Please provide a title and text for the note.');
      return;
    }

    // Check if note title already exists
    const noteIndex = notes.findIndex(note => note.title === noteTitle);
    if (noteIndex !== -1) {
      if (editMode) {
        // Update existing note
        const updatedNotes = notes.map((note, index) =>
          index === noteIndex ? { title: noteTitle, text: inputText } : note
        );
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        setEditMode(false);
        setNoteToEdit(null);
      } else {
        setError('A note with this title already exists.');
        return;
      }
    } else {
      // Add new note
      const updatedNotes = [...notes, { title: noteTitle, text: inputText }];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }

    setNoteTitle('');
    setInputText('');
    setError(''); // Clear error
  };

  // Load note
  const loadNote = (title) => {
    if (activeNote === title) {
      // Deselect note if it's already active
      setActiveNote(null);
      setInputText('');
      setNoteTitle('');
      setEditMode(false);
      setNoteToEdit(null);
    } else {
      // Select and load the new note
      const note = notes.find(note => note.title === title);
      if (note) {
        setInputText(note.text);
        setNoteTitle(title);
        setEditMode(true);
        setNoteToEdit(title);
        setActiveNote(title);
      }
    }
  };

  // Delete note
  const deleteNote = (title) => {
    const updatedNotes = notes.filter(note => note.title !== title);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (noteToEdit === title) {
      setInputText('');
      setNoteTitle('');
      setEditMode(false);
      setNoteToEdit(null);
    }
  };

  // Function to format text with highlighted word
  const formatText = (text) => {
    return text.split(' ').map((word, index) => (
      word === highlightWord
        ? `<span class="underline text-green-400">${word}</span>`
        : `<span class="text-black">${word}</span>`
    )).join(' ');
  };

  return (
    <div className="App p-4">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        className={`border rounded p-2 m-2 w-full text-center ${inputBorderColor} sm:text-sm md:text-md lg:text-lg xl:text-xl`}
        placeholder="Please enter your text here..."
        style={{ minHeight: '150px', resize: 'both' }} // Allow resize and set minimum height
      />
      <div
        className="border-2 border-green-500 rounded p-2 m-2 w-full sm:text-sm md:text-md lg:text-lg xl:text-xl"
        dangerouslySetInnerHTML={{ __html: formatText(inputText) }}
        style={{ minHeight: '150px', overflow: 'auto' }} // Ensure content is scrollable if it overflows
      />
      <div className='w-full flex mx-auto'>
        <input
          type="text"
          value={userWord}
          onChange={handleUserWordChange}
          className={`border rounded p-2 m-2
            sm:w-64 sm:h-4 sm:text-smc 
            md:w-96 md:h-6 md:text-mdc text-blue-800 md:py-2
            lg:w-128 lg:h-8 lg:text-lg 
            xl:w-2/5 xl:h-10 xl:text-xl 
            ${inputBorderColor}`}
          
          placeholder="Write the word with underline here..."
        />
        <button
          className=' h-12 m-auto text-center justify-center text-2xl text-violet-600 font-bold bg-slate-100 rounded-2xl hover:bg-green-400 duration-500 transition-all hover:text-blue-600
          sm:text-sm sm:w-32 sm:h-6
          md:text-md md:w-40 md:h-7
          lg:text-lg lg:w-48 lg:h-8
          xl:text-xl xl:w-1/5 xl:h-10
          
          '
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <div className="w-full flex justify-between mt-4 align-middle items-center">
        <input
          type="number"
          value={minLength}
          onChange={handleMinLengthChange}
          className="border rounded p-2 text-center
           sm:text-mdc sm:w-16 sm:h-5
              md:text-md md:w-24 md:h-6
             lg:text-lg lg:2-32 lg:h-8
              xl:text-xl xl:w-48 xl:h-10
          "
          placeholder="Min length"
        />
        <h1 className='w-2/5 text-center m-auto  font-bold sm:text-md md:text-lg lg:text-xl xl:text-xl'>
          Select the letter number minim and maxim for your word
        </h1>
        <input
          type="number"
          value={maxLength}
          onChange={handleMaxLengthChange}
          className="border rounded p-2  text-center
           sm:text-mdc sm:w-16 sm:h-5
              md:text-md md:w-24 md:h-6
             lg:text-lg lg:2-32 lg:h-8
              xl:text-xl xl:w-48 xl:h-10
          "
          placeholder="Max length"
        />
      </div>

      <div className='mt-6'>
        <input
          type="text"
          value={noteTitle}
          onChange={handleNoteTitleChange}
          className="border rounded p-2 m-2 w-2/5 
          sm:text-sdc sm:w-48 sm:h-7
          md:text-mdc md:w-64 md:h-9
          lg:text-lg lg:2-96 lg:h-10
          xl:text-xl xl:w-2/5 xl:h-12
          "
          placeholder="Note title"
        />
        <button
          className='duration-700  w-1/6 h-12 m-auto text-center justify-center text-2xl text-violet-600 font-bold bg-slate-100 rounded-2xl hover:bg-green-400  transition hover:text-blue-600
          sm:text-smc sm:w-32 sm:h-7
          md:text-mdc md:w-40 md:h-9
          lg:text-lg lg:2-48 lg:h-10
          xl:text-2xl xl:w-64 xl:h-12
          '
          onClick={saveOrUpdateNote}
        >
          {editMode ? 'Update Note' : 'Save Note'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>

      <div className='mt-6'>
        <h2 className='text-2xl font-bold mb-2 text-white sm:text-md mg:text-lg lg:text-xl xl:text-2xl'>Saved Notes</h2>
        <ul className='list-disc pl-5'>
          {notes.map((note, index) => (
            <li key={index} className='flex justify-center items-center cursor-pointer'>
              <span
                onClick={() => loadNote(note.title)}
                className={`sm:text-sm md:text-md lg:text-lg xl:text-xl w-2/5 font-bold transition-all duration-500 ${activeNote === note.title ? 'text-white' : 'text-yellow-400'} hover:text-slate-300`}
              >
                {note.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the loadNote function
                  deleteNote(note.title);
                }}
                className='text-xl font-bold text-red-500 duration-500 hover:text-red-700 sm:text-sm mg:text-md lg:text-lg xl:text-xl'
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
