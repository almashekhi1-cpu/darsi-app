/* Renders visual diagrams from Claude's structured diagram data */

export default function DiagramRenderer({ diagram }) {
  if (!diagram || diagram.type === 'none' || !diagram.type) return null

  return (
    <div className="diagram-wrap">
      {diagram.title && <p className="diagram-title">📊 {diagram.title}</p>}
      {diagram.type === 'formula'   && <FormulaView d={diagram} />}
      {diagram.type === 'steps'     && <StepsView d={diagram} />}
      {diagram.type === 'table'     && <TableView d={diagram} />}
      {diagram.type === 'geometry'  && <GeometryView d={diagram} />}
      {diagram.type === 'bar_chart' && <BarChartView d={diagram} />}
    </div>
  )
}

/* ─── Formula ─────────────────────────────────────────────── */
function FormulaView({ d }) {
  return (
    <div className="diagram-formula">
      <div className="formula-box">{d.formula}</div>
      {d.variables?.length > 0 && (
        <div className="formula-vars">
          {d.variables.map((v, i) => (
            <div key={i} className="formula-var-row">
              <span className="var-symbol">{v.symbol}</span>
              <span className="var-eq">=</span>
              <span className="var-meaning">{v.meaning}</span>
              {v.unit && <span className="var-unit">({v.unit})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Steps ───────────────────────────────────────────────── */
function StepsView({ d }) {
  return (
    <div className="diagram-steps">
      {d.items?.map((step, i) => (
        <div key={i} className="step-row">
          <div className="step-bubble">{i + 1}</div>
          <div className="step-connector-wrap">
            <div className="step-text">{step}</div>
            {i < d.items.length - 1 && <div className="step-arrow">↓</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Table ───────────────────────────────────────────────── */
function TableView({ d }) {
  if (!d.headers || !d.rows) return null
  return (
    <div className="diagram-table-wrap">
      <table className="diagram-table">
        <thead>
          <tr>
            {d.headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {d.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Geometry ────────────────────────────────────────────── */
function GeometryView({ d }) {
  const color = d.color || '#4f46e5'
  const fill = color + '22'

  const labelStyle = (pos) => {
    const base = { position: 'absolute', fontSize: 12, fontWeight: 700, color, fontFamily: 'Cairo, sans-serif' }
    if (pos === 'top')    return { ...base, top: 4,  left: '50%', transform: 'translateX(-50%)' }
    if (pos === 'bottom') return { ...base, bottom: 4, left: '50%', transform: 'translateX(-50%)' }
    if (pos === 'left')   return { ...base, top: '50%', left: 4, transform: 'translateY(-50%)' }
    if (pos === 'right')  return { ...base, top: '50%', right: 4, transform: 'translateY(-50%)' }
    if (pos === 'center') return { ...base, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
    return base
  }

  return (
    <div className="diagram-geometry">
      <div style={{ position: 'relative', width: 200, height: 160, margin: '0 auto' }}>
        <svg width="200" height="160" viewBox="0 0 200 160" style={{ overflow: 'visible' }}>
          {d.shape === 'triangle' && (
            <polygon points="100,20 180,140 20,140" fill={fill} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          )}
          {d.shape === 'rectangle' && (
            <rect x="20" y="30" width="160" height="100" fill={fill} stroke={color} strokeWidth="2.5" rx="4" />
          )}
          {d.shape === 'circle' && (
            <circle cx="100" cy="80" r="65" fill={fill} stroke={color} strokeWidth="2.5" />
          )}
          {d.shape === 'parallelogram' && (
            <polygon points="40,140 60,20 160,20 140,140" fill={fill} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          )}
          {d.shape === 'trapezoid' && (
            <polygon points="50,140 150,140 130,20 70,20" fill={fill} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          )}
        </svg>
        {d.labels?.map((lbl, i) => (
          <div key={i} style={labelStyle(lbl.position)}>{lbl.text}</div>
        ))}
      </div>
    </div>
  )
}

/* ─── Bar Chart ───────────────────────────────────────────── */
function BarChartView({ d }) {
  if (!d.bars?.length) return null
  const max = Math.max(...d.bars.map(b => b.value), 1)

  return (
    <div className="diagram-bar-chart">
      {d.bars.map((bar, i) => {
        const pct = (bar.value / max) * 100
        const barColor = bar.color || '#4f46e5'
        return (
          <div key={i} className="bar-row">
            <span className="bar-label">{bar.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
            <span className="bar-value" style={{ color: barColor }}>{bar.value}</span>
          </div>
        )
      })}
    </div>
  )
}
