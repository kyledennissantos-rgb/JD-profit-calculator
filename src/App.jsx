import { useMemo, useState } from 'react'
import './App.css'

const initialIngredients = [
  { id: 1, name: 'Chicken', cost: '52' },
  { id: 2, name: 'Rice', cost: '12' },
  { id: 3, name: 'Vegetables', cost: '8' },
  { id: 4, name: 'Sauce & seasoning', cost: '6' },
]

const initialExpenses = [
  { id: 1, name: 'Packaging', amount: '2500' },
  { id: 2, name: 'Marketing', amount: '3200' },
]

const currencyOptions = [
  { code: 'PHP', label: 'PHP — Philippine peso' },
  { code: 'USD', label: 'USD — US dollar' },
  { code: 'JOD', label: 'JOD — Jordanian dinar' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'GBP', label: 'GBP — British pound' },
]

const amount = (value) => Math.max(0, Number.parseFloat(value) || 0)

function App() {
  const [currency, setCurrency] = useState('PHP')
  const [sellingPrice, setSellingPrice] = useState('240')
  const [itemsSold, setItemsSold] = useState('900')
  const [taxRate, setTaxRate] = useState('6')
  const [salary, setSalary] = useState('42000')
  const [rent, setRent] = useState('18000')
  const [utilities, setUtilities] = useState('6500')
  const [targetProfit, setTargetProfit] = useState('100000')
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [expenses, setExpenses] = useState(initialExpenses)

  const calculations = useMemo(() => {
    const price = amount(sellingPrice)
    const sold = Math.floor(amount(itemsSold))
    const tax = Math.min(amount(taxRate), 100) / 100
    const ingredientCost = ingredients.reduce((sum, item) => sum + amount(item.cost), 0)
    const fixedCosts =
      amount(salary) +
      amount(rent) +
      amount(utilities) +
      expenses.reduce((sum, item) => sum + amount(item.amount), 0)
    const revenue = price * sold
    const taxes = revenue * tax
    const ingredientSpend = ingredientCost * sold
    const operatingCosts = fixedCosts + taxes + ingredientSpend
    const profit = revenue - operatingCosts
    const contributionPerItem = price * (1 - tax) - ingredientCost
    const breakEvenItems =
      contributionPerItem > 0 ? Math.ceil(fixedCosts / contributionPerItem) : null
    const targetItems =
      contributionPerItem > 0
        ? Math.ceil((fixedCosts + amount(targetProfit)) / contributionPerItem)
        : null

    return {
      price,
      sold,
      ingredientCost,
      fixedCosts,
      revenue,
      taxes,
      ingredientSpend,
      operatingCosts,
      profit,
      contributionPerItem,
      breakEvenItems,
      targetItems,
      margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    }
  }, [
    expenses,
    ingredients,
    itemsSold,
    rent,
    salary,
    sellingPrice,
    targetProfit,
    taxRate,
    utilities,
  ])

  const formatMoney = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0)

  const updateIngredient = (id, field, value) => {
    setIngredients((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const updateExpense = (id, field, value) => {
    setExpenses((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const addIngredient = () => {
    setIngredients((current) => [
      ...current,
      { id: Date.now() + Math.random(), name: '', cost: '' },
    ])
  }

  const addExpense = () => {
    setExpenses((current) => [
      ...current,
      { id: Date.now() + Math.random(), name: '', amount: '' },
    ])
  }

  const removeIngredient = (id) => {
    setIngredients((current) => current.filter((item) => item.id !== id))
  }

  const removeExpense = (id) => {
    setExpenses((current) => current.filter((item) => item.id !== id))
  }

  const costBarWidth =
    calculations.revenue > 0
      ? Math.min((calculations.operatingCosts / calculations.revenue) * 100, 100)
      : 0
  const targetProgress =
    calculations.targetItems > 0
      ? Math.min((calculations.sold / calculations.targetItems) * 100, 100)
      : 0

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="JD Profit Calculator home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M6 23.5 13.1 8l4.3 9.2 3-5.2L26 23.5H6Z" fill="currentColor" />
              <path d="M6 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>JD</strong>
            <span>PROFIT CALCULATOR</span>
          </span>
        </a>

        <p className="sidebar-label">WORKSPACE</p>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#overview">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="4" rx="1.5" /><rect x="13.5" y="10.5" width="7" height="10" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /></svg>
            Overview
          </a>
          <a className="nav-link" href="#cost-inputs">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5h16M4 12h16M4 17.5h10" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
            Cost inputs
          </a>
          <a className="nav-link" href="#expenses">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14a1 1 0 0 1 1 1v14l-3-2-3 2-3-2-3 2-3-2-2 1.3V5.5a1 1 0 0 1 1-1Z" /><path d="M8 9h8M8 13h5" /></svg>
            Expenses
          </a>
          <a className="nav-link" href="#profit-target">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5h16M6.5 16V11m5 5V5m5 11V8m5 8v-3" /></svg>
            Profit target
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <span className="tip-icon" aria-hidden="true">✦</span>
            <strong>Small steps, bigger margins.</strong>
            <p>Keep your costs up to date to make every decision count.</p>
          </div>
          <div className="profile">
            <span className="avatar">JD</span>
            <span className="profile-copy"><strong>My business</strong><span>Owner workspace</span></span>
            <span className="profile-dots" aria-hidden="true">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
          <label className="currency-select">
            <span className="currency-symbol" aria-hidden="true">₱</span>
            <span className="sr-only">Display currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>{option.label}</option>
              ))}
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </label>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">YOUR BUSINESS AT A GLANCE</p>
              <h1>Know your numbers.<br /><span>Grow with confidence.</span></h1>
              <p className="page-intro">A clearer picture of what it takes to run your food business.</p>
            </div>
            <div className="period-pill"><span className="period-dot" /> Monthly estimate</div>
          </section>

          <section className="metrics-grid" aria-label="Monthly financial summary">
            <article className="metric-card capital-card">
              <div className="metric-top"><span className="metric-label">Operating capital</span><span className="metric-icon pale-green" aria-hidden="true">↗</span></div>
              <strong className="metric-value">{formatMoney(calculations.operatingCosts)}</strong>
              <span className="metric-foot">Ingredients, taxes & monthly expenses</span>
              <div className="metric-accent"><span style={{ width: `${Math.max(costBarWidth, 4)}%` }} /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-label">Monthly revenue</span><span className="metric-icon pale-blue" aria-hidden="true">↗</span></div>
              <strong className="metric-value">{formatMoney(calculations.revenue)}</strong>
              <span className="metric-foot">From {calculations.sold.toLocaleString()} items sold</span>
              <div className="metric-accent blue-accent"><span style={{ width: `${Math.max(100 - costBarWidth, 4)}%` }} /></div>
            </article>
            <article className={`metric-card ${calculations.profit < 0 ? 'loss-card' : 'profit-card'}`}>
              <div className="metric-top"><span className="metric-label">Estimated net profit</span><span className="metric-icon pale-amber" aria-hidden="true">✳</span></div>
              <strong className="metric-value">{formatMoney(calculations.profit)}</strong>
              <span className="metric-foot">{calculations.margin.toFixed(1)}% net profit margin</span>
              <div className="metric-accent amber-accent"><span style={{ width: `${Math.max(Math.min(Math.abs(calculations.margin), 100), 4)}%` }} /></div>
            </article>
          </section>

          <div className="dashboard-grid">
            <div className="input-column">
              <section className="panel" id="cost-inputs">
                <div className="panel-heading">
                  <div className="panel-title-wrap">
                    <span className="section-icon green-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 8.5h16v11H4zM7 8.5V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2.5M8 12h8" /></svg>
                    </span>
                    <div><h2>Product & sales</h2><p>Set your price and monthly sales volume.</p></div>
                  </div>
                  <span className="step-badge">01</span>
                </div>
                <div className="field-grid">
                  <label className="field">
                    <span>Selling price per item</span>
                    <span className="input-wrap"><span className="input-prefix">{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input type="number" min="0" step="0.01" value={sellingPrice} onChange={(event) => setSellingPrice(event.target.value)} /></span>
                  </label>
                  <label className="field">
                    <span>Items sold per month</span>
                    <span className="input-wrap"><input type="number" min="0" step="1" value={itemsSold} onChange={(event) => setItemsSold(event.target.value)} /><span className="input-suffix">items</span></span>
                  </label>
                  <label className="field field-short">
                    <span>Sales tax</span>
                    <span className="input-wrap"><input type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} /><span className="input-suffix">%</span></span>
                    <span className="field-hint">Applied to your sales revenue</span>
                  </label>
                </div>
                <div className="subsection-heading">
                  <div><h3>Ingredient cost per item</h3><p>What goes into one serving?</p></div>
                  <span className="sum-pill">{formatMoney(calculations.ingredientCost)} <span>/ item</span></span>
                </div>
                <div className="ingredient-list">
                  {ingredients.map((ingredient) => (
                    <div className="editable-row" key={ingredient.id}>
                      <label className="sr-only" htmlFor={`ingredient-name-${ingredient.id}`}>Ingredient name</label>
                      <input id={`ingredient-name-${ingredient.id}`} className="row-name" type="text" placeholder="e.g. Cooking oil" value={ingredient.name} onChange={(event) => updateIngredient(ingredient.id, 'name', event.target.value)} />
                      <label className="sr-only" htmlFor={`ingredient-cost-${ingredient.id}`}>Cost per item</label>
                      <span className="row-amount-wrap"><span>{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input id={`ingredient-cost-${ingredient.id}`} type="number" min="0" step="0.01" placeholder="0" value={ingredient.cost} onChange={(event) => updateIngredient(ingredient.id, 'cost', event.target.value)} /></span>
                      <button className="icon-button" type="button" onClick={() => removeIngredient(ingredient.id)} aria-label={`Remove ${ingredient.name || 'ingredient'}`}><span aria-hidden="true">×</span></button>
                    </div>
                  ))}
                </div>
                <button className="text-button" type="button" onClick={addIngredient}><span aria-hidden="true">＋</span> Add ingredient</button>
              </section>

              <section className="panel" id="expenses">
                <div className="panel-heading">
                  <div className="panel-title-wrap">
                    <span className="section-icon orange-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M5 4.5h14v15l-3-1.8-2.5 1.8-3-1.8L8 19.5l-3-1.8v-13.2ZM8 9h8M8 13h5" /></svg>
                    </span>
                    <div><h2>Monthly expenses</h2><p>Fixed costs to keep things running.</p></div>
                  </div>
                  <span className="step-badge">02</span>
                </div>
                <div className="field-grid overhead-grid">
                  <label className="field"><span>Salaries & wages</span><span className="input-wrap"><span className="input-prefix">{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input type="number" min="0" step="0.01" value={salary} onChange={(event) => setSalary(event.target.value)} /></span></label>
                  <label className="field"><span>Rent</span><span className="input-wrap"><span className="input-prefix">{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input type="number" min="0" step="0.01" value={rent} onChange={(event) => setRent(event.target.value)} /></span></label>
                  <label className="field"><span>Utilities & bills</span><span className="input-wrap"><span className="input-prefix">{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input type="number" min="0" step="0.01" value={utilities} onChange={(event) => setUtilities(event.target.value)} /></span></label>
                </div>
                <div className="subsection-heading expenses-subheading">
                  <div><h3>Other expenses</h3><p>Add any costs you want to track.</p></div>
                  <span className="sum-pill">{formatMoney(expenses.reduce((sum, item) => sum + amount(item.amount), 0))} <span>/ month</span></span>
                </div>
                <div className="ingredient-list">
                  {expenses.map((expense) => (
                    <div className="editable-row" key={expense.id}>
                      <label className="sr-only" htmlFor={`expense-name-${expense.id}`}>Expense name</label>
                      <input id={`expense-name-${expense.id}`} className="row-name" type="text" placeholder="e.g. Delivery fees" value={expense.name} onChange={(event) => updateExpense(expense.id, 'name', event.target.value)} />
                      <label className="sr-only" htmlFor={`expense-amount-${expense.id}`}>Monthly expense amount</label>
                      <span className="row-amount-wrap"><span>{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input id={`expense-amount-${expense.id}`} type="number" min="0" step="0.01" placeholder="0" value={expense.amount} onChange={(event) => updateExpense(expense.id, 'amount', event.target.value)} /></span>
                      <button className="icon-button" type="button" onClick={() => removeExpense(expense.id)} aria-label={`Remove ${expense.name || 'expense'}`}><span aria-hidden="true">×</span></button>
                    </div>
                  ))}
                </div>
                <button className="text-button" type="button" onClick={addExpense}><span aria-hidden="true">＋</span> Add an expense</button>
              </section>
            </div>

            <aside className="insights-column" aria-label="Profit insights">
              <section className="panel snapshot-panel">
                <div className="panel-heading compact-heading">
                  <div><p className="eyebrow">THE BIG PICTURE</p><h2>Monthly snapshot</h2></div>
                  <span className="snapshot-calendar" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 4v4m8-4v4M4 10h16" /></svg>
                  </span>
                </div>
                <div className="snapshot-visual">
                  <div className="donut-chart" style={{ '--profit-angle': `${Math.max(0, Math.min(calculations.margin, 100)) * 3.6}deg` }}>
                    <div className="donut-center"><span>NET MARGIN</span><strong>{calculations.margin.toFixed(1)}%</strong></div>
                  </div>
                  <div className="chart-legend">
                    <div><span className="legend-dot revenue-dot" /><span>Revenue</span><strong>{formatMoney(calculations.revenue)}</strong></div>
                    <div><span className="legend-dot cost-dot" /><span>Costs & tax</span><strong>{formatMoney(calculations.operatingCosts)}</strong></div>
                  </div>
                </div>
                <div className="cost-progress">
                  <div className="progress-label"><span>Revenue used for costs</span><strong>{costBarWidth.toFixed(0)}%</strong></div>
                  <div className="progress-track"><span style={{ width: `${costBarWidth}%` }} /></div>
                </div>
                <div className="snapshot-divider" />
                <div className="snapshot-line"><span>Ingredient spend</span><strong>{formatMoney(calculations.ingredientSpend)}</strong></div>
                <div className="snapshot-line"><span>Estimated sales tax</span><strong>{formatMoney(calculations.taxes)}</strong></div>
                <div className="snapshot-line"><span>Monthly fixed costs</span><strong>{formatMoney(calculations.fixedCosts)}</strong></div>
                <div className="snapshot-total"><span>Estimated profit</span><strong>{formatMoney(calculations.profit)}</strong></div>
              </section>

              <section className="target-card" id="profit-target">
                <div className="target-heading">
                  <span className="target-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /><path d="m14.5 9.5 5-5" /><path d="M16 4.5h3.5V8" /></svg>
                  </span>
                  <span className="target-kicker">PLAN YOUR NEXT MILESTONE</span>
                </div>
                <h2>Reach your profit target</h2>
                <p className="target-description">See how many items to sell to cover your costs and hit your goal.</p>
                <label className="target-input-label" htmlFor="target-profit">Monthly profit goal</label>
                <span className="target-input-wrap"><span>{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(0).find((part) => part.type === 'currency')?.value}</span><input id="target-profit" type="number" min="0" step="100" value={targetProfit} onChange={(event) => setTargetProfit(event.target.value)} /></span>
                <div className="target-result">
                  {calculations.targetItems === null ? (
                    <div className="unreachable-message">Your price needs to be higher than your per-item costs and tax to reach a profit target.</div>
                  ) : (
                    <>
                      <div className="target-number"><strong>{calculations.targetItems.toLocaleString()}</strong><span>items to reach your goal</span></div>
                      <div className="target-progress"><span style={{ width: `${targetProgress}%` }} /></div>
                      <p className="target-progress-copy">{calculations.sold.toLocaleString()} of {calculations.targetItems.toLocaleString()} items at your current sales volume</p>
                    </>
                  )}
                </div>
                <div className="break-even-line"><span>Break-even point</span><strong>{calculations.breakEvenItems === null ? 'Not reachable' : `${calculations.breakEvenItems.toLocaleString()} items`}</strong></div>
              </section>
              <p className="disclaimer">Estimates are based on the numbers you enter. Actual results may vary.</p>
            </aside>
          </div>
          <footer className="page-footer"><span>JD Profit Calculator</span><span>Made for the people who make good food.</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
