import React, { useState } from 'react';
import './App.css';

const essayText = `
The Importance of Renewable Energy Sources

In recent years, the conversation surrounding energy production has shifted significantly. Renewable energy sources, such as solar, wind, and hydroelectric power, have gained prominence as viable alternatives to fossil fuels. This shift is crucial for several reasons.

Firstly, renewable energy is sustainable. Unlike fossil fuels, which are finite and will eventually deplete, renewable sources are abundant and can be replenished naturally. For instance, solar energy harnesses the sun's rays, which will continue to shine for billions of years. This sustainability ensures that future generations will have access to energy.

Secondly, the use of renewable energy significantly reduces greenhouse gas emissions. Traditional energy sources, like coal and oil, release large amounts of carbon dioxide and other harmful pollutants into the atmosphere. In contrast, renewable energy systems produce little to no emissions during operation. Transitioning to these cleaner energy sources is essential in combating climate change and protecting the environment.

Moreover, investing in renewable energy can lead to economic growth and job creation. The renewable energy sector has been one of the fastest-growing industries in recent years. Jobs in solar panel installation, wind turbine maintenance, and other related fields are on the rise. This growth not only helps to reduce unemployment but also stimulates local economies.

In conclusion, the transition to renewable energy sources is not just a trend; it is a necessity. By embracing these sustainable options, we can ensure a cleaner environment, a stable energy future, and economic prosperity. The time to act is now, and the benefits of renewable energy are clear.
`;

const App = () => {
  const [notes, setNotes] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isTextHighlighted, setIsTextHighlighted] = useState(false);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) {
      setSelectedText(text);
      setIsTextHighlighted(isTextCurrentlyHighlighted(text));
      setPopupVisible(true);
    } else {
      setPopupVisible(false);
    }
  };

  const isTextCurrentlyHighlighted = (text) => {
    const essayElement = document.getElementById('essay');
    const highlightedElements = essayElement.getElementsByClassName('highlight');
    for (let i = 0; i < highlightedElements.length; i++) {
      if (highlightedElements[i].innerText === text) {
        return true;
      }
    }
    return false;
  };

  const handleHighlight = () => {
    highlightText(selectedText, 'yellow');
    setPopupVisible(false);
  };

  const handleTakeNote = () => {
    const newNotes = [...notes, { text: selectedText, note: noteText, highlighted: true }];
    setNotes(newNotes);
    highlightText(selectedText, 'yellow');
    setPopupVisible(false);
    setNoteText('');
  };

  const highlightText = (text, color) => {
    const essayElement = document.getElementById('essay');
    const innerHTML = essayElement.innerHTML;
    const highlightedText = innerHTML.replace(
      new RegExp(`(${text})`, 'g'),
      `<span class="highlight" style="background-color: ${color};">$1</span>`
    );
    essayElement.innerHTML = highlightedText;
  };

  const toggleHighlight = (index) => {
    const newNotes = [...notes];
    const note = newNotes[index];
    const currentColor = note.highlighted ? 'green' : 'yellow';
    highlightText(note.text, currentColor);
    note.highlighted = !note.highlighted;
    setNotes(newNotes);
  };

  const deleteFormatting = (text) => {
    const essayElement = document.getElementById('essay');
    const innerHTML = essayElement.innerHTML;
    const unhighlightedText = innerHTML.replace(
      new RegExp(`<span class="highlight" style="background-color: (yellow|green);">([^<]*)</span>`, 'g'),
      '$2'
    );
    essayElement.innerHTML = unhighlightedText;
    setNotes(notes.filter(note => note.text !== text));
  };

  const deleteHighlight = () => {
    deleteFormatting(selectedText);
    setPopupVisible(false);
  };

  return (
    <div className="App">
      <div className="essay" id="essay" onMouseUp={handleMouseUp}>
        {essayText.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="notes">
        <h2>Notes</h2>
        <ul>
          {notes.map((item, index) => (
            <li key={index} onClick={() => toggleHighlight(index)}>
              {item.note} 
              <button onClick={(e) => { e.stopPropagation(); deleteFormatting(item.text); }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {popupVisible && (
        <div className="popup">
          {isTextHighlighted ? (
            <button onClick={deleteHighlight}>Delete Highlight</button>
          ) : (
            <>
              <button onClick={handleHighlight}>Highlight</button>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
              />
              <button onClick={handleTakeNote}>Take Note</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;