/* eslint-disable max-len */
export const SONY_INPUT = `
\`\`\`python
# Sony
# Opportunity: Optimizing the supply chain to avoid costs incurred from business disruption and generate business value.
# This script generates a table with 1500 rows of historical data for supply chain management at Sony.
# The data includes context, action, and outcome attributes to help in training a NeuroAI model for supply chain optimization.

import pandas as pd
import numpy as np

# Number of rows to generate
num_rows = 1500

# Context Attributes
# CurrentSupplyChainCost: The total annual cost incurred by the supply chain operations.
current_supply_chain_cost = np.random.randint(400, 600, num_rows)

# SupplyChainDisruptions: The level of disruptions experienced in the supply chain.
supply_chain_disruptions = np.random.choice(["None", "Minor", "Moderate", "Severe"], num_rows, p=[0.4, 0.3, 0.2, 0.1])

# SupplierReliability: The reliability of suppliers in terms of timely delivery and quality.
supplier_reliability = np.random.choice(["High", "Medium", "Low"], num_rows, p=[0.5, 0.3, 0.2])

# InventoryLevels: The current levels of inventory across different stages of the supply chain.
inventory_levels = np.random.randint(50, 200, num_rows)

# LeadTime: The average time taken from placing an order to receiving the goods.
lead_time = np.random.randint(10, 60, num_rows)

# DemandForecastAccuracy: The accuracy of demand forecasts compared to actual demand.
demand_forecast_accuracy = np.random.uniform(70, 100, num_rows)

# TransportationCosts: The total cost incurred for transportation within the supply chain.
transportation_costs = np.random.randint(50, 150, num_rows)

# WarehouseUtilization: The percentage of warehouse space currently utilized.
warehouse_utilization = np.random.uniform(50, 100, num_rows)

# ProductionCapacity: The maximum production capacity of manufacturing units.
production_capacity = np.random.randint(100, 500, num_rows)

# GeopoliticalRisks: The level of geopolitical risks affecting the supply chain.
geopolitical_risks = np.random.choice(["Low", "Medium", "High"], num_rows, p=[0.6, 0.3, 0.1])

# TechnologyAdoption: The level of technology adoption in the supply chain processes.
technology_adoption = np.random.choice(["Low", "Medium", "High"], num_rows, p=[0.3, 0.4, 0.3])

# Action Attributes
# OptimizationAlgorithms: The type of optimization algorithms used for supply chain management.
optimization_algorithms = np.random.choice(["LinearProgramming", "GeneticAlgorithms", "NeuralNetworks"], num_rows, p=[0.4, 0.3, 0.3])

# SupplierSelection: The strategy for selecting suppliers.
supplier_selection = np.random.choice(["CurrentSuppliers", "NewSuppliers", "Mixed"], num_rows, p=[0.5, 0.2, 0.3])

# InventoryManagementStrategy: The strategy for managing inventory levels.
inventory_management_strategy = np.random.choice(["JustInTime", "SafetyStock", "Mixed"], num_rows, p=[0.4, 0.3, 0.3])

# TransportationMode: The mode of transportation used within the supply chain.
transportation_mode = np.random.choice(["Air", "Sea", "Land", "Mixed"], num_rows, p=[0.2, 0.3, 0.3, 0.2])

# TechnologyInvestments: The amount of investment in new technologies for supply chain optimization.
technology_investments = np.random.randint(1, 20, num_rows)

# RiskMitigationStrategies: The strategies employed to mitigate risks in the supply chain.
risk_mitigation_strategies = np.random.choice(["Insurance", "Diversification", "BufferStock"], num_rows, p=[0.3, 0.4, 0.3])

# Outcome Attributes
# CostReduction: The total reduction in supply chain costs as a result of optimization.
cost_reduction = current_supply_chain_cost * np.random.uniform(0.05, 0.15, num_rows)

# BusinessValueGenerated: The additional business value generated through improved supply chain efficiency.
business_value_generated = np.random.randint(10, 30, num_rows)

# OperationalEfficiency: The improvement in operational efficiency within the supply chain.
operational_efficiency = np.random.uniform(5, 20, num_rows)

# Create DataFrame
data = {
    "CurrentSupplyChainCost": current_supply_chain_cost,
    "SupplyChainDisruptions": supply_chain_disruptions,
    "SupplierReliability": supplier_reliability,
    "InventoryLevels": inventory_levels,
    "LeadTime": lead_time,
    "DemandForecastAccuracy": demand_forecast_accuracy,
    "TransportationCosts": transportation_costs,
    "WarehouseUtilization": warehouse_utilization,
    "ProductionCapacity": production_capacity,
    "GeopoliticalRisks": geopolitical_risks,
    "TechnologyAdoption": technology_adoption,
    "OptimizationAlgorithms": optimization_algorithms,
    "SupplierSelection": supplier_selection,
    "InventoryManagementStrategy": inventory_management_strategy,
    "TransportationMode": transportation_mode,
    "TechnologyInvestments": technology_investments,
    "RiskMitigationStrategies": risk_mitigation_strategies,
    "CostReduction": cost_reduction,
    "BusinessValueGenerated": business_value_generated,
    "OperationalEfficiency": operational_efficiency
}

df = pd.DataFrame(data)

# Save to CSV
df.to_csv("sony_supply_chain_data.csv", index=False)
\`\`\`
`
