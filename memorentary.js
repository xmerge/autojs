// Import the UI and storage modules
var UI = require('ui');
var storage = require('storage');

// Define the main function
function main() {
    // Load the saved notes from storage
    var notes = storage.get('notes', []);

    // Create the main UI
    var mainUI = new UI.Layout({
        title: 'Note-taking App',
        layout: [
            {
                component: UI.List,
                items: notes.map(function(note) { return { title: note } })
            },
            {
                component: UI.Button,
                text: 'Add Note',
                onClick: function() {
                    addNote();
                }
            }
        ]
    });

    // Show the main UI
    mainUI.show();
}

// Define the addNote function
function addNote() {
    // Show the add note UI
    var addNoteUI = new UI.Prompt({
        title: 'Add Note',
        
        message: 'Enter the note:',
        defaultValue: '',
        onSubmit: function(text) {
            // Add the new note to the notes array
            notes.push(text);

            // Save the updated notes array to storage
            storage.put('notes', notes);

            // Update the main UI
            mainUI.update({
                items: notes.map(function(note) { return { title: note } })
            });
        }
    });

    // Show the add note UI
    addNoteUI.show();
}

// Call the main function
main();
