# Money Saver App - Refined Feature Plan

Based on your feedback, here's a more focused feature set for the MVP with notes for future enhancements:

## Core MVP Features

### 1. Account Management
- **Default Accounts**
  - Cash
  - Bank Account
  - Credit Card
- **Account Operations**
  - Create new custom accounts
  - Edit account details (name, initial balance)
  - Delete accounts
  - View individual account balances
  - View total net worth across all accounts

### 2. Transaction Recording
- **Basic Transaction Types**
  - Income: Money coming in
  - Expense: Money going out
  - Transfer: Moving money between accounts (special transaction type)
- **Transaction Details**
  - Amount
  - Date
  - Account (which account is affected)
  - Category (simple predefined list)
  - Description (optional)

### 3. Simple Categories
- **Income Categories**
  - Salary
  - Other Income
- **Expense Categories**
  - Food
  - Transportation
  - Housing
  - Utilities
  - Entertainment
  - Other

### 4. Daily Tracking
- **Daily Summary**
  - Today's income total
  - Today's expense total
  - Net change for the day
- **Transaction List**
  - Grouped by date
  - Filterable by account and transaction type

### 5. Basic UI Components
- **Dashboard**
  - Account balances overview
  - Quick add transaction button
  - Recent transactions
- **Add Transaction Form**
  - Simple form with required fields
  - Different flows for income, expense, and transfers
- **Transaction History**
  - Chronological list with basic filtering
- **Account Management Screen**
  - List of accounts with balances
  - Add/edit account functionality

## Technical Implementation (MVP)

- **Data Storage**
  - Local storage for all data
  - Simple data structure for accounts and transactions
- **State Management**
  - React Context for global state
  - Consistent balance calculations
- **UI Design**
  - Clean, minimal interface
  - Mobile-friendly responsive design
  - Focus on ease of use

## Future Enhancements (Post-MVP)

1. **Advanced Categorization**
   - Custom categories
   - Subcategories
   - Category budgets

2. **Bill Tracking**
   - Due dates for bills
   - Payment reminders
   - Recurring transaction setup

3. **Reporting & Analytics**
   - Income vs expense charts
   - Spending by category
   - Monthly trends

4. **Budgeting Features**
   - Monthly budget setup
   - Budget vs actual comparison
   - Disposable income calculation

5. **Data Management**
   - Export/import functionality
   - Data backup options
   - Clear/reset options

6. **Enhanced User Experience**
   - Dark/light mode
   - Transaction templates
   - Quick actions

7. **Receipt Attachment**
   - Photo upload for receipts
   - Receipt organization

## Data Structure (for Local Storage)

```javascript
{
  "accounts": [
    {
      "id": "acc-1",
      "name": "Cash",
      "balance": 500,
      "type": "cash",
      "createdAt": "2023-05-15T12:30:00"
    },
    {
      "id": "acc-2",
      "name": "Bank Account",
      "balance": 2500,
      "type": "bank",
      "createdAt": "2023-05-15T12:30:00"
    }
  ],
  "transactions": [
    {
      "id": "tx-1",
      "type": "income", // or "expense" or "transfer"
      "amount": 1000,
      "accountId": "acc-2",
      "category": "salary",
      "description": "Monthly salary",
      "date": "2023-05-15T12:30:00
    },
    {
      "id": "tx-2",
      "type": "expense",
      "amount": 25.50,
      "accountId": "acc-1",
      "category": "food",
      "description": "Lunch",
      "date": "2023-05-15T12:30:00"
    },
    {
      "id": "tx-3",
      "type": "transfer",
      "amount": 200,
      "fromAccountId": "acc-2",
      "toAccountId": "acc-1",
      "description": "ATM withdrawal",
      "date": "2023-05-15T12:30:00"
    }
  ],
  "settings": {
    "currency": "USD",
    "dateFormat": "MM/DD/YYYY"
  }
}
```

Does this refined feature set align with your vision for the MVP? Would you like to adjust any of these features before we move forward with a more detailed specification?