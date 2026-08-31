// ============================================================
// GHOSTBYTE — Jobsheet Data File
// ============================================================
// This is the ONLY file you need to edit to add/update jobsheets.
//
// Each operative has an array of jobsheet entries.
// Fields explained:
//   number      : (required) Jobsheet number 1-14
//   title       : (required) Short title of the jobsheet
//   description : (required) What this jobsheet covers
//   status      : (required) "completed" or "incomplete"
//   file        : (optional) Path to PDF file, e.g. "jobsheets/hairi-01.pdf"
//   link        : (optional) Path to live HTML demo, e.g. "jobsheets/hairi-01.html"
//
// Missing numbers 1-14 automatically render as "NOT UPLOADED".
// You don't need to create placeholder entries for missing jobsheets.
// ============================================================

const JOBSHEET_DATA = {
  hairi: [
    {
      number: 1,
      title: "My Favourite Music (HTML5 Lab, Set 8)",
      description: "Built an HTML5 page on a favourite-music theme covering headings, paragraphs, genre lists, an ordered listening-routine, embedded images, and hyperlinks. Validated 17/17 (100%).",
      status: "completed",
      file: "jobsheets/hairi-01-my-favourite-music.pdf",
      link: "jobsheets/hairi-01-my-favourite-music.html"
    },
    {
      number: 2,
      title: "Audio Equipment (HTML5 Lab, Set 8)",
      description: "Built an HTML5 table-based page comparing Sony and JBL audio equipment, covering embedded video, links, and specification/information columns. Validated 14/14 (100%).",
      status: "completed",
      file: "jobsheets/hairi-02-audio-equipment.pdf",
      link: "jobsheets/hairi-02-audio-equipment.html"
    },
    {
      number: 3,
      title: "Technology News Web Page (HTML5 Lab, Set 8)",
      description: "Built an HTML5 technology news page with navigation menu, article listings, and embedded images covering the latest tech news. Validated 22/22 (100%).",
      status: "completed",
      file: "jobsheets/hairi-03-technology-news.pdf",
      link: "jobsheets/hairi-03-technology-news.html"
    },
                    {
      number: 4,
      title: "Guernica (CSS3 Lab, Set 8)",
      description: "Applied external CSS styling to structure and format an HTML page featuring Pablo Picasso's Guernica artwork. Configured page layout, custom typography, image alignment, product detail tables, button styling, and sidebar layout for similar items. Validated 22/22 (100%).",
      status: "completed",
      file: "jobsheets/hairi-04-guernica-css3-lab-set-8.pdf",
      link: "jobsheets/hairi-04-guernica-css3-lab-set-8.html"
    },
    {
      number: 5,
      title: "css set 8 tryyy je",
      description: "tengok kalau boleh",
      status: "completed",
      file: "jobsheets/hairi-05-css-set-8-tryyy-je.pdf",
      link: "jobsheets/hairi-05-css-set-8-tryyy-je.html"
    },
    
  ],

  datu: [
    // add jobsheets 1 - 14 for Datu here, same format:
    // { number: 1, title: "...", description: "...", status: "incomplete", file: "jobsheets/datu-01-....pdf", link: "jobsheets/datu-01-....html" },
  ]
};
