# Structure du Prompt d'Implémentation

## Introduction
Ce document définit la structure standardisée pour créer des prompts d'implémentation pour le projet Synapse. Cette structure est basée sur l'analyse des trois documents fondamentaux :
- `1_IMPLEMENTATION_SEQUENCE.md`
- `4_IMPLEMENTATION_PHASE_MATRIX.md`
- `2_IMPLEMENTATION_WORKFLOW.md`

## Structure du Prompt

### 1. En-tête du Prompt
```markdown
# Prompt d'Implémentation Synapse
Date: [DATE]
Phase: [NUMÉRO_PHASE] - [NOM_PHASE]
Sous-Phase: [NUMÉRO_SOUS_PHASE] - [NOM_SOUS_PHASE]
```

### 2. Contexte de Phase
```markdown
## Contexte de Phase

### Description
[Description détaillée de la phase depuis IMPLEMENTATION_PHASE_MATRIX.md]

### Tags Associés
[Liste des tags depuis IMPLEMENTATION_PHASE_MATRIX.md]
Exemple:
- [PHASE:1] [COMPONENT:SQLITE_CORE] [TYPE:IMPLEMENTATION]
- [PHASE:1] [COMPONENT:SQLITE_CORE] [TYPE:DOCUMENTATION]
```

### 3. Documents à Analyser
```markdown
## Documents à Analyser

### Documents Principaux
[Liste des documents principaux depuis IMPLEMENTATION_SEQUENCE.md]
FORMAT:
- 📄 [NOM_DOCUMENT]
  - Chemin: [CHEMIN_COMPLET]
  - Objectif: [OBJECTIF_DU_DOCUMENT]
  - Points Clés: [POINTS_IMPORTANTS]

### Documents Secondaires
[Documents supplémentaires depuis IMPLEMENTATION_PHASE_MATRIX.md]
FORMAT:
- 📄 [NOM_DOCUMENT]
  - Chemin: [CHEMIN_COMPLET]
  - Support Pour: [UTILITÉ]
```

### 4. Plan d'Implémentation
```markdown
## Plan d'Implémentation

### Étapes de Développement
[Étapes détaillées depuis IMPLEMENTATION_SEQUENCE.md]
1. [ÉTAPE_1]
   - Objectif:
   - Tâches:
   - Validation:

2. [ÉTAPE_2]
   ...

### Validation Requise
[Critères de validation depuis IMPLEMENTATION_WORKFLOW.md]
- [ ] [CRITÈRE_1]
- [ ] [CRITÈRE_2]
...
```

## Exemple d'Utilisation

Pour utiliser cette structure :

1. **Identifier la Phase**
   - Consulter `1_IMPLEMENTATION_SEQUENCE.md` pour l'ordre des phases
   - Noter le numéro et nom de la phase actuelle

2. **Collecter les Tags**
   - Consulter `4_IMPLEMENTATION_PHASE_MATRIX.md`
   - Identifier tous les tags associés à la phase

3. **Rassembler les Documents**
   - Lister les documents principaux depuis `1_IMPLEMENTATION_SEQUENCE.md`
   - Ajouter les documents supplémentaires depuis `4_IMPLEMENTATION_PHASE_MATRIX.md`

4. **Définir le Plan**
   - Suivre les étapes de `2_IMPLEMENTATION_WORKFLOW.md`
   - Inclure les points de validation

## Notes Importantes

1. **Progression**
   - Chaque sous-phase doit être complétée et validée avant de passer à la suivante
   - La validation doit suivre les critères définis dans `2_IMPLEMENTATION_WORKFLOW.md`

2. **Documentation**
   - Tous les documents listés doivent être analysés avant l'implémentation
   - Les points clés de chaque document doivent être clairement identifiés

3. **Validation**
   - Chaque étape doit avoir des critères de validation clairs
   - Les tests doivent être définis avant l'implémentation
