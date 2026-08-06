/*=====================================================
 Lecture du paramètre du QR Code
=====================================================*/

const params = new URLSearchParams(window.location.search);

let zone = params.get("zone");

/*=====================================================
 Eléments HTML
=====================================================*/

const titre = document.getElementById("titre");

const enigme = document.getElementById("enigme");

const champ = document.getElementById("reponse");

const bouton = document.getElementById("btnValider");

const message = document.getElementById("message");

const zoneReponse = document.querySelector(".zone-reponse");

/*=====================================================
 Base des sceaux
=====================================================*/

const sceaux = {

    chene:{

        titre:
"Avant d'entrer sur les terres du Patriarche...",

        enigme:
`Résolvez cette énigme :

Je raconte l'âge des géants,
mais personne ne peut me lire sans les blesser.

Qui suis-je ?`,

        reponses:[

            "les cernes",
            "cernes",

            "les anneaux",
            "anneaux",
            "des anneaux"

        ]

    },

    cerf:{

        titre:
"Avant d'entrer sur le territoire du Grand Cerf...",

        enigme:
`Résolvez cette énigme :

Un cerf voit 6 lapins.

Chaque lapin voit 2 écureuils.

Chaque écureuil voit 3 sangliers.

Combien d'animaux se trouvent dans la forêt ?`,

        reponses:[

            "12",

            "douze"

        ]

    },

    forestier:{

        titre:
"Avant d'entrer sur les terres du Garde Forestier...",

        enigme:
`Résolvez cette énigme :

Je connais tous les chemins,
mais je n'en emprunte aucun.

Je guide les voyageurs,
sans jamais leur parler.

Qui suis-je ?`,

        reponses:[

            "panneau",
            "le panneau",
            "un panneau",

            "balise",
            "la balise",
            "une balise"

        ]

    },

    apero:{

        titre:
"Avant d'entrer dans le lieu des amateurs de l'Apéro...",

        enigme:
`Résolvez cette énigme :

Je ferme sans serrure.

Je protège sans cadenas.

On me retire avant de partager ce que je garde.

Qui suis-je ?`,

        reponses:[

            "bouchon",
            "le bouchon",
            "un bouchon"

        ]

    }

};
/*=====================================================
 Mode Organisateur
 + Affichage des sceaux
 Partie 2 / 4
=====================================================*/

//=====================================================
// Affiche un sceau
//=====================================================

function afficherSceau(nom){

    zone = nom;

    const sceau = sceaux[nom];

    titre.textContent = sceau.titre;

    enigme.innerHTML =
        sceau.enigme.replace(/\n/g,"<br>");

    zoneReponse.style.display = "block";

    champ.disabled = false;

    champ.value = "";

    bouton.style.display = "block";

    message.innerHTML = "";

    champ.focus();

}

//=====================================================
// Mode Organisateur
//=====================================================

function afficherModeTest(){

    titre.textContent =
        "LE DERNIER SECRET DU GARDE";

    enigme.innerHTML = `

<div class="mode-test">

<h2>Mode Organisateur</h2>

<p>
Choisissez le sceau à tester.
</p>

<button onclick="afficherSceau('chene')">
🌳 Tester le Chêne
</button>

<button onclick="afficherSceau('cerf')">
🦌 Tester le Cerf
</button>

<button onclick="afficherSceau('forestier')">
🌲 Tester le Forestier
</button>

<button onclick="afficherSceau('apero')">
🍷 Tester l'Apéro
</button>

</div>

`;

    zoneReponse.style.display = "none";

    message.innerHTML = "";

}

//=====================================================
// Initialisation
//=====================================================

if(zone && sceaux[zone]){

    afficherSceau(zone);

}
else{

    afficherModeTest();

}
/*=====================================================
 Normalisation des réponses
 Vérification
 Partie 3 / 4
=====================================================*/

//=====================================================
// Supprime les accents, les espaces inutiles,
// et ignore les majuscules.
//=====================================================

function normaliser(texte){

    return texte

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/\s+/g," ")

        .trim();

}

//=====================================================
// Vérifie si la réponse est correcte
//=====================================================

function reponseCorrecte(){

    const reponse = normaliser(champ.value);

    return sceaux[zone].reponses.some(function(element){

        return normaliser(element) === reponse;

    });

}

//=====================================================
// Validation de la réponse
//=====================================================

function verifier(){

    // Aucune réponse

    if(champ.value.trim()===""){

        message.innerHTML =
        "<span style='color:#d35400;'><strong>⚠ Veuillez saisir une réponse.</strong></span>";

        champ.focus();

        return;

    }

    // Bonne réponse

    if(reponseCorrecte()){

        message.innerHTML =

        "<span style='color:green;'><strong>✅ ÉNIGME VALIDÉE</strong></span>" +

        "<br><br>" +

        "Bonne réponse." +

        "<br><br>" +

        "Vous pouvez désormais accéder aux épreuves de ce sceau.";

        bouton.style.display = "none";

        champ.disabled = true;

        return;

    }

    // Mauvaise réponse

    message.innerHTML =

    "<span style='color:red;'><strong>❌ ÉNIGME INCORRECTE</strong></span>" +

    "<br><br>" +

    "Ce n'est pas la bonne réponse." +

    "<br><br>" +

    "Réfléchissez encore...";

    champ.focus();

}
/*=====================================================
 Finalisation
 Partie 4 / 4
=====================================================*/

//=====================================================
// Validation avec la touche Entrée
//=====================================================

champ.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        verifier();

    }

});

//=====================================================
// Raccourci global
// Permet aux boutons HTML du mode Organisateur
// d'appeler afficherSceau()
//=====================================================

window.afficherSceau = afficherSceau;

//=====================================================
// Sécurité
// Si le QR Code contient une zone inconnue,
// retour automatique au mode Organisateur.
//=====================================================

if(zone && !sceaux[zone]){

    afficherModeTest();

}

//=====================================================
// Fin du programme
//=====================================================

