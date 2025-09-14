import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


---

File: src/data.js (mock JSON)

export const DISHES = [
  // small sample derived from your PDF — add more entries as needed
  {
    id: 1,
    name: 'Kadhai Paneer 1',
    mealType: 'MAIN COURSE',
    type: 'VEG',
    description: 'Paneer cubes in spicy onion gravy with onions and capsicum cubes.',
    image: null,
  },
  {
    id: 2,
    name: 'Kadhai Paneer 2',
    mealType: 'MAIN COURSE',
    type: 'VEG',
    description: 'Same delicious paneer variant.',
    image: null,
  },
  {
    id: 101,
    name: 'Garlic Bread',
    mealType: 'STARTER',
    type: 'VEG',
    description: 'Toasted bread with garlic butter.',
    image: null,
  },
  {
    id: 201,
    name: 'Gulab Jamun',
    mealType: 'DESSERT',
    type: 'VEG',
    description: 'Sweet dumplings in syrup.',
    image: null,
  },
  {
    id: 301,
    name: 'French Fries',
    mealType: 'SIDES',
    type: 'VEG',
    description: 'Crispy potato fries.',
    image: null,
  },
  {
    id: 401,
    name: 'Chicken Wings',
    mealType: 'STARTER',
    type: 'NON_VEG',
    description: 'Spicy chicken wings.',
    image: null,
  },
];

export const INGREDIENTS = {
  1: [
    { name: 'Paneer', qty: '250 g' },
    { name: 'Onion', qty: '1 large' },
    { name: 'Capsicum', qty: '1 medium' },
  ],
  2: [
    { name: 'Paneer', qty: '260 g' },
    { name: 'Spices', qty: '20 g' },
  ],
  101: [
    { name: 'Bread slices', qty: '4' },
    { name: 'Garlic butter', qty: '30 g' },
  ],
  201: [
    { name: 'Milk powder', qty: '100 g' },
    { name: 'Sugar syrup', qty: '100 ml' },
  ],
  301: [
    { name: 'Potatoes', qty: '300 g' },
    { name: 'Salt', qty: '5 g' },
  ],
  401: [
    { name: 'Chicken', qty: '500 g' },
    { name: 'Hot sauce', qty: '30 ml' },
  ],
};


---

File: src/App.jsx

import React, { useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DISHES, INGREDIENTS } from './data';
import DishList from './components/DishList';
import IngredientDetail from './components/IngredientDetail';
import SummaryBar from './components/SummaryBar';

const MEAL_TABS = ['STARTER', 'MAIN COURSE', 'DESSERT', 'SIDES'];

export default function App() {
  const [activeMeal, setActiveMeal] = useState('MAIN COURSE');
  const [search, setSearch] = useState('');
  const [filterVeg, setFilterVeg] = useState(true);
  const [filterNonVeg, setFilterNonVeg] = useState(true);
  const [selected, setSelected] = useState({}); // { dishId: true }

  const navigate = useNavigate();

  const mealCounts = useMemo(() => {
    const counts = {};
    MEAL_TABS.forEach((m) => (counts[m] = 0));
    Object.keys(selected).forEach((idStr) => {
      const id = parseInt(idStr, 10);
      const d = DISHES.find((x) => x.id === id);
      if (d) counts[d.mealType] = (counts[d.mealType] || 0) + 1;
    });
    return counts;
  }, [selected]);

  const totalSelected = Object.keys(selected).length;

  const toggleSelect = (dishId) => {
    setSelected((prev) => {
      const clone = { ...prev };
      if (clone[dishId]) delete clone[dishId];
      else clone[dishId] = true;
      return clone;
    });
  };

  return (
    <div className="app-root">
      <h1>Party Menu Selection</h1>
      <Routes>
        <Route
          path="/"
          element={(
            <DishList
              dishes={DISHES}
              activeMeal={activeMeal}
              setActiveMeal={setActiveMeal}
              MEAL_TABS={MEAL_TABS}
              search={search}
              setSearch={setSearch}
              filterVeg={filterVeg}
              setFilterVeg={setFilterVeg}
              filterNonVeg={filterNonVeg}
              setFilterNonVeg={setFilterNonVeg}
              selected={selected}
              toggleSelect={toggleSelect}
              navigate={navigate}
              mealCounts={mealCounts}
            />
          )}
        />
        <Route
          path="/ingredient/:id"
          element={<IngredientDetail ingredients={INGREDIENTS} dishes={DISHES} />}
        />
      </Routes>

      <SummaryBar mealCounts={mealCounts} totalSelected={totalSelected} />
    </div>
  );
}


---

File: src/components/DishList.jsx

import React from 'react';
import Tabs from './Tabs';
import SearchBar from './SearchBar';
import DishCard from './DishCard';

export default function DishList({
  dishes,
  activeMeal,
  setActiveMeal,
  MEAL_TABS,
  search,
  setSearch,
  filterVeg,
  setFilterVeg,
  filterNonVeg,
  setFilterNonVeg,
  selected,
  toggleSelect,
  navigate,
  mealCounts,
}) {
  const filtered = dishes.filter((d) => d.mealType === activeMeal)
    .filter((d) => {
      if (!filterVeg && d.type === 'VEG') return false;
      if (!filterNonVeg && d.type === 'NON_VEG') return false;
      return true;
    })
    .filter((d) => d.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div>
      <Tabs
        tabs={MEAL_TABS}
        active={activeMeal}
        onChange={setActiveMeal}
        mealCounts={mealCounts}
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
        filterVeg={filterVeg}
        setFilterVeg={setFilterVeg}
        filterNonVeg={filterNonVeg}
        setFilterNonVeg={setFilterNonVeg}
      />

      <div className="dish-grid">
        {filtered.length === 0 && <div className="empty">No dishes match your filters.</div>}
        {filtered.map((d) => (
          <DishCard
            key={d.id}
            dish={d}
            isSelected={!!selected[d.id]}
            toggleSelect={() => toggleSelect(d.id)}
            onIngredient={() => navigate(/ingredient/${d.id})}
          />
        ))}
      </div>
    </div>
  );
}


---

File: src/components/Tabs.jsx

import React from 'react';

export default function Tabs({ tabs, active, onChange, mealCounts }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t}
          className={"tab" + (active === t ? ' active' : '')}
          onClick={() => onChange(t)}
        >
          <div>{t}</div>
          <div className="count">{mealCounts[t] || 0}</div>
        </button>
      ))}
    </div>
  );
}


---

File: src/components/SearchBar.jsx

import React from 'react';

export default function SearchBar({ search, setSearch, filterVeg, setFilterVeg, filterNonVeg, setFilterNonVeg }) {
  return (
    <div className="controls">
      <input
        placeholder="Search dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="toggles">
        <label>
          <input type="checkbox" checked={filterVeg} onChange={(e) => setFilterVeg(e.target.checked)} /> Veg
        </label>
        <label>
          <input type="checkbox" checked={filterNonVeg} onChange={(e) => setFilterNonVeg(e.target.checked)} /> Non-Veg
        </label>
      </div>
    </div>
  );
}


---

File: src/components/DishCard.jsx

import React from 'react';

export default function DishCard({ dish, isSelected, toggleSelect, onIngredient }) {
  return (
    <div className={"dish-card" + (isSelected ? ' selected' : '')}>
      <div className="image-placeholder">{dish.image ? <img src={dish.image} alt={dish.name} /> : <div>Img</div>}</div>
      <div className="dish-info">
        <h3>{dish.name}</h3>
        <p className="desc">{dish.description}</p>
        <div className="actions">
          <button onClick={toggleSelect}>{isSelected ? 'Remove' : 'Add'}</button>
          <button className="link" onClick={onIngredient}>Ingredient</button>
        </div>
      </div>
    </div>
  );
}


---

File: src/components/IngredientDetail.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function IngredientDetail({ ingredients, dishes }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dishId = parseInt(id, 10);
  const dish = dishes.find((d) => d.id === dishId) || { name: 'Unknown', description: '' };
  const list = ingredients[dishId] || [];

  return (
    <div className="ingredient-screen">
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{dish.name}</h2>
      <p>{dish.description}</p>

      <h3>Ingredients</h3>
      <ul>
        {list.map((it, idx) => (
          <li key={idx}>{it.name} — {it.qty}</li>
        ))}
        {list.length === 0 && <li>No ingredient data available.</li>}
      </ul>
    </div>
  );
}


---

File: src/components/SummaryBar.jsx

import React from 'react';

export default function SummaryBar({ mealCounts, totalSelected }) {
  return (
    <div className="summary-bar">
      <div className="per-meal">
        {Object.keys(mealCounts).map((m) => (
          <div key={m} className="meal-count">
            <div className="meal-name">{m}</div>
            <div className="count">{mealCounts[m]}</div>
          </div>
        ))}
      </div>

      <div className="right">
        <div className="total">Total: {totalSelected}</div>
        <button className="continue">Continue</button>
      </div>
    </div>
  );
}


---

File: src/styles.css

body { font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; padding: 20px; }
.app-root { max-width: 900px; margin: 0 auto; }
.tabs { display:flex; gap:8px; margin-bottom:12px; }
.tab{ padding:8px 12px; border-radius:8px; border:1px solid #ddd; background:#fafafa; display:flex; align-items:center; gap:8px; }
.tab.active{ background:#111; color:#fff; }
.count{ font-size:12px; opacity:0.9 }
.controls{ display:flex; justify-content:space-between; gap:12px; margin-bottom:12px }
.controls input[type='text'], .controls input{ padding:8px; flex:1 }
.toggles{ display:flex; gap:12px; align-items:center }
.dish-grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:12px }
.dish-card{ border:1px solid #ddd; border-radius:8px; padding:12px; display:flex; gap:12px; align-items:flex-start }
.dish-card.selected{ box-shadow:0 0 0 3px rgba(0,128,0,0.06); border-color:green }
.image-placeholder{ width:72px; height:72px; background:#eee; display:flex; align-items:center; justify-content:center; border-radius:6px }
.dish-info h3{ margin:0 0 6px }
.desc{ margin:0 0 10px; color:#555 }
.actions{ display:flex; gap:8px }
.actions button.link{ background:none; border:none; text-decoration:underline; cursor:pointer }
.summary-bar{ position:fixed; left:20px; right:20px; bottom:20px; background:#fff; border:1px solid #ddd; padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center }
.meal-count{ display:flex; gap:8px; align-items:center; margin-right:8px }
.right{ display:flex; gap:12px; align-items:center }
.continue{ padding:8px 12px }
.empty{ padding:12px; color:#666 }


---

Minimal Plain JS Version (single-file)

Run Instructions (plain js)

Save the block below into index.html and open in browser.

File: index.html (minimal)

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Party Menu - Minimal JS</title>
  <style>
    body{ font-family: Arial; padding:20px }
    .tabs button{ margin-right:8px }
    .dish{ border:1px solid #ddd; padding:8px; margin-bottom:8px }
    .selected{ background:#e8ffe8 }
  </style>
</head>
<body>
  <h1>Party Menu (Minimal)</h1>
  <div class="tabs"></div>
  <input id="search" placeholder="Search..." />
  <label><input id="veg" type="checkbox" checked /> Veg</label>
  <label><input id="nonveg" type="checkbox" checked /> Non-Veg</label>

  <div id="list"></div>
  <div id="summary">Total: 0</div>

<script>
const DISHES = [
  { id:1, name:'Kadhai Paneer', mealType:'MAIN COURSE', type:'VEG', description:'Yummy' },
  { id:2, name:'Chicken Wings', mealType:'STARTER', type:'NON_VEG', description:'Spicy' },
  { id:3, name:'Gulab Jamun', mealType:'DESSERT', type:'VEG', description:'Sweet' },
];
const TABS = ['STARTER','MAIN COURSE','DESSERT','SIDES'];
let active='MAIN COURSE';
let selected = new Set();

const tabsDiv = document.querySelector('.tabs');
const listDiv = document.getElementById('list');
const summaryDiv = document.getElementById('summary');
const searchInput = document.getElementById('search');
const vegCheck = document.getElementById('veg');
const nonvegCheck = document.getElementById('nonveg');

function renderTabs(){
  tabsDiv.innerHTML='';
  TABS.forEach(t=>{
    const b=document.createElement('button');
    b.textContent=t;
    if(t===active)b.style.fontWeight='bold';
    b.onclick=()=>{ active=t; render(); };
    tabsDiv.appendChild(b);
  });
}

function render(){
  renderTabs();
  const q=searchInput.value.trim().toLowerCase();
  listDiv.innerHTML='';
  const filtered = DISHES.filter(d=>d.mealType===active)
    .filter(d=> (vegCheck.checked || d.type!=='VEG') )
    .filter(d=> (nonvegCheck.checked || d.type!=='NON_VEG') )
    .filter(d=> d.name.toLowerCase().includes(q));
  filtered.forEach(d=>{
    const div=document.createElement('div');
    div.className='dish' + (selected.has(d.id)?' selected':'');
    div.innerHTML=<strong>${d.name}</strong><p>${d.description}</p>;
    const btn=document.createElement('button');
    btn.textContent = selected.has(d.id)?'Remove':'Add';
    btn.onclick=()=>{ if(selected.has(d.id))selected.delete(d.id);else selected.add(d.id); render(); }
    const ing=document.createElement('button');
    ing.textContent='Ingredient';
    ing.onclick=()=>alert('Ingredients for '+d.name+' (mock)');
    div.appendChild(btn); div.appendChild(ing);
    listDiv.appendChild(div);
  });
  summaryDiv.textContent = 'Total: '+selected.size;
}

searchInput.oninput=render;
vegCheck.onchange=render;
nonvegCheck.onchange=render;

render();
</script>
</body>
</html>




