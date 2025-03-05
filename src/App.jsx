import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [notePopupVisible, setNotePopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [notePopupPosition, setNotePopupPosition] = useState({ top: 0, left: 0 });
  const [deletePopupPosition, setDeletePopupPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [notedElement, setNotedElement] = useState(null);
  const textRef = useRef(null);
  const noteTextRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deletePopupVisible && !event.target.closest('.popup')) {
        setDeletePopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [deletePopupVisible]);

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      setPopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      setPopupVisible(true);
    } else {
      setPopupVisible(false);
    }
  };

  const handleHighlight = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const range = window.getSelection().getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.onclick = (e) => handleDeletePopup(e, span);
      range.surroundContents(span);
      setPopupVisible(false);
    }
  };

  const handleNote = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const range = window.getSelection().getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontWeight = 'bold';
      span.onclick = (e) => handleDeletePopup(e, span);
      range.surroundContents(span);

      const rect = range.getBoundingClientRect();
      setNotePopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      setNotePopupVisible(true);
      setPopupVisible(false);
      setSelectedText(selectedText);
    }
  };

  const handleDeletePopup = (e, element) => {
    e.stopPropagation();
    const rect = element.getBoundingClientRect();
    setDeletePopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
    setDeletePopupVisible(true);
    setHighlightedElement(element);
  };

  const deleteHighlightOrNote = () => {
    if (highlightedElement) {
      const parent = highlightedElement.parentNode;
      const textContent = highlightedElement.textContent;
      while (highlightedElement.firstChild) {
        parent.insertBefore(highlightedElement.firstChild, highlightedElement);
      }
      parent.removeChild(highlightedElement);
      setDeletePopupVisible(false);
      setHighlightedElement(null);

      // Remove the corresponding note
      setNotes((prevNotes) => {
        const noteLines = prevNotes.split('\n');
        const updatedNotes = noteLines.filter(note => !note.startsWith(textContent)).join('\n');
        return updatedNotes;
      });
    }
  };

  const saveNote = () => {
    const noteText = noteTextRef.current.value;
    if (noteText) {
      const newNote = `${selectedText}: ${noteText}\n`;
      setNotes((prevNotes) => prevNotes + newNote);

      setNotePopupVisible(false);
      noteTextRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4" onMouseUp={handleMouseUp}>
      <h1 className="text-2xl font-bold mb-4">IELTS Test Interface</h1>
      <div className="flex">
        <div className="w-1/4 pr-4">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <textarea
            className="w-full p-2 border"
            rows="20"
            value={notes}
            readOnly
            placeholder="Your notes will appear here..."
          ></textarea>
        </div>
        <div className="w-3/4">
          <p ref={textRef} className="border p-4">
            This is a sample text for the IELTS reading section. You can highlight any part of this text by selecting it with your mouse.
          </p>
        </div>
      </div>
      {popupVisible && (
        <div
          className="popup bg-white border p-2"
          style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left }}
        >
          <button className="mr-2" onClick={handleHighlight}>Highlight</button>
          <button onClick={handleNote}>Note</button>
        </div>
      )}
      {notePopupVisible && (
        <div
          className="popup bg-white border p-2"
          style={{ position: 'absolute', top: notePopupPosition.top, left: notePopupPosition.left }}
        >
          <textarea ref={noteTextRef} className="w-full p-2 border" rows="3" placeholder="Write your note here..."></textarea>
          <button onClick={saveNote}>Save Note</button>
        </div>
      )}
      {deletePopupVisible && (
        <div
          className="popup bg-white border p-2"
          style={{ position: 'absolute', top: deletePopupPosition.top, left: deletePopupPosition.left }}
        >
          <button className="mr-2" onClick={deleteHighlightOrNote}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default App;
