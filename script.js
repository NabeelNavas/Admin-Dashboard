const searchInput = document.querySelector('#project-search');
const grid = document.querySelector('#project-grid');
const counter = document.querySelector('#project-count');
const emptyState = document.querySelector('#empty-state');
const toast = document.querySelector('#toast');
const dialog = document.querySelector('#project-dialog');
const projectForm = document.querySelector('#project-form');
const previewDialog = document.querySelector('#preview-dialog');
let toastTimer;

function notify(text) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 4500);
}

function filterProjects() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  for (const card of grid.querySelectorAll('.project-card')) {
    const matches = card.dataset.title.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  counter.textContent = visible;
  emptyState.hidden = visible !== 0;
}

searchInput.addEventListener('input', filterProjects);
document.querySelector('.search').addEventListener('submit', event => event.preventDefault());
document.addEventListener('keydown', event => {
  const isEditing = event.target.matches('input, textarea, [contenteditable="true"]');
  if (event.key === '/' && !isEditing && !dialog.open && !previewDialog.open) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelectorAll('[data-demo]').forEach(button => {
  button.addEventListener('click', () => {
    notify(`${button.dataset.demo} is a placeholder in this front-end demo.`);
  });
});

document.querySelector('#new-project').addEventListener('click', () => {
  dialog.showModal();
  document.querySelector('#project-name').focus();
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#close-preview').addEventListener('click', () => previewDialog.close());

projectForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = document.querySelector('#project-name').value.trim();
  const description = document.querySelector('#project-description').value.trim();
  if (!title || !description) {
    notify('Please enter a project name and description.');
    return;
  }

  // Reuse the card structure and insert user input as text, not HTML.
  const card = grid.querySelector('.project-card').cloneNode(true);
  card.hidden = false;
  card.dataset.title = title;
  card.querySelector('h3').textContent = title;
  card.querySelector(':scope > p').textContent = description;
  card.querySelector('.tag').textContent = 'PERSONAL';
  card.querySelector('.tag').className = 'tag tag-green';
  card.querySelector('.project-number').textContent = String(grid.children.length + 1).padStart(2, '0');
  const state = card.querySelector('.project-state');
  state.className = 'project-state planning';
  state.replaceChildren(document.createElement('i'), document.createTextNode(' Planning'));
  const favorite = card.querySelector('.favorite');
  favorite.setAttribute('aria-pressed', 'false');
  favorite.setAttribute('aria-label', `Favorite ${title}`);
  card.querySelector('.preview').setAttribute('aria-label', `Preview ${title}`);
  card.querySelector('.share').setAttribute('aria-label', `Share ${title}`);
  grid.prepend(card);
  searchInput.value = '';
  filterProjects();
  dialog.close();
  projectForm.reset();
  notify('Project added. This demo does not save projects after a reload.');
});

grid.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const card = button.closest('.project-card');
  const title = card.dataset.title;
  if (button.classList.contains('favorite')) {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    notify(`${title} ${selected ? 'added to' : 'removed from'} favorites for this session.`);
  }
  if (button.classList.contains('preview')) {
    document.querySelector('#preview-title').textContent = title;
    document.querySelector('#preview-description').textContent = card.querySelector(':scope > p').textContent;
    previewDialog.showModal();
  }
  if (button.classList.contains('share')) {
    notify('Sharing is a placeholder. These sample projects have no public links.');
  }
});
