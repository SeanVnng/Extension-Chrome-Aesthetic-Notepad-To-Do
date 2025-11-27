# Focus Tab - Dashboard Productif

Focus Tab est une extension Google Chrome minimaliste qui remplace la page "Nouvel Onglet". Elle aide à rester organisé avec une liste de tâches, un bloc-notes, la météo locale et un design épuré.

## 🚀 Fonctionnalités

* **To-Do List Avancée** :
    * Ajout de tâches avec émojis via un **menu circulaire animé**.
    * Indication d'horaires (ex: 14h-16h).
    * Barre de progression visuelle.
    * Sauvegarde automatique (LocalStorage).
* **Bloc-Notes Riche** :
    * Mise en forme (Gras, Italique, Couleurs, Taille).
    * **Export en PDF** des notes.
* **Widgets Utiles** :
    * Horloge digitale avec secondes.
    * Date du jour.
    * Météo géolocalisée (via Open-Meteo API).
    * Calendrier mensuel généré automatiquement.
* **Personnalisation** :
    * Mode Sombre (Dark Mode) / Mode Clair.
    * Design moderne "Pill shape".

## 📂 Structure du Projet

Le projet respecte l'architecture Manifest V3 :

```text
FocusTab/
├── assets/          # Icônes de l'extension
├── css/             # Styles (style.css)
├── js/              # Logique (script.js)
├── lib/             # Librairies tierces (html2pdf)
├── index.html       # Page principale
└── manifest.json    # Configuration Chrome

Realisé par Seann
