/* eslint-disable max-len */
export const SONY_INPUT = `
### Scoping the Use Case: Rewards Program Optimization

#### Context Attributes

1. **User Demographics**
   - Age: Integer
   - Gender: {Male, Female, Non-binary, Prefer not to say}
   - Location: {Country, State/Province, City}
   - Income Level: {Low, Medium, High}

2. **Purchase History**
   - Total Amount Spent: Integer (in USD)
   - Number of Purchases: Integer
   - Types of Products Purchased: {Games, Consoles, Accessories, Subscriptions}
   - Frequency of Purchases: {Daily, Weekly, Monthly, Yearly}

3. **Gaming Activity**
   - Total Hours Played: Integer
   - Number of Games Played: Integer
   - Types of Games Played: {Action, Adventure, RPG, Sports, Puzzle, etc.}
   - Average Session Length: Integer (in minutes)
   - In-Game Achievements: Integer

4. **Engagement Metrics**
   - Number of Logins per Month: Integer
   - Participation in Events: {Yes, No}
   - Social Interactions: {High, Medium, Low}

5. **Reward Program Participation**
   - Membership Duration: Integer (in months)
   - Number of Rewards Redeemed: Integer
   - Types of Rewards Redeemed: {Discounts, Free Games, Merchandise, In-Game Items}
   - Points Accumulated: Integer

6. **User Feedback**
   - Satisfaction Score: Integer (1-100)
   - Number of Complaints: Integer
   - Types of Complaints: {Reward Availability, Reward Value, Program Usability}

7. **Marketing Interaction**
   - Response to Promotions: {Positive, Neutral, Negative}
   - Click-Through Rate on Emails: Percentage
   - Participation in Surveys: {Yes, No}

8. **Social Media Activity**
   - Number of Followers: Integer
   - Number of Posts: Integer
   - Engagement Rate: Percentage

9. **Device Usage**
   - Primary Device Used: {PS4, PS5, PC, Mobile}
   - Number of Devices Linked: Integer
   - Average Device Usage Time: Integer (in hours)

10. **Subscription Status**
    - Subscription Type: {PS Plus, PS Now, None}
    - Subscription Duration: Integer (in months)
    - Renewal Rate: Percentage

#### Action Attributes

1. **Types of Rewards Offered**
   - {Discounts, Free Games, Merchandise, In-Game Items, Exclusive Content}

2. **Frequency of Rewards**
   - {Daily, Weekly, Monthly, Quarterly, Yearly}

3. **Point Conversion Rates**
   - Points to USD Conversion: Float
   - Points Required for Rewards: Integer

4. **Personalization of Rewards**
   - {High, Medium, Low}

5. **Reward Notification Methods**
   - {Email, SMS, In-App Notification, Social Media}

#### Outcome Attributes

1. **User Engagement**
   - Number of Active Users: Integer
   - Average Session Length: Integer (in minutes)
   - Frequency of Logins: Integer (per month)

2. **Reward Redemption Rates**
   - Total Rewards Redeemed: Integer
   - Redemption Rate: Percentage
   - Types of Rewards Redeemed: {Discounts, Free Games, Merchandise, In-Game Items}

3. **Customer Satisfaction**
   - Satisfaction Score: Integer (1-100)
   - Net Promoter Score (NPS): Integer
   - Number of Positive Reviews: Integer

4. **Cost of Rewards Program**
   - Total Cost of Rewards: Integer (in USD)
   - Cost per User: Float (in USD)
   - Cost per Redemption: Float (in USD)

### Conclusion

By scoping the use case for optimizing the PlayStation Stars Rewards Program, we have identified key context, action, and outcome attributes. These attributes will help in designing and implementing a NeuroAI solution to enhance user engagement, increase reward redemption rates, and improve customer satisfaction while managing the cost of the rewards program effectively.
Below is a Python script to generate a table with 2000 rows using the scoped attributes for the PlayStation Stars Rewards Program optimization. The script will generate realistic and reasonable data for context, action, and outcome attributes, and save the data into a CSV file.

\`\`\`python
import pandas as pd
import numpy as np
import random

# Define the number of rows
num_rows = 2000

# Define the context attributes
context_attributes = {
    "Age": np.random.randint(18, 60, num_rows),
    "Gender": np.random.choice(["Male", "Female", "Non-binary", "Prefer not to say"], num_rows),
    "Location": np.random.choice(["USA", "Canada", "UK", "Germany", "France", "Japan", "Australia"], num_rows),
    "IncomeLevel": np.random.choice(["Low", "Medium", "High"], num_rows),
    "TotalAmountSpent": np.random.randint(0, 5000, num_rows),
    "NumberOfPurchases": np.random.randint(0, 100, num_rows),
    "TypesOfProductsPurchased": np.random.choice(["Games", "Consoles", "Accessories", "Subscriptions"], num_rows),
    "FrequencyOfPurchases": np.random.choice(["Daily", "Weekly", "Monthly", "Yearly"], num_rows),
    "TotalHoursPlayed": np.random.randint(0, 10000, num_rows),
    "NumberOfGamesPlayed": np.random.randint(0, 200, num_rows),
    "TypesOfGamesPlayed": np.random.choice(["Action", "Adventure", "RPG", "Sports", "Puzzle"], num_rows),
    "AverageSessionLength": np.random.randint(0, 300, num_rows),
    "InGameAchievements": np.random.randint(0, 1000, num_rows),
    "NumberOfLoginsPerMonth": np.random.randint(0, 100, num_rows),
    "ParticipationInEvents": np.random.choice(["Yes", "No"], num_rows),
    "SocialInteractions": np.random.choice(["High", "Medium", "Low"], num_rows),
    "MembershipDuration": np.random.randint(0, 60, num_rows),
    "NumberOfRewardsRedeemed": np.random.randint(0, 50, num_rows),
    "TypesOfRewardsRedeemed": np.random.choice(["Discounts", "Free Games", "Merchandise", "In-Game Items"], num_rows),
    "PointsAccumulated": np.random.randint(0, 10000, num_rows),
    "SatisfactionScore": np.random.randint(1, 100, num_rows),
    "NumberOfComplaints": np.random.randint(0, 20, num_rows),
    "TypesOfComplaints": np.random.choice(["Reward Availability", "Reward Value", "Program Usability"], num_rows),
    "ResponseToPromotions": np.random.choice(["Positive", "Neutral", "Negative"], num_rows),
    "ClickThroughRateOnEmails": np.random.uniform(0, 100, num_rows),
    "ParticipationInSurveys": np.random.choice(["Yes", "No"], num_rows),
    "NumberOfFollowers": np.random.randint(0, 10000, num_rows),
    "NumberOfPosts": np.random.randint(0, 500, num_rows),
    "EngagementRate": np.random.uniform(0, 100, num_rows),
    "PrimaryDeviceUsed": np.random.choice(["PS4", "PS5", "PC", "Mobile"], num_rows),
    "NumberOfDevicesLinked": np.random.randint(1, 5, num_rows),
    "AverageDeviceUsageTime": np.random.randint(0, 24, num_rows),
    "SubscriptionType": np.random.choice(["PS Plus", "PS Now", "None"], num_rows),
    "SubscriptionDuration": np.random.randint(0, 60, num_rows),
    "RenewalRate": np.random.uniform(0, 100, num_rows)
}

# Define the action attributes
action_attributes = {
    "TypesOfRewardsOffered": np.random.choice(["Discounts", "Free Games", "Merchandise", "In-Game Items", "Exclusive Content"], num_rows),
    "FrequencyOfRewards": np.random.choice(["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"], num_rows),
    "PointsToUSDConversion": np.random.uniform(0.01, 0.1, num_rows),
    "PointsRequiredForRewards": np.random.randint(100, 10000, num_rows),
    "PersonalizationOfRewards": np.random.choice(["High", "Medium", "Low"], num_rows),
    "RewardNotificationMethods": np.random.choice(["Email", "SMS", "In-App Notification", "Social Media"], num_rows)
}

# Define the outcome attributes
outcome_attributes = {
    "NumberOfActiveUsers": np.random.randint(0, 1000000, num_rows),
    "AverageSessionLengthOutcome": np.random.randint(0, 300, num_rows),
    "FrequencyOfLoginsOutcome": np.random.randint(0, 100, num_rows),
    "TotalRewardsRedeemedOutcome": np.random.randint(0, 10000, num_rows),
    "RedemptionRate": np.random.uniform(0, 100, num_rows),
    "TypesOfRewardsRedeemedOutcome": np.random.choice(["Discounts", "Free Games", "Merchandise", "In-Game Items"], num_rows),
    "SatisfactionScoreOutcome": np.random.randint(1, 100, num_rows),
    "NetPromoterScore": np.random.randint(-100, 100, num_rows),
    "NumberOfPositiveReviews": np.random.randint(0, 1000, num_rows),
    "TotalCostOfRewards": np.random.randint(0, 1000000, num_rows),
    "CostPerUser": np.random.uniform(0, 100, num_rows),
    "CostPerRedemption": np.random.uniform(0, 100, num_rows)
}

# Combine all attributes into a single DataFrame
data = {**context_attributes, **action_attributes, **outcome_attributes}
df = pd.DataFrame(data)

# Save the DataFrame to a CSV file
df.to_csv("playstation_rewards_program_data.csv", index=False)

print("Data generation complete. The file 'playstation_rewards_program_data.csv' has been saved.")
\`\`\`

This script generates 2000 rows of data with realistic and reasonable values for the context, action, and outcome attributes related to the PlayStation Stars Rewards Program optimization. The data is then saved into a CSV file named \`playstation_rewards_program_data.csv\`. opportunity_finder.tsx:310:16
`
