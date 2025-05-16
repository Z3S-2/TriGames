document.addEventListener('DOMContentLoaded', () => {
  const voteButtons = document.querySelectorAll('.vote-button');

  voteButtons.forEach(button => {
    const voteId = button.dataset.id;
    const delayHours = parseInt(button.dataset.delay, 10);
    const lastClickElement = document.getElementById(`last-${voteId}`);
    const lastClick = localStorage.getItem(voteId);

    if (lastClick) {
      const date = new Date(parseInt(lastClick, 10));
      lastClickElement.textContent = "Dernier vote : " + date.toLocaleString();
    } else {
      lastClickElement.textContent = "Aucun vote enregistré.";
    }

    button.addEventListener('click', () => {
      const now = Date.now();
      localStorage.setItem(voteId, now);
      const newDate = new Date(now);
      lastClickElement.textContent = "Dernier vote : " + newDate.toLocaleString();
    });
  });
});
