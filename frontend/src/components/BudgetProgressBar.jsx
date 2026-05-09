import React from 'react';

const BudgetProgressBar = ({ spent, budget }) => {
  const spentNum = parseFloat(spent) || 0;
  const budgetNum = parseFloat(budget) || 0;
  
  // Calculate percentage and cap at 100%
  const percentage = budgetNum > 0 ? Math.min((spentNum / budgetNum) * 100, 100) : 0;
  const remaining = Math.max(budgetNum - spentNum, 0);

  // Use your CSS variables for colors
  const barColor = percentage >= 100 ? "var(--danger)" : "var(--primary-light)";

  return (
    <div style={{ marginTop: '16px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
        <span style={{ color: 'var(--muted)', fontWeight: '600' }}>
          Spent: ${spentNum.toLocaleString()}
        </span>
        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
          Available: ${remaining.toLocaleString()}
        </span>
      </div>

      {/* THE GRAPHIC BAR CONTAINER */}
      <div style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderRadius: '12px', 
        height: '10px', 
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* THE ANIMATED FILLER */}
        <div style={{ 
          width: `${percentage}%`, 
          backgroundColor: barColor, 
          height: '100%', 
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)'
        }} />
      </div>

      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'right' }}>
        {percentage.toFixed(1)}% of ${budgetNum.toLocaleString()} used
      </div>
    </div>
  );
};

export default BudgetProgressBar;