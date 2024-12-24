# Mood Calendar Backend

## Overview
The backend service documentation for Mood Calendar

## Features
- Dynamic mood logging 
- Mood tracking 
- Daily Trends 
  
## Tech Stack 
- Language: Python3.13
- Framework: FASTAPI, SQLALCHEMY
- Database: SQLITE3

## File Structure
- `main.py`: Handles API routes.
- `database.py`: Manages database connection and initialization.
- `models.py`: Defines database tables.
- `schemas.py`: Defines Pydantic validation schemas.
- `crud.py`: Contains database operations (create, read, etc.).
- `graph.py`: Responsible for mood analysis.

## Endpoints
1. `POST /add_entry/`: Add a journal entry.
2. `GET /entries/`: Retrieve all entries.
3. `POST /register/`: Registers a new user
4. `POST /login/`: Logs-in User (also check `/verify`)
5. `GET /entries/`: Gets all the journal entries of the logged-in User

## Emotion Classification 

### Scientific Frameworks for Emotion Classification

### 1. Basic Emotion Theory
### Paul Ekman's Universal Emotions (1972, 1992)
- Identified six basic emotions through cross-cultural studies: happiness, sadness, fear, disgust, anger, and surprise
- Later expanded to include additional emotions
- Key Paper: "An Argument for Basic Emotions" (Ekman, 1992) in Cognition and Emotion

### Robert Plutchik's Wheel of Emotions (1980)
- Eight primary emotions arranged in opposing pairs:
  * Joy vs. Sadness
  * Trust vs. Disgust
  * Fear vs. Anger
  * Anticipation vs. Surprise
- Reference: "A General Psychoevolutionary Theory of Emotion" in Theories of Emotion

### 2. Dimensional Models

### Russell's Circumplex Model (1980)
- Emotions mapped on two dimensions:
  * Valence (pleasant-unpleasant)
  * Arousal (high-low)
- Source: "A Circumplex Model of Affect" - Journal of Personality and Social Psychology

### Watson and Tellegen's Two-Factor Theory (1985)
- Positive Affect (PA)
- Negative Affect (NA)
- Referenced in "Toward a Consensual Structure of Mood" - Psychological Bulletin

### 3. Contemporary Research

### Lisa Feldman Barrett's Theory of Constructed Emotion (2017)
- Emotions as constructed experiences
- Influenced by cultural and social factors
- Book: "How Emotions Are Made: The Secret Life of the Brain"

### Antonio Damasio's Somatic Marker Hypothesis
- Connection between emotions and decision-making
- Physiological states influence emotional experience
- Book: "Descartes' Error: Emotion, Reason, and the Human Brain" (1994)

### 4. Hierarchical Organization of Emotions

### Shaver et al.'s Hierarchical Model (1987)
- Three-level hierarchy:
  * Superordinate (positive/negative)
  * Basic emotions
  * Subordinate emotions
- Paper: "Emotion Knowledge: Further Exploration of a Prototype Approach"

### 5. Neural Basis of Emotions

### LeDoux's Research on Fear Circuit (1996, 2015)
- Amygdala's role in emotional processing
- Multiple pathways for emotional responses
- Book: "The Emotional Brain: The Mysterious Underpinnings of Emotional Life"

### 6. Application to Our Classification System

Our emotion hierarchy integrates these scientific frameworks:

1. Primary Emotions (Based on Ekman and Plutchik):
   - Joy, Sadness, Anger, Fear, Love

2. Secondary Emotions (Influenced by Shaver's hierarchy):
   - Joy → Contentment, Happiness, Excitement, Pride
   - Sadness → Melancholy, Disappointment, Grief, Loneliness
   - Anger → Frustration, Rage, Resentment, Indignation
   - Fear → Anxiety, Insecurity, Panic, Apprehension
   - Love → Affection, Compassion, Romance, Connection

3. Tertiary Emotions (Based on contemporary emotion research):
   - Refined distinctions based on intensity and context
   - Incorporates cultural and social factors
   - Reflects both psychological and physiological aspects

### Key Research Papers:

1. Ekman, P. (1992). An argument for basic emotions. Cognition & Emotion, 6(3-4), 169-200.

2. Plutchik, R. (1980). Emotion: A Psychoevolutionary Synthesis. Harper & Row.

3. Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.

4. Shaver, P., Schwartz, J., Kirson, D., & O'Connor, C. (1987). Emotion knowledge: Further exploration of a prototype approach. Journal of Personality and Social Psychology, 52(6), 1061-1086.

5. Barrett, L. F. (2017). The theory of constructed emotion: An active inference account of interoception and categorization. Social Cognitive and Affective Neuroscience, 12(1), 1-23.

### Implementation Notes:

Our classification system specifically draws from:
- Ekman's basic emotions as primary categories
- Plutchik's emotion wheel for understanding relationships
- Shaver's hierarchical model for structuring levels
- Barrett's theory for understanding emotional complexity
- Contemporary neuroscience research for validation

This scientific foundation ensures our emotion classification is:
- Empirically grounded
- Cross-culturally validated
- Neurologically supported
- Practically applicable

For further development, consider consulting:
- Annual Review of Psychology's emotion research updates
- Current Opinion in Psychology's special issues on emotion
- Trends in Cognitive Sciences for latest neuroscientific findings