## ADDED Requirements

### Requirement: Character identity fields are captured
The system SHALL capture the core identity fields defined by the character sheet.

#### Scenario: Create character identity
- **WHEN** a user creates a character
- **THEN** the system stores player name, character name, kin, age category, profession, weakness, and appearance

### Requirement: Base attributes follow Dragonbane rules
The system SHALL represent the six base attributes and their valid ranges.

#### Scenario: Attribute entry
- **WHEN** a character is created
- **THEN** STR, CON, AGL, INT, WIL, and CHA are stored with values between 3 and 18 after modifiers

### Requirement: Derived ratings are computed
The system SHALL compute derived ratings from attributes and kin using the core rules tables.

#### Scenario: Derived ratings update
- **WHEN** a base attribute or kin changes
- **THEN** HP (CON), WP (WIL), movement (kin base + AGL modifier), damage bonus (STR/AGL brackets), and carrying capacity (STR/2 round up) are recalculated

### Requirement: Skills compute base chance and trained values
The system SHALL compute skill values from attribute brackets and training rules.

#### Scenario: Trained skills
- **WHEN** a user selects trained skills
- **THEN** each trained skill value is set to 2x its base chance and untrained skills remain at base chance

### Requirement: Trained skill slots follow age rules
The system SHALL enforce trained skill slot counts by age category.

#### Scenario: Age-based skill slots
- **WHEN** the user selects age category
- **THEN** total trained skills equal 8 (young), 10 (middle-aged), or 12 (old), with 6 from profession and remaining as free choices

### Requirement: Conditions are tracked
The system SHALL track the six core conditions linked to attributes.

#### Scenario: Condition assignment
- **WHEN** a condition is applied or removed
- **THEN** it is reflected in the character sheet state and linked to the correct attribute

### Requirement: Equipment and encumbrance are represented
The system SHALL represent weapons, armor, inventory slots, and encumbrance rules.

#### Scenario: Encumbrance limits
- **WHEN** inventory items are added
- **THEN** used slots are compared to carrying capacity and over-capacity is detectable

### Requirement: Rest and recovery fields are tracked
The system SHALL track HP/WP and rest-related recovery fields.

#### Scenario: HP/WP tracking
- **WHEN** HP or WP changes
- **THEN** current and max values are stored alongside rest-related fields
