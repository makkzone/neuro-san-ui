/* eslint-disable max-len */
export const BYTEDANCE_QUERY = `
 Organization in question: ByteDance

---
##### Query
[object Object]

##### Response
\`\`\`python
# Organization: ByteDance
# Opportunity: Advertising Optimization
# ByteDance aims to optimize its advertising strategies by predicting the best ad placements and formats to maximize engagement and revenue. This involves analyzing user demographics, behavior, device information, and other contextual factors to tailor advertising actions such as ad frequency, duration, and target audience selection. The outcomes of interest include click-through rate (CTR), conversion rate, and advertising cost.

import pandas as pd
import numpy as np

# Function to generate synthetic data
def generate_advertising_data(num_rows):
    # Context Attributes
    # User Demographics
    age = np.random.choice(['18-24', '25-34', '35-44', '45-54', '55+'], num_rows)  # Age group of the user
    gender = np.random.choice(['Male', 'Female', 'Other'], num_rows)  # Gender of the user
    location = np.random.choice(['Urban', 'Suburban', 'Rural'], num_rows)  # Location type of the user

    # User Behavior
    interaction_history = np.random.choice(['High', 'Medium', 'Low'], num_rows)  # User's past interaction level
    content_preferences = np.random.choice(['Entertainment', 'News', 'Education'], num_rows)  # Preferred content type

    # Device Information
    device_type = np.random.choice(['Mobile', 'Desktop', 'Tablet'], num_rows)  # Type of device used
    operating_system = np.random.choice(['iOS', 'Android', 'Windows', 'MacOS'], num_rows)  # Operating system of the device

    # Time of Interaction
    time_of_day = np.random.choice(['Morning', 'Afternoon', 'Evening', 'Night'], num_rows)  # Time of day of interaction
    day_of_week = np.random.choice(['Weekday', 'Weekend'], num_rows)  # Day of the week of interaction

    # Ad Type
    ad_type = np.random.choice(['Video', 'Banner', 'SponsoredContent'], num_rows)  # Type of advertisement

    # Ad Placement
    ad_placement = np.random.choice(['Feed', 'Stories', 'SearchResults'], num_rows)  # Placement of the advertisement

    # User Engagement Level
    user_engagement_level = np.random.choice(['High', 'Medium', 'Low'], num_rows)  # Current engagement level of the user

    # Previous Ad Interactions
    click_through_rate = np.random.uniform(0.01, 0.3, num_rows)  # Historical click-through rate
    conversion_rate = np.random.uniform(0.01, 0.2, num_rows)  # Historical conversion rate

    # Content Category
    content_category = np.random.choice(['Entertainment', 'News', 'Education'], num_rows)  # Category of the content

    # Network Connection Type
    network_connection_type = np.random.choice(['WiFi', 'MobileData'], num_rows)  # Type of network connection

    # User Subscription Status
    user_subscription_status = np.random.choice(['Free', 'Premium'], num_rows)  # Subscription status of the user

    # Action Attributes
    ad_frequency = np.random.randint(1, 10, num_rows)  # Number of times the ad is shown
    ad_duration = np.random.randint(5, 60, num_rows)  # Duration of the ad in seconds
    target_audience_selection = np.random.choice(['Broad', 'Narr-next-lineow'], num_rows)  # Target audience selection strategy
    budget_allocation = np.random.uniform(100, 10000, num_rows)  # Budget allocated for the ad
    bidding_strategy = np.random.choice(['CPC', 'CPM', 'CPA'], num_rows)  # Bidding strategy used
    creative_variations = np.random.randint(1, 5, num_rows)  # Number of creative variations used

    # Outcome Attributes
    ctr = click_through_rate + np.random.normal(0, 0.01, num_rows)  # Simulated click-through rate
    conversion_rate_outcome = conversion_rate + np.random.normal(0, 0.01, num_rows)  # Simulated conversion rate
    advertising_cost = budget_allocation * ctr * conversion_rate_outcome  # Calculated advertising cost

    # Create DataFrame
    data = pd.DataFrame({
        'Age': age,
        'Gender': gender,
        'Location': location,
        'InteractionHistory': interaction_history,
        'ContentPreferences': content_preferences,
        'DeviceType': device_type,
        'OperatingSystem': operating_system,
        'TimeOfDay': time_of_day,
        'DayOfWeek': day_of_week,
        'AdType': ad_type,
        'AdPlacement': ad_placement,
        'UserEngagementLevel': user_engagement_level,
        'ClickThroughRate': click_through_rate,
        'ConversionRate': conversion_rate,
        'ContentCategory': content_category,
        'NetworkConnectionType': network_connection_type,
        'UserSubscriptionStatus': user_subscription_status,
        'AdFrequency': ad_frequency,
        'AdDuration': ad_duration,
        'TargetAudienceSelection': target_audience_selection,
        'BudgetAllocation': budget_allocation,
        'BiddingStrategy': bidding_strategy,
        'CreativeVariations': creative_variations,
        'CTR': ctr,
        'ConversionRateOutcome': conversion_rate_outcome,
        'AdvertisingCost': advertising_cost
    })

    return data

# Generate 1000 rows of data
advertising_data = generate_advertising_data(1000)

# Save to CSV
advertising_data.to_csv('bytedance_advertising_data.csv', index=False)
\`\`\`

- **Context Attributes**: These include user demographics, behavior, device information, time of interaction, ad type, ad placement, user engagement level, previous ad interactions, content category, network connection type, and user subscription status.
- **Action Attributes**: These include ad frequency, ad duration, target audience selection, budget allocation, bidding strategy, and creative variations.
- **Outcome Attributes**: These include click-through rate (CTR), conversion rate, and advertising cost.
`
