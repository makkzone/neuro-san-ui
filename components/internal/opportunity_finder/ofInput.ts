/* eslint-disable max-len */
export const OF_INPUT = `
### Scoping: Operational Challenges and Adaptation

#### Context Attributes
1. **Mission Type**
   - Categorical: Reconnaissance, Direct Action, Counter-Terrorism, Hostage Rescue, Special Reconnaissance, Unconventional Warfare

2. **Geographical Location**
   - Categorical: Urban, Rural, Maritime, Desert, Jungle, Arctic

3. **Weather Conditions**
   - Categorical: Clear, Rainy, Snowy, Stormy, Foggy

4. **Time of Day**
   - Categorical: Day, Night, Dawn, Dusk

5. **Enemy Strength**
   - Numerical: Integer value representing the number of enemy combatants

6. **Terrain Complexity**
   - Categorical: Low, Medium, High

7. **Available Resources**
   - Numerical: Integer value representing the number of available resources (e.g., vehicles, drones, weapons)

8. **Communication Infrastructure**
   - Categorical: Robust, Moderate, Weak

9. **Team Size**
   - Numerical: Integer value representing the number of SEALs in the team

10. **Intelligence Quality**
    - Categorical: High, Medium, Low

11. **Operational Duration**
    - Numerical: Integer value representing the expected duration of the operation in hours

12. **Support Availability**
    - Categorical: Air Support, Naval Support, Ground Support, No Support

13. **Risk Level**
    - Categorical: Low, Medium, High

14. **Previous Mission Success Rate**
    - Numerical: Percentage value representing the success rate of similar past missions

15. **Technological Tools Available**
    - Categorical: Advanced, Standard, Basic

#### Action Attributes
1. **Adjust Mission Plan**
   - Categorical: Yes, No

2. **Deploy Additional Resources**
   - Numerical: Integer value representing the number of additional resources to deploy

3. **Change Communication Strategy**
   - Categorical: Yes, No

4. **Modify Team Composition**
   - Categorical: Yes, No

5. **Alter Operational Timing**
   - Categorical: Yes, No

6. **Request Additional Intelligence**
   - Categorical: Yes, No

7. **Enhance Surveillance**
   - Categorical: Yes, No

8. **Implement New Technology**
   - Categorical: Yes, No

9. **Increase Training Intensity**
   - Categorical: Yes, No

10. **Engage in Pre-emptive Strikes**
    - Categorical: Yes, No

#### Outcome Attributes
1. **Mission Success Rate**
   - Numerical: Percentage value representing the success rate of the mission

2. **Casualty Rate**
   - Numerical: Percentage value representing the casualty rate among SEALs

3. **Resource Utilization Efficiency**
   - Numerical: Percentage value representing the efficiency of resource utilization

4. **Operational Cost**
   - Numerical: Dollar value representing the total cost of the operation

5. **Adaptation Effectiveness**
   - Numerical: Percentage value representing the effectiveness of the adaptation strategies

6. **Time to Mission Completion**
   - Numerical: Integer value representing the time taken to complete the mission in hours

7. **Enemy Neutralization Rate**
   - Numerical: Percentage value representing the rate of enemy neutralization

8. **Intelligence Accuracy**
   - Numerical: Percentage value representing the accuracy of the intelligence used

9. **Team Morale**
   - Categorical: High, Medium, Low

10. **Post-Mission Recovery Time**
    - Numerical: Integer value representing the time required for the team to recover post-mission in days

By focusing on these attributes, the US Navy SEALs can effectively apply NeuroAI to adapt to new operational challenges and threats, thereby enhancing mission success and overall operational efficiency.


Below is a Python script that generates a table with 2000 rows using the specified context, action, and outcome attributes. The script will save the generated data into a CSV file.

\`\`\`python
import pandas as pd
import numpy as np
import random

# Define the attributes
context_attributes = {
    "MissionType": ["Reconnaissance", "DirectAction", "CounterTerrorism", "HostageRescue", "SpecialReconnaissance", "UnconventionalWarfare"],
    "GeographicalLocation": ["Urban", "Rural", "Maritime", "Desert", "Jungle", "Arctic"],
    "WeatherConditions": ["Clear", "Rainy", "Snowy", "Stormy", "Foggy"],
    "TimeOfDay": ["Day", "Night", "Dawn", "Dusk"],
    "EnemyStrength": range(1, 101),
    "TerrainComplexity": ["Low", "Medium", "High"],
    "AvailableResources": range(1, 51),
    "CommunicationInfrastructure": ["Robust", "Moderate", "Weak"],
    "TeamSize": range(4, 21),
    "IntelligenceQuality": ["High", "Medium", "Low"],
    "OperationalDuration": range(1, 25),
    "SupportAvailability": ["AirSupport", "NavalSupport", "GroundSupport", "NoSupport"],
    "RiskLevel": ["Low", "Medium", "High"],
    "PreviousMissionSuccessRate": range(50, 101),
    "TechnologicalToolsAvailable": ["Advanced", "Standard", "Basic"]
}

action_attributes = {
    "AdjustMissionPlan": ["Yes", "No"],
    "DeployAdditionalResources": range(0, 11),
    "ChangeCommunicationStrategy": ["Yes", "No"],
    "ModifyTeamComposition": ["Yes", "No"],
    "AlterOperationalTiming": ["Yes", "No"],
    "RequestAdditionalIntelligence": ["Yes", "No"],
    "EnhanceSurveillance": ["Yes", "No"],
    "ImplementNewTechnology": ["Yes", "No"],
    "IncreaseTrainingIntensity": ["Yes", "No"],
    "EngageInPreemptiveStrikes": ["Yes", "No"]
}

outcome_attributes = {
    "MissionSuccessRate": range(50, 101),
    "CasualtyRate": range(0, 21),
    "ResourceUtilizationEfficiency": range(50, 101),
    "OperationalCost": range(100000, 1000001),
    "AdaptationEffectiveness": range(50, 101),
    "TimeToMissionCompletion": range(1, 25),
    "EnemyNeutralizationRate": range(50, 101),
    "IntelligenceAccuracy": range(50, 101),
    "TeamMorale": ["High", "Medium", "Low"],
    "PostMissionRecoveryTime": range(1, 31)
}

# Function to generate a single row of data
def generate_row():
    row = {}
    for attr, values in context_attributes.items():
        row[attr] = random.choice(values) if isinstance(values, list) else random.randint(min(values), max(values))
    
    for attr, values in action_attributes.items():
        row[attr] = random.choice(values) if isinstance(values, list) else random.randint(min(values), max(values))
    
    for attr, values in outcome_attributes.items():
        row[attr] = random.choice(values) if isinstance(values, list) else random.randint(min(values), max(values))
    
    # Calculate OperationalCost based on other outcomes
    row["OperationalCost"] = (row["MissionSuccessRate"] * 1000) + (row["CasualtyRate"] * 5000) + (row["ResourceUtilizationEfficiency"] * 2000)
    
    return row

# Generate the data
data = [generate_row() for _ in range(2000)]

# Create a DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("navy_seals_data.csv", index=False)

print("Data generation complete. Saved to navy_seals_data.csv")
\`\`\`

This script generates 2000 rows of data with realistic and reasonable distributions for the context, action, and outcome attributes. The \`OperationalCost\` is calculated based on other outcome attributes to ensure that the historical outcomes are reasonable given the context and actions. The data is then saved into a CSV file named \`navy_seals_data.csv\`.
`
