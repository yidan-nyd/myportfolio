const dialog = document.querySelector('[data-dialog]');
const projects = [...dialog.querySelectorAll('[data-project]')];

document.querySelectorAll('[data-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const id = trigger.dataset.open;
    projects.forEach((project) => project.classList.toggle('is-active', project.dataset.project === id));
    dialog.showModal();
    dialog.scrollTop = 0;
  });
});

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
