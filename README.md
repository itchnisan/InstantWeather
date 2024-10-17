# InstantWeather

InstantWeather est une application web permettant de consulter les prévisions météorologiques pour plusieurs jours à partir d'un code postal et de la ville sélectionnée. L'application utilise l'API de **MétéoConcept** pour obtenir les prévisions et propose des options de personnalisation pour l'affichage des informations.

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Fonctionnalités

- **Recherche par code postal** : Entrez un code postal pour afficher une liste de villes correspondantes.
- **Sélection de la ville** : Choisissez une ville pour afficher les prévisions météorologiques.
- **Affichage des prévisions** : Affiche les informations telles que la température maximale, minimale, les heures d'ensoleillement, la probabilité de pluie, et bien plus.
- **Personnalisation des options** :
  - Affichez ou cachez les informations comme la latitude, la longitude, la vitesse et direction du vent, ainsi que l'accumulation de la pluie.
  - Choisissez le nombre de jours pour lesquels les prévisions doivent être affichées.
- **Navigation entre les jours** : Visualisez les prévisions des jours suivants ou précédents.

## Technologies utilisées

- **HTML/CSS** : Pour la structure et le style de la page.
- **JavaScript** : Pour la logique de l'application et l'interaction avec l'API.
- **API MétéoConcept** : Pour récupérer les prévisions météorologiques.
- **API Géo** : Pour récupérer les villes correspondant à un code postal.

## Prérequis

- Un navigateur web moderne (Chrome, Firefox, Edge, etc.).
- Une connexion Internet pour accéder aux APIs.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/instantweather.git
