# Structure du Prompt d'Implémentation

## IMPORTANT : Analyse Préalable Obligatoire

### Étape 0 : Analyse Approfondie des Documents Sources
Avant toute création de prompt d'implémentation, il est **ABSOLUMENT ESSENTIEL** d'analyser en profondeur les trois documents sources suivants :

1. **`1_IMPLEMENTATION_SEQUENCE.md`**
   - Analyse complète de la séquence des phases
   - Identification des dépendances entre phases
   - Extraction des documents associés à chaque phase
   - Compréhension de la progression logique

2. **`4_IMPLEMENTATION_PHASE_MATRIX.md`**
   - Identification des tags associés
   - Compréhension des composants impliqués
   - Analyse des relations entre composants
   - Extraction des documents supplémentaires

3. **`2_IMPLEMENTATION_WORKFLOW.md`**
   - Compréhension du workflow d'implémentation
   - Identification des points de validation
   - Analyse des structures de dossiers
   - Extraction des critères de qualité

⚠️ **ATTENTION** : Ne jamais commencer la structuration du prompt avant d'avoir complètement analysé ces trois documents.

## Structure du Prompt

### 1. En-tête du Prompt
```markdown
# Prompt d'Implémentation Synapse
Date: [DATE]
Phase: [NUMÉRO_PHASE] - [NOM_PHASE]
Sous-Phase: [NUMÉRO_SOUS_PHASE] - [NOM_SOUS_PHASE]
```

### 2. Analyse des Dépendances
```markdown
## Analyse des Dépendances

### Dépendances de Phase
- Phases précédentes requises: [LISTE]
- Composants nécessaires: [LISTE]
- Points d'intégration: [LISTE]

### Dépendances de Documentation
[Liste des documents nécessaires avec leurs relations]
```

### 3. Contexte de Phase
```markdown
## Contexte de Phase

### Description
[Description détaillée depuis IMPLEMENTATION_PHASE_MATRIX.md]

### Tags Associés
[Tags depuis IMPLEMENTATION_PHASE_MATRIX.md avec leur signification]
```

### 4. Documents d'Implémentation
```markdown
## Documents d'Implémentation

### Documents Principaux
[FORMAT pour chaque document:]
- 📄 [NOM_DOCUMENT]
  - Chemin: [CHEMIN]
  - Objectif: [OBJECTIF]
  - Points Clés: [POINTS_CLÉS]
  - Dépendances: [AUTRES_DOCUMENTS_LIÉS]

### Documents Secondaires
[Même format que ci-dessus]
```

### 5. Plan d'Implémentation Séquentiel
```markdown
## Plan d'Implémentation

### Séquence d'Implémentation
[Pour chaque point de la phase:]
1. [POINT_1]
   - Prérequis complets
   - Étapes d'implémentation
   - Points de validation intermédiaires
   - Dépendances avec autres points

2. [POINT_2]
   ...
```

### 6. Stratégie de Test
```markdown
## Stratégie de Test

### Tests Progressifs
- Tests unitaires par composant
- Points de validation intermédiaires
- Vérifications de dépendances

### Tests d'Intégration
[À effectuer uniquement après completion de tous les points de la phase]
- Tests d'intégration complets
- Validation des interactions
- Tests de régression
```

### 7. Validation Finale
```markdown
## Validation Finale

### Checklist de Completion
- [ ] Tous les points implémentés
- [ ] Tests unitaires passants
- [ ] Tests d'intégration réussis
- [ ] Documentation mise à jour
- [ ] Code review effectuée

### Critères de Qualité
[Liste des critères depuis IMPLEMENTATION_WORKFLOW.md]
```

## Utilisation du Template

1. **Préparation**
   - Analyser TOUS les documents sources
   - Identifier la phase et ses composants
   - Comprendre les dépendances

2. **Construction du Prompt**
   - Suivre la structure section par section
   - Vérifier la cohérence avec les documents sources
   - S'assurer que toutes les dépendances sont identifiées

3. **Validation**
   - Vérifier que le prompt couvre tous les aspects
   - S'assurer que la séquence est logique
   - Confirmer que les tests sont appropriés

## Notes Importantes

1. **Progression**
   - Implémenter les points dans l'ordre
   - Valider chaque point avant de passer au suivant
   - Ne pas tester l'intégration avant d'avoir tous les points

2. **Documentation**
   - Maintenir la traçabilité avec les documents sources
   - Documenter les décisions d'implémentation
   - Mettre à jour la documentation au fur et à mesure

3. **Tests**
   - Tests unitaires pendant l'implémentation
   - Tests d'intégration uniquement après completion
   - Validation progressive des dépendances
