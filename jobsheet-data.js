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

   Leave an operative's array with fewer than 14 entries and the
   missing slots just show as "NOT UPLOADED" automatically.
   ============================================================ */

const JOBSHEET_DATA = {

  hairi: [
    { number: 1,  title: "Intro to Android Studio & Project Setup", description: "Installed Android Studio, configured the SDK and emulator, created a first Hello World activity.", status: "completed" },
    { number: 2,  title: "UI Layouts with XML (Linear & Constraint)", description: "Built and compared LinearLayout and ConstraintLayout screens.", status: "completed" },
    { number: 3,  title: "Activities, Intents & Navigation", description: "Connected multiple activities using explicit intents and passed data with extras.", status: "incomplete" },
    // add jobsheets 4 - 14 for Hairi here, same format:
    // { number: 4, title: "...", description: "...", status: "incomplete" },
  ],

  datu: [
    { number: 1,  title: "Event Handling & Input Validation", description: "Implemented click listeners, form validation and Toast feedback.", status: "completed" },
    { number: 2,  title: "Local Data Storage with SQLite", description: "Built a small notes app with full CRUD operations backed by SQLite.", status: "incomplete" },
    // add jobsheets 3 - 14 for Datu here, same format:
    // { number: 3, title: "...", description: "...", status: "incomplete" },
  ]

};
