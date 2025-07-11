document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const noteContainer = document.querySelector('.note-container');
    const emptyNotes = document.querySelector('.empty-notes-content');

    const titleInput = document.querySelector('#dialogInput');
    const contentInput = document.querySelector('#dialogContent');
    const applyBtn = document.querySelector('.dialog-apply');

    // Show modal + overlay
    window.openNoteDialog = () => {
        modal.showModal();
        overlay.style.display = 'block';
        titleInput.focus();
    };

    // Close modal + overlay
    window.closeNoteDialog = () => {
        modal.close();
        overlay.style.display = 'none';
        titleInput.value = '';
        contentInput.value = '';
    };

    overlay.addEventListener('click', window.closeNoteDialog);

    // Close modal on Escape key press
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeNoteDialog();
        }
    });

    // Toggle empty notes message
    function updateEmptyState() {
        emptyNotes.style.display = noteContainer.children.length === 0 ? 'flex' : 'none';
    }
    updateEmptyState();

    // Create a new note card element
    function createNoteCard(title, content) {
        const card = document.createElement('div');
        card.className = 'note-card';

        card.innerHTML = `
      <div class="note-property-row">
        <h4 class="note-title">${title}</h4>
        <div class="note-btns">
          <button class="note-btn edit-note" aria-label="Edit note">🖋️</button>
          <button class="note-btn delete-note" aria-label="Delete note">✖️</button>
        </div>
      </div>
      <p class="note-content">${content}</p>
    `;

        // Delete note on click
        card.querySelector('.delete-note').addEventListener('click', () => {
            card.remove();
            updateEmptyState();
        });

        // TODO: Add edit functionality here if needed

        return card;
    }

    // Add note on apply button click
    applyBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            alert('Please enter a title or content');
            return;
        }

        const newNote = createNoteCard(title || 'Untitled', content || 'No content');
        noteContainer.appendChild(newNote);

        window.closeNoteDialog();
        updateEmptyState();
    });
});
