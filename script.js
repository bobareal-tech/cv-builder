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
    optionalRowId: "licenseRow" // rijbewijs-rijtje verbergen als leeg
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
      const li = el("li", null, line);
      listEl.appendChild(li);
    });
  };
  textarea.addEventListener("input", update);
  update();
}

// sectie-titels in sidebar (Vaardigheden, Talen, Hobby's, Social)
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

// sectie-titels in main (Opleidingen, Werkervaring)
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

  // PROFIElFOTO
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

  // PERSONALIA
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

  // SOCIAL MEDIA
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

  const smHint = el(
    "div",
    "hint-text",
    "Voeg links naar je profielen toe, bijvoorbeeld LinkedIn, X, YouTube, Instagram, TikTok of GitHub."
  );
  socialSection.appendChild(smHint);

  root.appendChild(socialSection);

  addSocialBtn.addEventListener("click", () => addSocialRow());

  // PROFIEL
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

  // VAARDIGHEDEN
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
  const skillNote = el(
    "div",
    "hint-text",
    "Hier kunnen je vaardigheden komen te staan. Niveau 0 = leeg, 5 = alle bolletjes vol."
  );
  skillSection.appendChild(skillNote);
  root.appendChild(skillSection);

  addSkillBtn.addEventListener("click", () => addSkillRow());

  // TALEN
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
  const langHint = el("div", "hint-text", "Hier kunnen je talen komen te staan.");
  langSection.appendChild(langHint);
  root.appendChild(langSection);

  addLangBtn.addEventListener("click", () => addLanguageRow());

  // HOBBY'S
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
  const hobbyHint = el("div", "hint-text", "Hier kunnen je hobby's komen te staan.");
  hobbySection.appendChild(hobbyHint);
  root.appendChild(hobbySection);

  addHobbyBtn.addEventListener("click", () => addHobbyRow());

  // OPLEIDINGEN
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
  const eduHint = el("div", "hint-text", "Hier kunnen je opleidingen komen te staan.");
  eduSection.appendChild(eduHint);
  root.appendChild(eduSection);

  addEduBtn.addEventListener("click", () => addEducationBlock());

  // WERKERVARING
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
  const jobHint = el("div", "hint-text", "Hier kan je werkervaring komen te staan.");
  jobSection.appendChild(jobHint);
  root.appendChild(jobSection);

  addJobBtn.addEventListener("click", () => addJobBlock());

  // Foto upload binding
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

// ---------- VAARDIGHEDEN ----------

function addSkillRow() {
  const editorList = document.getElementById("skillsEditorList");
  const cvList = document.getElementById("skillsList");
  if (!editorList || !cvList) return;

  const id = ++skillCounter;

  const cvLi = el("li");
  cvLi.dataset.id = String(id);
  const nameSpan = el("span", "skill-name");
  const dotsSpan = el("span", "dots");
  for (let i = 0; i < 5; i++) dotsSpan.appendChild(el("span", "dot"));
  cvLi.appendChild(nameSpan);
  cvLi.appendChild(dotsSpan);
  cvLi.style.display = "none";
  cvList.appendChild(cvLi);

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const header = el("div", "editor-row-header");
  header.appendChild(el("div", "editor-row-title", "Vaardigheid"));
  const actions = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  actions.appendChild(removeBtn);
  header.appendChild(actions);
  row.appendChild(header);

  const ffName = el("div", "form-field");
  const lblName = el("label");
  lblName.textContent = "Naam";
  const inputName = el("input");
  inputName.type = "text";
  const hintName = el("div", "hint-text", "Hier kan een vaardigheid komen te staan.");
  ffName.appendChild(lblName);
  ffName.appendChild(inputName);
  ffName.appendChild(hintName);
  row.appendChild(ffName);

  const ffLevel = el("div", "form-field");
  const lblLevel = el("label");
  lblLevel.textContent = "Niveau (0–5)";
  const range = el("input");
  range.type = "range";
  range.min = "0";
  range.max = "5";
  range.value = "0";
  ffLevel.appendChild(lblLevel);
  ffLevel.appendChild(range);
  row.appendChild(ffLevel);

  editorList.appendChild(row);

  inputName.addEventListener("input", () => {
    const v = inputName.value.trim();
    if (!v) {
      nameSpan.textContent = "";
      cvLi.style.display = "none";
    } else {
      nameSpan.textContent = v;
      cvLi.style.display = "";
    }
    refreshSidebarSection("skillsList");
  });

  range.addEventListener("input", () => {
    const level = Math.max(0, Math.min(5, parseInt(range.value || "0", 10)));
    dotsSpan.querySelectorAll(".dot").forEach((d, idx) => {
      d.classList.toggle("full", idx < level);
    });
  });

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    cvList.removeChild(cvLi);
    refreshSidebarSection("skillsList");
  });

  refreshSidebarSection("skillsList");
}

// ---------- TALEN ----------

function addLanguageRow() {
  const editorList = document.getElementById("langsEditorList");
  const container = document.getElementById("languagesContainer");
  if (!editorList || !container) return;

  const id = ++langCounter;

  const cvRow = el("div", "lang-row");
  cvRow.dataset.id = String(id);
  const nameSpan = el("span");
  const dotsSpan = el("span", "dots");
  for (let i = 0; i < 5; i++) dotsSpan.appendChild(el("span", "dot"));
  cvRow.appendChild(nameSpan);
  cvRow.appendChild(dotsSpan);
  cvRow.style.display = "none";
  container.appendChild(cvRow);

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const header = el("div", "editor-row-header");
  header.appendChild(el("div", "editor-row-title", "Taal"));
  const actions = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  actions.appendChild(removeBtn);
  header.appendChild(actions);
  row.appendChild(header);

  const ffName = el("div", "form-field");
  const lblName = el("label");
  lblName.textContent = "Taal";
  const inputName = el("input");
  inputName.type = "text";
  const hintName = el("div", "hint-text", "Hier kan een taal komen te staan.");
  ffName.appendChild(lblName);
  ffName.appendChild(inputName);
  ffName.appendChild(hintName);
  row.appendChild(ffName);

  const ffLevel = el("div", "form-field");
  const lblLevel = el("label");
  lblLevel.textContent = "Niveau (0–5)";
  const range = el("input");
  range.type = "range";
  range.min = "0";
  range.max = "5";
  range.value = "0";
  ffLevel.appendChild(lblLevel);
  ffLevel.appendChild(range);
  row.appendChild(ffLevel);

  editorList.appendChild(row);

  inputName.addEventListener("input", () => {
    const v = inputName.value.trim();
    if (!v) {
      nameSpan.textContent = "";
      cvRow.style.display = "none";
    } else {
      nameSpan.textContent = v;
      cvRow.style.display = "";
    }
    refreshSidebarSection("languagesContainer");
  });

  range.addEventListener("input", () => {
    const level = Math.max(0, Math.min(5, parseInt(range.value || "0", 10)));
    dotsSpan.querySelectorAll(".dot").forEach((d, idx) => {
      d.classList.toggle("full", idx < level);
    });
  });

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    container.removeChild(cvRow);
    refreshSidebarSection("languagesContainer");
  });

  refreshSidebarSection("languagesContainer");
}

// ---------- HOBBY'S ----------

function addHobbyRow() {
  const editorList = document.getElementById("hobbiesEditorList");
  const cvList = document.getElementById("hobbyList");
  if (!editorList || !cvList) return;

  const id = ++hobbyCounter;

  const cvLi = el("li");
  cvLi.dataset.id = String(id);
  const sq = el("span", "square");
  const txt = el("span");
  cvLi.appendChild(sq);
  cvLi.appendChild(txt);
  cvLi.style.display = "none";
  cvList.appendChild(cvLi);

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const header = el("div", "editor-row-header");
  header.appendChild(el("div", "editor-row-title", "Hobby"));
  const actions = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  actions.appendChild(removeBtn);
  header.appendChild(actions);
  row.appendChild(header);

  const ffName = el("div", "form-field");
  const lblName = el("label");
  lblName.textContent = "Omschrijving";
  const inputName = el("input");
  inputName.type = "text";
  const hintName = el("div", "hint-text", "Hier kan een hobby of interesse komen te staan.");
  ffName.appendChild(lblName);
  ffName.appendChild(inputName);
  ffName.appendChild(hintName);
  row.appendChild(ffName);
  editorList.appendChild(row);

  inputName.addEventListener("input", () => {
    const v = inputName.value.trim();
    if (!v) {
      txt.textContent = "";
      cvLi.style.display = "none";
    } else {
      txt.textContent = v;
      cvLi.style.display = "";
    }
    refreshSidebarSection("hobbyList");
  });

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    cvList.removeChild(cvLi);
    refreshSidebarSection("hobbyList");
  });

  refreshSidebarSection("hobbyList");
}

// ---------- OPLEIDINGEN ----------

function addEducationBlock() {
  const editorList = document.getElementById("eduEditorList");
  const cvContainer = document.getElementById("eduContainer");
  if (!editorList || !cvContainer) return;

  const id = ++eduCounter;

  const cvItem = el("div", "edu-item");
  cvItem.dataset.id = String(id);
  const header = el("div", "edu-header");
  const tSpan = el("div", "title");
  const pSpan = el("div", "period");
  header.appendChild(tSpan);
  header.appendChild(pSpan);
  const loc = el("div", "location-link");
  const intro = el("div");
  intro.style.marginTop = "3px";
  const bullets = el("ul", "bullets");
  cvItem.appendChild(header);
  cvItem.appendChild(loc);
  cvItem.appendChild(intro);
  cvItem.appendChild(bullets);
  cvItem.style.display = "none";
  cvContainer.appendChild(cvItem);

  const updateVisibility = () => {
    const hasText =
      tSpan.textContent.trim() ||
      pSpan.textContent.trim() ||
      loc.textContent.trim() ||
      intro.textContent.trim() ||
      bullets.children.length > 0;
    cvItem.style.display = hasText ? "" : "none";
    refreshMainSection("eduContainer");
  };

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const rHead = el("div", "editor-row-header");
  rHead.appendChild(el("div", "editor-row-title", "Opleiding"));
  const acts = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  acts.appendChild(removeBtn);
  rHead.appendChild(acts);
  row.appendChild(rHead);

  const fTitle = el("div", "form-field");
  const lTitle = el("label");
  lTitle.textContent = "Titel / niveau";
  const iTitle = el("input");
  iTitle.type = "text";
  const hTitle = el("div", "hint-text", "Hier kan de opleidingsnaam komen te staan.");
  fTitle.appendChild(lTitle);
  fTitle.appendChild(iTitle);
  fTitle.appendChild(hTitle);
  row.appendChild(fTitle);

  const fSchool = el("div", "form-field");
  const lSchool = el("label");
  lSchool.textContent = "School + plaats";
  const iSchool = el("input");
  iSchool.type = "text";
  const hSchool = el("div", "hint-text", "Hier kan de school en plaats komen te staan.");
  fSchool.appendChild(lSchool);
  fSchool.appendChild(iSchool);
  fSchool.appendChild(hSchool);
  row.appendChild(fSchool);

  const fPeriod = el("div", "form-field");
  const lPeriod = el("label");
  lPeriod.textContent = "Periode";
  const iPeriod = el("input");
  iPeriod.type = "text";
  const hPeriod = el("div", "hint-text", "Hier kan de periode van je opleiding komen te staan.");
  fPeriod.appendChild(lPeriod);
  fPeriod.appendChild(iPeriod);
  fPeriod.appendChild(hPeriod);
  row.appendChild(fPeriod);

  const fIntro = el("div", "form-field");
  const lIntro = el("label");
  lIntro.textContent = "Korte omschrijving";
  const iIntro = el("textarea");
  const hIntro = el("div", "hint-text", "Hier kan een korte omschrijving van je opleiding komen te staan.");
  fIntro.appendChild(lIntro);
  fIntro.appendChild(iIntro);
  fIntro.appendChild(hIntro);
  row.appendChild(fIntro);

  const fBul = el("div", "form-field");
  const lBul = el("label");
  lBul.textContent = "Belangrijkste leerpunten (één per regel)";
  const iBul = el("textarea");
  const hBul = el("div", "hint-text", "Hier kunnen je leerpunten per regel komen te staan.");
  fBul.appendChild(lBul);
  fBul.appendChild(iBul);
  fBul.appendChild(hBul);
  row.appendChild(fBul);

  editorList.appendChild(row);

  iTitle.addEventListener("input", () => {
    tSpan.textContent = iTitle.value.trim();
    updateVisibility();
  });
  iSchool.addEventListener("input", () => {
    loc.textContent = iSchool.value.trim();
    updateVisibility();
  });
  iPeriod.addEventListener("input", () => {
    pSpan.textContent = iPeriod.value.trim();
    updateVisibility();
  });
  iIntro.addEventListener("input", () => {
    intro.textContent = iIntro.value.trim();
    updateVisibility();
  });
  bindBullets(iBul, bullets);
  iBul.addEventListener("input", updateVisibility);

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    cvContainer.removeChild(cvItem);
    refreshMainSection("eduContainer");
  });

  refreshMainSection("eduContainer");
}

// ---------- WERKERVARING ----------

function addJobBlock() {
  const editorList = document.getElementById("jobEditorList");
  const cvContainer = document.getElementById("expContainer");
  if (!editorList || !cvContainer) return;

  const id = ++jobCounter;

  const cvItem = el("div", "exp-item");
  cvItem.dataset.id = String(id);
  const header = el("div", "exp-header");
  const tSpan = el("div", "title");
  const pSpan = el("div", "period");
  header.appendChild(tSpan);
  header.appendChild(pSpan);
  const loc = el("div", "location-link");
  const bullets = el("ul", "bullets");
  cvItem.appendChild(header);
  cvItem.appendChild(loc);
  cvItem.appendChild(bullets);
  cvItem.style.display = "none";
  cvContainer.appendChild(cvItem);

  const updateVisibility = () => {
    const hasText =
      tSpan.textContent.trim() ||
      pSpan.textContent.trim() ||
      loc.textContent.trim() ||
      bullets.children.length > 0;
    cvItem.style.display = hasText ? "" : "none";
    refreshMainSection("expContainer");
  };

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const rHead = el("div", "editor-row-header");
  rHead.appendChild(el("div", "editor-row-title", "Functie"));
  const acts = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  acts.appendChild(removeBtn);
  rHead.appendChild(acts);
  row.appendChild(rHead);

  const fTitle = el("div", "form-field");
  const lTitle = el("label");
  lTitle.textContent = "Functietitel";
  const iTitle = el("input");
  iTitle.type = "text";
  const hTitle = el("div", "hint-text", "Hier kan je functietitel komen te staan.");
  fTitle.appendChild(lTitle);
  fTitle.appendChild(iTitle);
  fTitle.appendChild(hTitle);
  row.appendChild(fTitle);

  const fCompany = el("div", "form-field");
  const lCompany = el("label");
  lCompany.textContent = "Bedrijf + plaats";
  const iCompany = el("input");
  iCompany.type = "text";
  const hCompany = el("div", "hint-text", "Hier kan het bedrijf en de plaats komen te staan.");
  fCompany.appendChild(lCompany);
  fCompany.appendChild(iCompany);
  fCompany.appendChild(hCompany);
  row.appendChild(fCompany);

  const fPeriod = el("div", "form-field");
  const lPeriod = el("label");
  lPeriod.textContent = "Periode";
  const iPeriod = el("input");
  iPeriod.type = "text";
  const hPeriod = el("div", "hint-text", "Hier kan de periode van je functie komen te staan.");
  fPeriod.appendChild(lPeriod);
  fPeriod.appendChild(iPeriod);
  fPeriod.appendChild(hPeriod);
  row.appendChild(fPeriod);

  const fBul = el("div", "form-field");
  const lBul = el("label");
  lBul.textContent = "Belangrijkste taken (één per regel)";
  const iBul = el("textarea");
  const hBul = el("div", "hint-text", "Hier kunnen je taken per regel komen te staan.");
  fBul.appendChild(lBul);
  fBul.appendChild(iBul);
  fBul.appendChild(hBul);
  row.appendChild(fBul);

  editorList.appendChild(row);

  iTitle.addEventListener("input", () => {
    tSpan.textContent = iTitle.value.trim();
    updateVisibility();
  });
  iCompany.addEventListener("input", () => {
    loc.textContent = iCompany.value.trim();
    updateVisibility();
  });
  iPeriod.addEventListener("input", () => {
    pSpan.textContent = iPeriod.value.trim();
    updateVisibility();
  });
  bindBullets(iBul, bullets);
  iBul.addEventListener("input", updateVisibility);

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    cvContainer.removeChild(cvItem);
    refreshMainSection("expContainer");
  });

  refreshMainSection("expContainer");
}

// ---------- SOCIAL MEDIA ----------

function addSocialRow() {
  const editorList = document.getElementById("socialsEditorList");
  const cvList = document.getElementById("socialList");
  if (!editorList || !cvList) return;

  const id = ++socialCounter;

  const cvLi = el("li");
  cvLi.dataset.id = String(id);

  const badge = el("span", "social-icon-badge social-icon-generic", "•");
  const textSpan = el("span", "text");
  cvLi.appendChild(badge);
  cvLi.appendChild(textSpan);
  cvLi.style.display = "none";
  cvList.appendChild(cvLi);

  const row = el("div", "editor-row");
  row.dataset.id = String(id);

  const header = el("div", "editor-row-header");
  header.appendChild(el("div", "editor-row-title", "Social link"));
  const actions = el("div", "row-actions");
  const removeBtn = el("button", "btn-icon remove", "–");
  removeBtn.type = "button";
  actions.appendChild(removeBtn);
  header.appendChild(actions);
  row.appendChild(header);

  const ffPlatform = el("div", "form-field");
  const lblPlatform = el("label");
  lblPlatform.textContent = "Platform";
  const select = document.createElement("select");
  select.innerHTML = `
    <option value="">Kies platform...</option>
    <option value="linkedin">LinkedIn</option>
    <option value="x">X (Twitter)</option>
    <option value="youtube">YouTube</option>
    <option value="instagram">Instagram</option>
    <option value="tiktok">TikTok</option>
    <option value="github">GitHub</option>
    <option value="anders">Anders...</option>
  `;
  ffPlatform.appendChild(lblPlatform);
  ffPlatform.appendChild(select);
  row.appendChild(ffPlatform);

  const ffUrl = el("div", "form-field");
  const lblUrl = el("label");
  lblUrl.textContent = "Link (URL)";
  const inputUrl = el("input");
  inputUrl.type = "text";
  const hintUrl = el("div", "hint-text", "Plak hier de link naar je profiel.");
  ffUrl.appendChild(lblUrl);
  ffUrl.appendChild(inputUrl);
  ffUrl.appendChild(hintUrl);
  row.appendChild(ffUrl);

  editorList.appendChild(row);

  const platformConfig = {
    linkedin: { label: "in", className: "social-icon-linkedin" },
    x: { label: "X", className: "social-icon-x" },
    youtube: { label: "▶", className: "social-icon-youtube" },
    instagram: { label: "IG", className: "social-icon-instagram" },
    tiktok: { label: "♪", className: "social-icon-tiktok" },
    github: { label: "{ }", className: "social-icon-github" },
    anders: { label: "•", className: "social-icon-generic" }
  };

  function update() {
    const platform = select.value || "anders";
    const url = inputUrl.value.trim();

    const cfg = platformConfig[platform];
    badge.textContent = cfg.label;
    badge.className = "social-icon-badge " + cfg.className;

    if (!url && platform === "anders") {
      textSpan.textContent = "";
      cvLi.style.display = "none";
      refreshSidebarSection("socialList");
      return;
    }

    cvLi.style.display = "";

    if (url) {
      textSpan.textContent = url;
    } else {
      const label = select.options[select.selectedIndex]?.text || "";
      textSpan.textContent = label;
    }
    refreshSidebarSection("socialList");
  }

  select.addEventListener("change", update);
  inputUrl.addEventListener("input", update);

  removeBtn.addEventListener("click", () => {
    editorList.removeChild(row);
    cvList.removeChild(cvLi);
    refreshSidebarSection("socialList");
  });

  refreshSidebarSection("socialList");
}

// ---------- INIT + EXPORT ----------

document.addEventListener("DOMContentLoaded", () => {
  buildEditor();

  // start: alle optionele secties verbergen
  refreshSidebarSection("skillsList");
  refreshSidebarSection("languagesContainer");
  refreshSidebarSection("hobbyList");
  refreshSidebarSection("socialList");
  refreshMainSection("eduContainer");
  refreshMainSection("expContainer");

  const cvNode = document.getElementById("cvPage");
  const btnImg = document.getElementById("btnImg");
  const btnPdf = document.getElementById("btnPdf");

  // Download als afbeelding (PNG)
  if (btnImg && window.html2canvas) {
    btnImg.addEventListener("click", () => {
      html2canvas(cvNode, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement("a");
        link.download = "cv-afbeelding.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  }

  // Download als PDF
  if (btnPdf && window.html2canvas && window.jspdf && window.jspdf.jsPDF) {
    const { jsPDF } = window.jspdf;
    btnPdf.addEventListener("click", () => {
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
      });
    });
  }
});
