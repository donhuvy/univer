export function setupAboutDialog(): void {
  const btnAbout = document.getElementById('btn-about');
  const modalAbout = document.getElementById('modal-about');
  const btnClose = document.getElementById('btn-close-about');
  const btnConfirm = document.getElementById('btn-confirm-about');

  const show = () => modalAbout?.classList.remove('hidden');
  const hide = () => modalAbout?.classList.add('hidden');

  btnAbout?.addEventListener('click', show);
  btnClose?.addEventListener('click', hide);
  btnConfirm?.addEventListener('click', hide);
}
