/* ============================================================
   GHOSTBYTE // jobsheet-data.js
   ------------------------------------------------------------
   EDIT THIS FILE to add or update jobsheets. No database, no
   setup — just type your info in and re-upload this file to
   GitHub.

   Each entry needs:
     number      : 1 to 14 (must be unique per operative)
     title       : short task title
     description : what the jobsheet covers
     status      : 'completed'  -> shows GREEN, 100%
                   'incomplete' -> shows RED, 0%
     file        : (optional) path to the submission PDF, e.g.
                   "jobsheets/hairi-01-my-favourite-music.pdf"
                   Adds a "VIEW PDF" link inside the expanded card.
     link        : (optional) path/URL to the LIVE HTML page for this
                   jobsheet, e.g. "jobsheets/hairi-01-my-favourite-music.html"
                   or a full URL if it's hosted elsewhere. Adds a
                   "VIEW LIVE" link that opens the real working page in a
                   new tab — so your lecturer can check the actual build,
                   not just a PDF screenshot of it.

   Leave an operative's array with fewer than 14 entries and the
   missing slots just show as "NOT UPLOADED" automatically.
   ============================================================ */

const JOBSHEET_DATA = {

  hairi: [
    { number: 1,  title: "My Favourite Music (HTML5 Lab, Set 8)", description: "Built an HTML5 page on a favourite-music theme covering headings, paragraphs, genre lists, an ordered listening-routine, embedded images, and hyperlinks. Validated 17/17 (100%).", status: "completed", file: "jobsheets/hairi-01-my-favourite-music.pdf", link: "jobsheets/hairi-01-my-favourite-music.html" },
    // add jobsheets 2 - 14 for Hairi here, same format:
    // { number: 2, title: "...", description: "...", status: "incomplete", file: "jobsheets/hairi-02-....pdf", link: "jobsheets/hairi-02-....html" },
  ],

  datu: [
    // add jobsheets 1 - 14 for Datu here, same format:
    // { number: 1, title: "...", description: "...", status: "incomplete", file: "jobsheets/datu-01-....pdf", link: "jobsheets/datu-01-....html" },
  ]

};
