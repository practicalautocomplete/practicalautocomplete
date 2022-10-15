/*!
* Start Bootstrap - Practical autocomplete v0.0.1 (https://practicalautocomplete.dev/locales/en)
* Copyright 2013-2022 Kewang
* Licensed under MIT (https://github.com/StartBootstrap/practical-autocomplete/blob/master/LICENSE)
*/
/* eslint-env browser */
//
// Scripts
//

window.addEventListener('DOMContentLoaded', () => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');

  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();

      document.body.classList.toggle('sb-sidenav-toggled');

      localStorage.setItem(
        'sb|sidebar-toggle',
        document.body.classList.contains('sb-sidenav-toggled')
      );
    });
  }
});