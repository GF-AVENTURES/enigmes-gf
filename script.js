/* VERSION 3 - Utilisateurs */
const params = new URLSearchParams(window.location.search);
let zone = params.get("zone");

const titre = document.getElementById("titre");
const enigme = document.getElementById("enigme");
const citation = document.querySelector(".citation-garde");
const champ = document.getElementById("reponse");
const bouton = document.getElementById("btnValider");
const message = document.getElementById("message");
const zoneReponse = document.querySelector(".zone-reponse");
const accueilUtilisateur = document.getElementById("accueil-utilisateur");

const sonBonneReponse = new Audio("Ouverture porte en bois, clef.mp3");
sonBonneReponse.preload = "auto";
let bonneReponseJouee = false;

const sceaux = {
  chene: {
    titre: "Le Vieux Chêne observe ceux qui savent écouter les arbres...",
    enigme: `Résolvez cette énigme :

Je raconte l'âge des géants,
mais personne ne peut me lire sans les blesser.
Qui suis-je ?`,
    reponses: ["les cernes", "cernes", "les anneaux", "anneaux", "des anneaux"]
  },

  cerf: {
    titre: "Le Grand Cerf ne se montre qu'à ceux qui savent observer avant de compter...",
    enigme: `Résolvez cette énigme :

Un cerf voit 6 lapins.
Chaque lapin voit 2 écureuils.
Chaque écureuil voit 3 sangliers.
Combien d'animaux se trouvent dans la forêt ?`,
    reponses: ["12", "douze"]
  },

  forestier: {
    titre: "Le chemin n'appartient jamais à celui qui le parcourt...",
    enigme: `Résolvez cette énigme :

Je connais tous les chemins,
mais je n'en emprunte aucun.
Je guide les voyageurs, sans jamais leur parler.
Qui suis-je ?`,
    reponses: ["panneau", "le panneau", "un panneau", "balise", "la balise", "une balise"]
  },

  apero: {
    titre: "Les plus belles récompenses se méritent avant de se partager...",
    enigme: `Résolvez cette énigme :

Je ferme sans serrure.
Je protège sans cadenas.
On me retire avant de partager ce que je garde.
Qui suis-je ?`,
    reponses: ["bouchon", "le bouchon", "un bouchon"]
  }
};

const dernierSecret = {
  titre: "🔐 LE DERNIER SECRET DU GARDE",
  enigme: `🎉 Félicitations, aventuriers !

🌳🦌🌲🍷 Les quatre sceaux sont désormais en votre possession.

📜 Le moment est venu d'assembler les fragments recueillis tout au long de votre quête.

🧩 Une ultime énigme se cache derrière ces précieux indices.

✨ Lorsque vous penserez avoir percé le dernier secret, indiquez votre réponse.

🌲 Le Garde veille encore...`,
  reponses: ["tresor"]
};

/* SIXIÈME QR CODE : ÉNIGME ULTIME */
const enigmeUltime = {
  titre: "🔐 L'ÉNIGME ULTIME — Le dernier ordre du Garde",

  enigme: `Quatre Sceaux vous ont livré leurs chiffres.
Quatre chiffres attendent désormais de retrouver leur place.

Pour ouvrir le coffre, vous devrez suivre l'ordre que le Garde a établi.

Je suis le premier à porter les racines de la forêt.
Le deuxième porte les bois majestueux du seigneur des lieux.
Le troisième veille sur la forêt et ceux qui la traversent.
Le quatrième célèbre le partage et la convivialité.

Qui suis-je, dans cet ordre ?

Retrouvez les quatre chiffres correspondant à ces Sceaux et saisissez la combinaison complète dans le champ de réponse ci-dessous.

Le Garde veille encore...`,

  combinaison: "2685"
};

let audioContext = null;

function obtenirAudioContext() {
  if (!audioContext) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioContext = new AC();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function jouerSonErreur() {
  const ctx = obtenirAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.type = "triangle";
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.10);

  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.24, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

  o.connect(g);
  g.connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.15);
}

function jouerSonBonneReponse() {
  if (bonneReponseJouee) return;

  bonneReponseJouee = true;
  sonBonneReponse.currentTime = 0;

  sonBonneReponse.play().catch(e =>
    console.log("Lecture du son impossible :", e)
  );
}

function afficherSceau(nom) {
  const sceau = sceaux[nom];

  if (!sceau) {
    afficherAccueil();
    return;
  }

  zone = nom;

  if (accueilUtilisateur) {
    accueilUtilisateur.style.display = "none";
  }

  titre.textContent = sceau.titre;

  if (citation) {
    citation.textContent = "";
    citation.style.display = "none";
  }

  enigme.textContent = sceau.enigme;
  zoneReponse.style.display = "block";
  champ.disabled = false;
  champ.value = "";
  champ.removeAttribute("maxlength");
  champ.removeAttribute("inputmode");
  champ.placeholder = "";
  bouton.style.display = "block";
  message.innerHTML = "";
  bonneReponseJouee = false;
  champ.focus();
}

function afficherDernierSecret() {
  zone = "dernier";

  if (accueilUtilisateur) {
    accueilUtilisateur.style.display = "none";
  }

  titre.textContent = dernierSecret.titre;

  if (citation) {
    citation.textContent = "";
    citation.style.display = "none";
  }

  enigme.textContent = dernierSecret.enigme;
  zoneReponse.style.display = "block";
  champ.disabled = false;
  champ.value = "";
  champ.removeAttribute("maxlength");
  champ.removeAttribute("inputmode");
  champ.placeholder = "";
  bouton.style.display = "block";
  message.innerHTML = "";
  bonneReponseJouee = false;
  champ.focus();
}

/* AFFICHAGE DE L'ÉNIGME ULTIME */
function afficherUltime() {
  zone = "ultime";

  if (accueilUtilisateur) {
    accueilUtilisateur.style.display = "none";
  }

  titre.textContent = enigmeUltime.titre;

  if (citation) {
    citation.textContent = "";
    citation.style.display = "none";
  }

  enigme.textContent = enigmeUltime.enigme;
  zoneReponse.style.display = "block";
  champ.disabled = false;
  champ.value = "";
  champ.setAttribute("maxlength", "4");
  champ.setAttribute("inputmode", "numeric");
  champ.placeholder = "Saisissez les 4 chiffres";
  bouton.style.display = "block";
  message.innerHTML = "";
  bonneReponseJouee = false;
  champ.focus();
}

function afficherAccueil() {
  zone = null;

  if (accueilUtilisateur) {
    accueilUtilisateur.style.display = "block";
  }

  titre.textContent = "Le Dernier Secret du Garde";

  if (citation) {
    citation.textContent = "Le Garde vous attend...";
    citation.style.display = "block";
  }

  enigme.textContent = "";
  zoneReponse.style.display = "none";
  message.innerHTML = "";
  bonneReponseJouee = false;
}

function normaliser(texte) {
  return texte.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function reponseCorrecte() {
  const r = normaliser(champ.value);

  const liste = zone === "dernier"
    ? dernierSecret.reponses
    : (sceaux[zone]?.reponses || []);

  return liste.some(e => normaliser(e) === r);
}

function verifier() {
  if (champ.value.trim() === "") {
    message.innerHTML =
      "<span style='color:#a85c20;'><strong>⚠ Veuillez saisir une réponse.</strong></span>";
    champ.focus();
    return;
  }

  /* CINQUIÈME QR CODE : LE DERNIER SECRET */
  if (zone === "dernier") {
    if (reponseCorrecte()) {
      jouerSonBonneReponse();

      message.innerHTML =
        "<span style='color:#3d5b38;'><strong>✅ Mot final correct.</strong></span>" +
        "<br><br>Félicitations, aventuriers." +
        "<br><br>Vous avez découvert le dernier secret du Garde." +
        "<br><br>Mais votre quête n'est pas encore terminée." +
        "<br><br>Avant de pouvoir atteindre le Graal, le Garde vous confie une dernière découverte." +
        "<br><br><strong>Cherchez le Codex du Garde.</strong>" +
        "<br><br>Il se trouve :" +
        "<br><br><strong>« LÀ OÙ LE MÉTAL TOUCHE LE CIEL. »</strong>" +
        "<br><br>Inutile de poursuivre votre quête au cœur des bois..." +
        "<br><br>Le Codex vous révélera le chemin qui mène au coffre final !" +
        "<br><br>Bonne chance, aventuriers." +
        "<br><br>🌲 Le Garde veille encore...";

      bouton.style.display = "none";
      champ.disabled = true;
    } else {
      jouerSonErreur();

      message.innerHTML =
        "<span style='color:#9d3428;'><strong>❌ Mauvaise réponse finale</strong></span>" +
        "<br><br>❌ Ce n'est pas la bonne réponse !" +
        "<br><br>Relisez attentivement vos fragments." +
        "<br><br>Le Garde ne révèle pas ses secrets si facilement...";

      champ.focus();
    }

    return;
  }

  /* SIXIÈME QR CODE : VALIDATION DE LA COMBINAISON */
  if (zone === "ultime") {
    const combinaison = champ.value.trim();

    if (combinaison === enigmeUltime.combinaison) {
      jouerSonBonneReponse();

      message.innerHTML =
        "<span style='color:#3d5b38;'><strong>✅ COMBINAISON CORRECTE !</strong></span>" +
  "<br><br>Félicitations, aventuriers !" +
  "<br><br>Vous avez retrouvé l'ordre établi par le Garde et percé le secret des quatre Sceaux." +
  "<br><br><strong>Vous pouvez désormais vous diriger vers les Gardiens du Dernier Héritage pour ouvrir le coffre.</strong>" +
  "<br><br><strong>Une ultime mission vous attend peut-être encore…</strong>";

      bouton.style.display = "none";
      champ.disabled = true;
    } else {
      jouerSonErreur();

      message.innerHTML =
        "<span style='color:#9d3428;'><strong>❌ COMBINAISON INCORRECTE</strong></span>" +
        "<br><br>L'ordre des quatre chiffres n'est pas le bon." +
        "<br><br>Reprenez les quatre Sceaux et suivez attentivement les indications du Garde.";

      champ.focus();
    }

    return;
  }

  /* QUATRE ÉNIGMES DES SCEAUX : FONCTIONNEMENT CONSERVÉ */
  if (reponseCorrecte()) {
    jouerSonBonneReponse();

    message.innerHTML =
      "<span style='color:#3d5b38;'><strong>ÉNIGME VALIDÉE</strong></span>" +
      "<br><br>Bonne réponse." +
      "<br><br>Vous pouvez désormais accéder aux épreuves de ce sceau.";

    bouton.style.display = "none";
    champ.disabled = true;
    return;
  }

  jouerSonErreur();

  message.innerHTML =
    "<span style='color:#9d3428;'><strong>❌ ÉNIGME INCORRECTE</strong></span>" +
    "<br><br>Ce n'est pas la bonne réponse." +
    "<br><br>Réfléchissez encore...";

  champ.focus();
}

/* SÉLECTION DE LA PAGE SELON LE QR CODE */
if (zone === "dernier") {
  afficherDernierSecret();
} else if (zone === "ultime") {
  afficherUltime();
} else if (zone && sceaux[zone]) {
  afficherSceau(zone);
} else {
  afficherAccueil();
}

/* SAISIE NUMÉRIQUE LIMITÉE À QUATRE CHIFFRES */
champ.addEventListener("input", () => {
  if (zone === "ultime") {
    champ.value = champ.value.replace(/\D/g, "").slice(0, 4);
  }
});

champ.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    verifier();
  }
});
