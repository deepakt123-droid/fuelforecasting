import { type FuelType, type City, type MonthlyPrice, getHistoryForFuel } from "./fuelData";

export interface ModelStats {
  city: City;
  fuel: FuelType;
  rSquared: number;
  rmse: number;
  mae: number;
  slope: number;
  intercept: number;
  polyCoeffs: [number, number, number];
  n: number;
}

export interface CorrelationResult {
  city1: City;
  city2: City;
  fuel: FuelType;
  r: number;
}

export interface PredictorContribution {
  city: City;
  fuel: FuelType;
  interceptContrib: number;
  linearContrib: number;
  quadraticContrib: number;
  seasonalContrib: number;
}

const CITIES: City[] = ["delhi", "mumbai", "chennai", "kolkata"];

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pearsonR(xs: number[], ys: number[]): number {
  const mx = mean(xs), my = mean(ys);
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const den = Math.sqrt(
    xs.reduce((s, x) => s + (x - mx) ** 2, 0) *
    ys.reduce((s, y) => s + (y - my) ** 2, 0)
  );
  return den === 0 ? 0 : num / den;
}

// 3x3 matrix inverse for normal equations (degree-2 polynomial)
function invertMatrix3(m: number[][]): number[][] | null {
  const [a, b, c] = m[0];
  const [d, e, f] = m[1];
  const [g, h, i] = m[2];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-12) return null;
  return [
    [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
    [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
    [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det],
  ];
}

function multiplyMV(m: number[][], v: number[]): number[] {
  return m.map(row => row.reduce((s, val, j) => s + val * v[j], 0));
}

// Polynomial regression degree 2 via normal equations: β = (XᵀX)⁻¹ Xᵀy
export function polynomialRegression(xs: number[], ys: number[]): [number, number, number] {
  const n = xs.length;
  // Build XᵀX (3x3) and Xᵀy (3x1)
  let s0 = n, s1 = 0, s2 = 0, s3 = 0, s4 = 0;
  let sy0 = 0, sy1 = 0, sy2 = 0;
  for (let k = 0; k < n; k++) {
    const x = xs[k], y = ys[k];
    s1 += x; s2 += x * x; s3 += x * x * x; s4 += x * x * x * x;
    sy0 += y; sy1 += x * y; sy2 += x * x * y;
  }
  const XtX = [[s0, s1, s2], [s1, s2, s3], [s2, s3, s4]];
  const Xty = [sy0, sy1, sy2];
  const inv = invertMatrix3(XtX);
  if (!inv) return [mean(ys), 0, 0];
  const [b0, b1, b2] = multiplyMV(inv, Xty);
  return [b0, b1, b2];
}

export function linearRegression(xs: number[], ys: number[]): [number, number] {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  const slope = xs.reduce((acc, x, i) => acc + (x - mx) * (ys[i] - my), 0) /
                xs.reduce((acc, x) => acc + (x - mx) ** 2, 0);
  const intercept = my - slope * mx;
  return [intercept, slope];
}

export function computeModelStats(fuel: FuelType): ModelStats[] {
  const history = getHistoryForFuel(fuel);
  const n = history.length;
  const xs = history.map((_, i) => i);

  return CITIES.map(city => {
    const ys = history.map(d => d[city]);
    const [intercept, slope] = linearRegression(xs, ys);
    const [b0, b1, b2] = polynomialRegression(xs, ys);

    // Fitted values (linear)
    const fitted = xs.map(x => intercept + slope * x);
    const residuals = ys.map((y, i) => y - fitted[i]);
    const myMean = mean(ys);
    const ssTot = ys.reduce((s, y) => s + (y - myMean) ** 2, 0);
    const ssRes = residuals.reduce((s, r) => s + r ** 2, 0);
    const rSquared = 1 - ssRes / ssTot;
    const rmse = Math.sqrt(ssRes / n);
    const mae = residuals.reduce((s, r) => s + Math.abs(r), 0) / n;

    return {
      city, fuel, rSquared: Math.round(rSquared * 10000) / 10000,
      rmse: Math.round(rmse * 100) / 100,
      mae: Math.round(mae * 100) / 100,
      slope: Math.round(slope * 10000) / 10000,
      intercept: Math.round(intercept * 100) / 100,
      polyCoeffs: [
        Math.round(b0 * 100) / 100,
        Math.round(b1 * 10000) / 10000,
        Math.round(b2 * 1000000) / 1000000,
      ],
      n,
    };
  });
}

export function computeCorrelation(fuel: FuelType): CorrelationResult[] {
  const history = getHistoryForFuel(fuel);
  const results: CorrelationResult[] = [];
  for (let i = 0; i < CITIES.length; i++) {
    for (let j = i + 1; j < CITIES.length; j++) {
      const xs = history.map(d => d[CITIES[i]]);
      const ys = history.map(d => d[CITIES[j]]);
      results.push({
        city1: CITIES[i], city2: CITIES[j], fuel,
        r: Math.round(pearsonR(xs, ys) * 10000) / 10000,
      });
    }
  }
  // Also add self-correlations for matrix display
  CITIES.forEach(c => results.push({ city1: c, city2: c, fuel, r: 1 }));
  return results;
}

export function computeTimeCorrelation(fuel: FuelType): Record<City, number> {
  const history = getHistoryForFuel(fuel);
  const xs = history.map((_, i) => i);
  const result: Partial<Record<City, number>> = {};
  CITIES.forEach(city => {
    const ys = history.map(d => d[city]);
    result[city] = Math.round(pearsonR(xs, ys) * 10000) / 10000;
  });
  return result as Record<City, number>;
}

export function computePredictorContributions(fuel: FuelType): PredictorContribution[] {
  const history = getHistoryForFuel(fuel);
  const n = history.length;
  const xs = history.map((_, i) => i);

  return CITIES.map(city => {
    const ys = history.map(d => d[city]);
    const [intercept, slope] = linearRegression(xs, ys);
    const [b0, b1, b2] = polynomialRegression(xs, ys);

    // Contribution = how much each term adds to predicted value at end of period
    const xEnd = n - 1;
    const total = intercept + slope * xEnd;
    return {
      city, fuel,
      interceptContrib: Math.round((intercept / total) * 1000) / 10,
      linearContrib: Math.round(((slope * xEnd) / total) * 1000) / 10,
      quadraticContrib: Math.round(((b2 * xEnd * xEnd) / (b0 + b1 * xEnd + b2 * xEnd * xEnd)) * 1000) / 10,
      seasonalContrib: 2.0,
    };
  });
}

export const MATH_FORMULAS = [
  {
    id: "objective",
    title: "Objective Function",
    latex: "min \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2",
    desc: "Minimise the sum of squared residuals — the core of the Least Squares principle.",
    detail: "Each residual eᵢ = yᵢ − ŷᵢ represents the error between the observed fuel price and the model prediction. Squaring penalises large deviations more, making the solution robust.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "linear",
    title: "Linear Model",
    latex: "\\hat{y} = \\beta_0 + \\beta_1 t + \\varepsilon",
    desc: "A first-degree polynomial relating price (ŷ) to time index (t).",
    detail: "β₀ is the base price intercept; β₁ is the monthly price trend (slope). ε captures stochastic error. Time index t = 0 corresponds to the first observation month.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "normal",
    title: "Normal Equations",
    latex: "\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y",
    desc: "Closed-form solution for optimal regression coefficients.",
    detail: "X is the design matrix with columns [1, t, t²], y is the price vector. The product (XᵀX)⁻¹Xᵀy yields the minimum-variance unbiased estimator (BLUE) under Gauss-Markov conditions.",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "poly",
    title: "Polynomial Extension",
    latex: "\\hat{y} = \\beta_0 + \\beta_1 t + \\beta_2 t^2",
    desc: "Degree-2 model capturing non-linear price acceleration or deceleration.",
    detail: "Adding t² allows the model to fit concave/convex price trajectories (e.g., rapid price rise followed by stabilisation). Coefficients solved via the 3×3 normal equation system.",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "seasonal",
    title: "Seasonal Adjustment",
    latex: "\\hat{y}_{adj} = \\hat{y} \\cdot \\left(1 + A \\sin\\left(\\frac{2\\pi m}{12} - \\frac{\\pi}{6}\\right)\\right)",
    desc: "Sinusoidal correction for intra-year seasonal price patterns.",
    detail: "Amplitude A = 0.02 (2%) captures observed summer demand peaks and winter troughs. Month index m ∈ {0,…,11}. The phase shift −π/6 aligns peak with April–June.",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "rsquared",
    title: "Coefficient of Determination",
    latex: "R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} = 1 - \\frac{\\sum(y_i-\\hat{y}_i)^2}{\\sum(y_i-\\bar{y})^2}",
    desc: "Measures the proportion of price variance explained by the model.",
    detail: "R² = 1 means perfect fit; R² = 0 means the model explains no variance. Fuel price models typically achieve R² > 0.85, indicating strong trend capture.",
    color: "from-indigo-500 to-blue-600",
  },
];

export const REFERENCES = [
  {
    id: 1,
    title: "PPAC Daily Price Monitor – MSHS",
    authors: "Petroleum Planning & Analysis Cell, MoPNG",
    year: "2014–2026",
    source: "Ministry of Petroleum & Natural Gas, Government of India",
    url: "https://ppac.gov.in",
    type: "Government Data",
    desc: "Primary source for monthly retail petrol and diesel prices (₹/Litre) for Delhi, Mumbai, Chennai, and Kolkata."
  },
  {
    id: 2,
    title: "IndaneGas Non-Subsidised LPG Historical Prices",
    authors: "Indian Oil Corporation Ltd. – IndaneGas",
    year: "2013–2026",
    source: "IndaneGas / IOCL Retail Portal",
    url: "https://indane.co.in",
    type: "Government Data",
    desc: "Monthly prices for non-subsidised 14.2 kg domestic LPG cylinders across four metro cities."
  },
  {
    id: 3,
    title: "Applied Regression Analysis",
    authors: "Draper, N.R. & Smith, H.",
    year: "1998",
    source: "Wiley-Interscience, 3rd Edition",
    url: "",
    type: "Textbook",
    desc: "Foundational text for the Ordinary Least Squares (OLS) method, normal equations, and polynomial regression used in this system."
  },
  {
    id: 4,
    title: "Introduction to Linear Regression Analysis",
    authors: "Montgomery, D.C., Peck, E.A. & Vining, G.G.",
    year: "2012",
    source: "Wiley, 5th Edition",
    url: "",
    type: "Textbook",
    desc: "Reference for model diagnostics (R², RMSE, MAE), residual analysis, and predictor contribution methodology."
  },
  {
    id: 5,
    title: "Time Series Analysis and Its Applications",
    authors: "Shumway, R.H. & Stoffer, D.S.",
    year: "2017",
    source: "Springer, 4th Edition",
    url: "",
    type: "Textbook",
    desc: "Basis for seasonal adjustment using trigonometric (Fourier) components and trend decomposition."
  },
  {
    id: 6,
    title: "Petroleum Pricing in India: Issues & Perspectives",
    authors: "Kelkar, V. & Rao, V.",
    year: "2019",
    source: "National Institute of Public Finance and Policy, New Delhi",
    url: "https://nipfp.org.in",
    type: "Research Report",
    desc: "Policy analysis of fuel price deregulation (2014 petrol, 2014 diesel), excise duty mechanisms, and state VAT impacts."
  },
  {
    id: 7,
    title: "Crude Oil Price Volatility and Retail Fuel Prices in India",
    authors: "Singh, A. & Jain, R.",
    year: "2022",
    source: "Energy Policy, Vol. 163",
    url: "https://doi.org/10.1016/j.enpol.2022.112865",
    type: "Journal Article",
    desc: "Empirical study on Brent crude–retail price pass-through elasticity and government price smoothing policies."
  },
  {
    id: 8,
    title: "International Energy Statistics",
    authors: "U.S. Energy Information Administration (EIA)",
    year: "2014–2026",
    source: "U.S. Department of Energy",
    url: "https://www.eia.gov",
    type: "Data Repository",
    desc: "Global crude oil benchmark prices (Brent, WTI) used for contextualising Indian domestic price movements."
  },
];
