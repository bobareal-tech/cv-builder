// ---------- CONFIG ----------

const PERSONAL_FIELDS = [
  {
    id: "name",
    label: "Naam",
    targets: ["nameDisplay", "nameTopDisplay"],
    multiline: false,
    hint: "Hier kan je naam komen te staan."
  },
  {
    id: "headline",
    label: "Functie / titel",
    targets: ["headlineDisplay"],
    multiline: false,
    hint: "Hier kan je functietitel komen te staan."
  },
  {
    id: "email",
    label: "E-mail",
    targets: ["emailDisplay"],
    multiline: false,
    hint: "Hier kan je e-mailadres komen te staan."
  },
  {
    id: "phone",
    label: "Telefoon",
    targets: ["phoneDisplay"],
    multiline: false,
    hint: "Hier kan je telefoonnummer komen te staan."
  },
  {
    id: "birth",
    label: "Geboortedatum",
    targets: ["birthDisplay"],
    multiline: false,
    hint: "Hier kan je geboortedatum komen te staan."
  },
  {
    id: "address",
    label: "Adres + postcode + plaats",
    targets: ["addressDisplay"],
    multiline: true,
    hint: "Hier kan je adres komen te staan."
  },
  {
    id: "license",
    label: "Rijbewijs",
    targets: ["licenseDisplay"],
    multiline: false,
    hint: "Hier kan je rijbewijs komen te staan.",
    optionalRowId: "licenseRow"
  },
  {
    id: "gender",
    label: "Geslacht",
    targets: ["genderDisplay"],
    multiline: false,
    hint: "Hier kan je geslacht komen te staan."
  }
];

let skillCounter = 0;
let langCounter = 0;
let hobbyCounter = 0;
let eduCounter = 0;
let jobCounter = 0;
let socialCounter = 0;

// ---------- HELPERS ----------

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

function bindTextInput(input, targets, multiline = false, defaultHint, optionalRowId) {
  const elements = targets.map(id => document.getElementById(id)).filter(Boolean);
  const optionalRow = optionalRowId ? document.getElementById(optionalRowId) : null;

  const update = () => {
    const raw = input.value;
    const value = raw.trim();
    if (!value) {
      if (optionalRow) optionalRow.style.display = "none";
      if (defaultHint) {
        elements.forEach(elm => {
          elm.textContent = defaultHint;
          elm.classList.add("hint-inline");
        });
      }
      return;
    }
    if (optionalRow) optionalRow.style.display = "";
    elements.forEach(elm => {
      elm.classList.remove("hint-inline");
      if (multiline) {
        elm.innerHTML = value.replace(/\n/g, "<br>");
      } else {
        elm.textContent = value;
      }
    });
  };

  input.addEventListener("input", update);
  update();
}

function bindBullets(textarea, listEl) {
  const update = () => {
    listEl.innerHTML = "";
    const lines = textarea.value
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    lines.forEach(line => {
      listEl.appendChild(el("li", null, line));
    });
  };
  textarea.addEventListener("input", update);
  update();
}

// titles in sidebar (vaardigheden, talen, hobby's, social)
function refreshSidebarSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const hr = container.previousElementSibling;
  const title = hr && hr.previousElementSibling;

  const hasVisibleChild = Array.from(container.children).some(
    child => child.style.display !== "none"
  );

  const display = hasVisibleChild ? "" : "none";
  if (title) title.style.display = display;
  if (hr) hr.style.display = display;
}

// titles in main (opleidingen, werkervaring)
function refreshMainSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const hr = container.previousElementSibling;
  const title = hr && hr.previousElementSibling;

  const hasVisibleChild = Array.from(container.children).some(
    child => child.style.display !== "none"
  );

  const display = hasVisibleChild ? "" : "none";
  if (title) title.style.display = display;
  if (hr) hr.style.display = display;
}

// ---------- EDITOR BUILD ----------

function buildEditor() {
  const root = document.getElementById("editorRoot");
  if (!root) return;

  const title = el("h2", null, "CV invullen");
  const help = el(
    "p",
    "help",
    "Vul hier je gegevens in. De CV rechts wordt direct bijgewerkt. Bij printen/PDF wordt deze editor niet meegedrukt."
  );
  root.appendChild(title);
  root.appendChild(help);

  // Profielfoto
  const photoSection = el("div", "editor-section");
  const photoHeader = el("div", "editor-section-header");
  photoHeader.appendChild(el("div", "editor-section-title", "Profielfoto"));
  photoSection.appendChild(photoHeader);
  const photoField = el("div", "form-field");
  const photoLabel = el("label");
  photoLabel.setAttribute("for", "photoInput");
  photoLabel.textContent = "Foto uploaden";
  const photoInput = el("input", "file-input");
  photoInput.type = "file";
  photoInput.id = "photoInput";
  photoInput.accept = "image/*";
  const photoHint = el(
    "div",
    "hint-text",
    "Hier kan je profielfoto geüpload worden om in de CV te komen te staan."
  );
  photoField.appendChild(photoLabel);
  photoField.appendChild(photoInput);
  photoField.appendChild(photoHint);
  photoSection.appendChild(photoField);
  root.appendChild(photoSection);

  // Personalia
  const personalSection = el("div", "editor-section");
  const pHeader = el("div", "editor-section-header");
  pHeader.appendChild(el("div", "editor-section-title", "Personalia & kop"));
  personalSection.appendChild(pHeader);

  const pGrid = el("div", "editor-grid");
  PERSONAL_FIELDS.forEach(cfg => {
    const ff = el("div", "form-field");
    const label = el("label");
    const inputId = cfg.id + "Input";
    label.setAttribute("for", inputId);
    label.textContent = cfg.label;
    const input = cfg.multiline ? el("textarea") : el("input");
    if (!cfg.multiline) input.type = "text";
    input.id = inputId;
    const hint = el("div", "hint-text", cfg.hint);
    ff.appendChild(label);
    ff.appendChild(input);
    ff.appendChild(hint);
    pGrid.appendChild(ff);

    bindTextInput(
      input,
      cfg.targets,
      cfg.multiline,
      cfg.hint,
      cfg.optionalRowId
    );
  });
  personalSection.appendChild(pGrid);
  root.appendChild(personalSection);

  // Social media
  const socialSection = el("div", "editor-section");
  const smHeader = el("div", "editor-section-header");
  smHeader.appendChild(el("div", "editor-section-title", "Social media"));
  const addSocialBtn = el("button", "btn-add", "+ social link");
  addSocialBtn.type = "button";
  smHeader.appendChild(addSocialBtn);
  socialSection.appendChild(smHeader);

  const smList = el("div", "editor-list");
  smList.id = "socialsEditorList";
  socialSection.appendChild(smList);
  socialSection.appendChild(
    el(
      "div",
      "hint-text",
      "Voeg links toe naar bijvoorbeeld LinkedIn, X, YouTube, Instagram, TikTok of GitHub."
    )
  );
  root.appendChild(socialSection);

  addSocialBtn.addEventListener("click", () => addSocialRow());

  // Profieltekst
  const profileSection = el("div", "editor-section");
  const prHeader = el("div", "editor-section-header");
  prHeader.appendChild(el("div", "editor-section-title", "Profieltekst"));
  profileSection.appendChild(prHeader);

  const prField = el("div", "form-field");
  const prLabel = el("label");
  prLabel.setAttribute("for", "profileInput");
  prLabel.textContent = "Korte beschrijving (ik-vorm)";
  const prTextarea = el("textarea");
  prTextarea.id = "profileInput";
  const prHint = el("div", "hint-text", "Hier kan je profieltekst komen te staan.");
  prField.appendChild(prLabel);
  prField.appendChild(prTextarea);
  prField.appendChild(prHint);
  profileSection.appendChild(prField);
  root.appendChild(profileSection);

  const profileDisplay = document.getElementById("profileDisplay");
  prTextarea.addEventListener("input", () => {
    const val = prTextarea.value.trim();
    if (!val) {
      profileDisplay.textContent = "Hier kan je profieltekst komen te staan.";
      profileDisplay.classList.add("hint-inline");
    } else {
      profileDisplay.textContent = val;
      profileDisplay.classList.remove("hint-inline");
    }
  });

  // Vaardigheden
  const skillSection = el("div", "editor-section");
  const sHeader = el("div", "editor-section-header");
  sHeader.appendChild(el("div", "editor-section-title", "Vaardigheden"));
  const addSkillBtn = el("button", "btn-add", "+ vaardigheid");
  addSkillBtn.type = "button";
  sHeader.appendChild(addSkillBtn);
  skillSection.appendChild(sHeader);
  const skillListEditor = el("div", "editor-list");
  skillListEditor.id = "skillsEditorList";
  skillSection.appendChild(skillListEditor);
  skillSection.appendChild(
    el(
      "div",
      "hint-text",
      "Hier kunnen je vaardigheden komen te staan. Niveau 0 = leeg, 5 = alle bolletjes vol."
    )
  );
  root.appendChild(skillSection);
  addSkillBtn.addEventListener("click", () => addSkillRow());

  // Talen
  const langSection = el("div", "editor-section");
  const lHeader = el("div", "editor-section-header");
  lHeader.appendChild(el("div", "editor-section-title", "Talen"));
  const addLangBtn = el("button", "btn-add", "+ taal");
  addLangBtn.type = "button";
  lHeader.appendChild(addLangBtn);
  langSection.appendChild(lHeader);
  const langListEditor = el("div", "editor-list");
  langListEditor.id = "langsEditorList";
  langSection.appendChild(langListEditor);
  langSection.appendChild(el("div", "hint-text", "Hier kunnen je talen komen te staan."));
  root.appendChild(langSection);
  addLangBtn.addEventListener("click", () => addLanguageRow());

  // Hobby's
  const hobbySection = el("div", "editor-section");
  const hHeader = el("div", "editor-section-header");
  hHeader.appendChild(el("div", "editor-section-title", "Hobby's & interesses"));
  const addHobbyBtn = el("button", "btn-add", "+ hobby");
  addHobbyBtn.type = "button";
  hHeader.appendChild(addHobbyBtn);
  hobbySection.appendChild(hHeader);
  const hobbyListEditor = el("div", "editor-list");
  hobbyListEditor.id = "hobbiesEditorList";
  hobbySection.appendChild(hobbyListEditor);
  hobbySection.appendChild(
    el("div", "hint-text", "Hier kunnen je hobby's of interesses komen te staan.")
  );
  root.appendChild(hobbySection);
  addHobbyBtn.addEventListener("click", () => addHobbyRow());

  // Opleidingen
  const eduSection = el("div", "editor-section");
  const eHeader = el("div", "editor-section-header");
  eHeader.appendChild(el("div", "editor-section-title", "Opleidingen"));
  const addEduBtn = el("button", "btn-add", "+ opleiding");
  addEduBtn.type = "button";
  eHeader.appendChild(addEduBtn);
  eduSection.appendChild(eHeader);
  const eduListEditor = el("div", "editor-list");
  eduListEditor.id = "eduEditorList";
  eduSection.appendChild(eduListEditor);
  eduSection.appendChild(
    el("div", "hint-text", "Hier kunnen je opleidingen komen te staan.")
  );
  root.appendChild(eduSection);
  addEduBtn.addEventListener("click", () => addEducationBlock());

  // Werkervaring
  const jobSection = el("div", "editor-section");
  const jHeader = el("div", "editor-section-header");
  jHeader.appendChild(el("div", "editor-section-title", "Werkervaring"));
  const addJobBtn = el("button", "btn-add", "+ werkervaring");
  addJobBtn.type = "button";
  jHeader.appendChild(addJobBtn);
  jobSection.appendChild(jHeader);
  const jobListEditor = el("div", "editor-list");
  jobListEditor.id = "jobEditorList";
  jobSection.appendChild(jobListEditor);
  jobSection.appendChild(
    el("div", "hint-text", "Hier kan je werkervaring komen te staan.")
  );
  root.appendChild(jobSection);
  addJobBtn.addEventListener("click", () => addJobBlock());

  // Foto upload
  const img = document.getElementById("photoDisplay");
  const ph = document.getElementById("photoPlaceholder");
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      img.style.display = "block";
      if (ph) ph.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
}

// ---------- VAARDIGHEDEN, TALEN, HOBBY'S, OPLEIDINGEN, WERKERVARING, SOCIAL ----------
// (zelfde code als eerder, maar ik laat hem hier weg om dit bericht niet nóg langer te maken)
// 👉 Gebruik gewoon de versie die ik je in het vorige lange script heb gestuurd – die werkt.
// Belangrijk is: onderaan moeten de INIT + EXPORT handlers staan zoals hieronder:

// ---------- INIT + EXPORT ----------

document.addEventListener("DOMContentLoaded", () => {
  buildEditor();

  // optionele secties bij start verbergen
  refreshSidebarSection("skillsList");
  refreshSidebarSection("languagesContainer");
  refreshSidebarSection("hobbyList");
  refreshSidebarSection("socialList");
  refreshMainSection("eduContainer");
  refreshMainSection("expContainer");

  const cvNode = document.getElementById("cvPage");
  const btnImg = document.getElementById("btnImg");
  const btnPdf = document.getElementById("btnPdf");

  function ensureImageLibs() {
    if (!window.html2canvas) {
      alert("Afbeelding maken lukt niet: html2canvas kon niet geladen worden.");
      return false;
    }
    return true;
  }

  function ensurePdfLibs() {
    if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
      alert("PDF maken lukt niet: html2canvas of jsPDF kon niet geladen worden.");
      return false;
    }
    return true;
  }

  // Download als afbeelding (PNG)
  btnImg.addEventListener("click", () => {
    if (!ensureImageLibs()) return;
    html2canvas(cvNode, { scale: 2, useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.download = "cv-afbeelding.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(err => {
      console.error(err);
      alert("Er ging iets mis bij het maken van de afbeelding.");
    });
  });

  // Download als PDF
  btnPdf.addEventListener("click", () => {
    if (!ensurePdfLibs()) return;
    const { jsPDF } = window.jspdf;
    html2canvas(cvNode, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = Math.max(0, (pageHeight - imgHeight) / 2);
      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
      pdf.save("cv.pdf");
    }).catch(err => {
      console.error(err);
      alert("Er ging iets mis bij het maken van de PDF.");
    });
  });
});
