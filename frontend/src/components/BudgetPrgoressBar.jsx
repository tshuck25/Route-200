import React from 'react';

const BudgetProgressBar = ({ spent, budget }) => {
  // Calculate percentage, capping it at 100% for the visual width
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  
  // Logic to change color if over budget
  const isOverBudget = spent > budget;
  const barColor = isOverBudget ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="my-4 p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-700">Trip Budget Progress</span>
        <span className="text-sm font-medium text-blue-700">{Math.round(percentage)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className={`h-4 rounded-full transition-all duration-500 ${barColor}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>Spent: ${spent}</span>
        <span>Budget: ${budget}</span>
      </div>
      {isOverBudget && (
        <p className="text-red-600 text-xs mt-1 font-bold">⚠️ Warning: Over Budget!</p>
      )}
    </div>
  );
};

export default BudgetProgressBar;