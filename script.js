/*=====================================================
 Lecture du paramètre du QR Code
=====================================================*/

const params = new URLSearchParams(window.location.search);

let zone = params.get("zone");


/*=====================================================
 Éléments HTML
=====================================================*/

const titre = document.getElementById("titre");

const enigme = document.getElementById("enigme");

const citation = document.querySelector(".citation-garde");

const champ = document.getElementById("reponse");

const bouton = document.getElementById("btnValider");

const message = document.getElementById("message");

const zoneReponse = document.querySelector(".zone-reponse");


/*=====================================================
 Son de bonne réponse
 Le fichier MP3 doit être placé dans le même
 dossier que index.html et script.js.
=====================================================*/

const sonBonneReponse =
    new Audio("Ouverture porte en bois, clef.mp3");

sonBonneReponse.preload = "auto";

let bonneReponseJouee = false;


/*=====================================================
 Base des sceaux
=====================================================*/

const sceaux = {


    /*-------------------------------------------------
     CHÊNE
    -------------------------------------------------*/

    chene:{

        titre:
        "Le Vieux Chêne observe ceux qui savent écouter les arbres...",

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


    /*-------------------------------------------------
     CERF
    -------------------------------------------------*/

    cerf:{

        titre:
        "Le Grand Cerf ne se montre qu'à ceux qui savent observer avant de compter...",

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


    /*-------------------------------------------------
     FORESTIER
    -------------------------------------------------*/

    forestier:{

        titre:
        "Le chemin n'appartient jamais à celui qui le parcourt...",

        enigme:
`Résolvez cette énigme :

Je connais tous les chemins,
mais je n'en emprunte aucun.
Je guide les voyageurs, sans jamais leur parler.
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


    /*-------------------------------------------------
     APÉRO
    -------------------------------------------------*/

    apero:{

        titre:
        "Les plus belles récompenses se méritent avant de se partager...",

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
 Système audio pour mauvaise réponse
=====================================================*/

let audioContext = null;


/*=====================================================
 Création du contexte audio
=====================================================*/

function obtenirAudioContext(){

    if(!audioContext){

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if(!AudioContext){

            return null;

        }

        audioContext =
            new AudioContext();

    }


    if(audioContext.state === "suspended"){

        audioContext.resume();

    }


    return audioContext;

}


/*=====================================================
 Son d'erreur
 Petit son de bois.
 Répété à chaque mauvaise réponse.
=====================================================*/

function jouerSonErreur(){

    const ctx =
        obtenirAudioContext();

    if(!ctx){

        return;

    }


    const maintenant =
        ctx.currentTime;


    const oscillateur =
        ctx.createOscillator();

    const gain =
        ctx.createGain();


    oscillateur.type =
        "triangle";


    oscillateur.frequency.setValueAtTime(
        150,
        maintenant
    );


    oscillateur.frequency.exponentialRampToValueAtTime(
        70,
        maintenant + 0.10
    );


    gain.gain.setValueAtTime(
        0.0001,
        maintenant
    );


    gain.gain.exponentialRampToValueAtTime(
        0.24,
        maintenant + 0.006
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        maintenant + 0.14
    );


    oscillateur.connect(gain);

    gain.connect(
        ctx.destination
    );


    oscillateur.start(
        maintenant
    );

    oscillateur.stop(
        maintenant + 0.15
    );

}


/*=====================================================
 Bonne réponse
 Lecture du vrai fichier MP3

 Le son ne peut être joué qu'une seule fois
 pour une énigme validée.
=====================================================*/

function jouerSonBonneReponse(){

    if(bonneReponseJouee){

        return;

    }


    bonneReponseJouee = true;


    /*
     * On repart du début du fichier au cas où
     * le son aurait déjà été chargé ou joué.
     */

    sonBonneReponse.currentTime = 0;


    sonBonneReponse.play()
        .catch(function(erreur){

            console.log(
                "Lecture du son impossible :",
                erreur
            );

        });

}


/*=====================================================
 Affichage d'un sceau
=====================================================*/

function afficherSceau(nom){

    zone = nom;


    const sceau =
        sceaux[nom];


    if(!sceau){

        afficherModeTest();

        return;

    }


    /*
     * La phrase d'ambiance devient le titre
     * principal de l'énigme.
     */

    titre.textContent =
        sceau.titre;


    /*
     * L'ancien emplacement citation-garde
     * n'est plus utilisé ici.
     */

    if(citation){

        citation.textContent = "";

        citation.style.display =
            "none";

    }


    /*
     * L'énigme contient volontairement
     * un saut après "Résolvez cette énigme :"
     */

    enigme.textContent =
        sceau.enigme;


    zoneReponse.style.display =
        "block";


    champ.disabled =
        false;


    champ.value =
        "";


    bouton.style.display =
        "block";


    message.innerHTML =
        "";


    /*
     * Nouvelle énigme :
     * le son pourra être joué une fois.
     */

    bonneReponseJouee =
        false;


    champ.focus();

}


/*=====================================================
 Mode Organisateur
=====================================================*/

function afficherModeTest(){

    zone = null;


    titre.textContent =
        "Mode Organisateur";


    if(citation){

        citation.textContent =
            "Choisissez le sceau à tester.";

        citation.style.display =
            "block";

    }


    enigme.innerHTML = `

<div class="mode-test">

   
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


    zoneReponse.style.display =
        "none";


    message.innerHTML =
        "";


    bonneReponseJouee =
        false;

}


/*=====================================================
 Initialisation
=====================================================*/

if(
    zone &&
    sceaux[zone]
){

    afficherSceau(zone);

}

else{

    afficherModeTest();

}


/*=====================================================
 Normalisation des réponses
=====================================================*/

function normaliser(texte){

    return texte

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


/*=====================================================
 Vérification de la réponse
=====================================================*/

function reponseCorrecte(){

    const reponse =
        normaliser(
            champ.value
        );


    return sceaux[zone]
        .reponses
        .some(
            function(element){

                return normaliser(
                    element
                ) === reponse;

            }
        );

}


/*=====================================================
 Validation de la réponse
=====================================================*/

function verifier(){


    /*-----------------------------------------------
     Aucune réponse
    ------------------------------------------------*/

    if(
        champ.value.trim() === ""
    ){

        message.innerHTML =

        "<span style='color:#a85c20;'>" +

        "<strong>" +

        "⚠ Veuillez saisir une réponse." +

        "</strong>" +

        "</span>";


        champ.focus();

        return;

    }


    /*-----------------------------------------------
     Bonne réponse
    ------------------------------------------------*/

    if(
        reponseCorrecte()
    ){

        jouerSonBonneReponse();


        message.innerHTML =

        "<span style='color:#3d5b38;'>" +

        "<strong>" +

        "ÉNIGME VALIDÉE" +

        "</strong>" +

        "</span>" +

        "<br><br>" +

        "Bonne réponse." +

        "<br><br>" +

        "Vous pouvez désormais accéder aux épreuves de ce sceau.";


        bouton.style.display =
            "none";


        champ.disabled =
            true;


        return;

    }


    /*-----------------------------------------------
     Mauvaise réponse
     Le son est rejoué à chaque erreur.
    ------------------------------------------------*/

    jouerSonErreur();


    message.innerHTML =

    "<span style='color:#9d3428;'>" +

    "<strong>" +

    "❌ ÉNIGME INCORRECTE" +

    "</strong>" +

    "</span>" +

    "<br><br>" +

    "Ce n'est pas la bonne réponse." +

    "<br><br>" +

    "Réfléchissez encore...";


    champ.focus();

}


/*=====================================================
 Validation avec la touche Entrée
=====================================================*/

champ.addEventListener(
    "keydown",
    function(e){

        if(
            e.key === "Enter"
        ){

            verifier();

        }

    }
);


/*=====================================================
 Raccourci global
=====================================================*/

window.afficherSceau =
    afficherSceau;


/*=====================================================
 Sécurité
=====================================================*/

if(
    zone &&
    !sceaux[zone]
){

    afficherModeTest();

}


/*=====================================================
 Fin du programme
=====================================================*/

