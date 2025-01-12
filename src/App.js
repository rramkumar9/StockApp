import React, { useState, useEffect } from "react";
import "./App.css";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

function App() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [error, setError] = useState(null);

  const [yearFilter, setYearFilter] = useState([2000, 2024]);
  const [revenueFilter, setRevenueFilter] = useState([0, 1000000]);
  const [netIncomeFilter, setNetIncomeFilter] = useState([0, 1000000]);

  const [sortOrder, setSortOrder] = useState("none");
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl =
        "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=8OEByXjNeLfvlqWKfrMB40PjufGNsyR4";

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();

        const yearRange = [
          Math.min(
            ...fetchedData.map((item) => new Date(item.date).getFullYear())
          ),
          Math.max(
            ...fetchedData.map((item) => new Date(item.date).getFullYear())
          ),
        ];
        const revenueRange = [
          Math.min(...fetchedData.map((item) => item.revenue)),
          Math.max(...fetchedData.map((item) => item.revenue)),
        ];
        const netIncomeRange = [
          Math.min(...fetchedData.map((item) => item.netIncome)),
          Math.max(...fetchedData.map((item) => item.netIncome)),
        ];

        setData(fetchedData);
        setFilteredData(fetchedData);
        setYearFilter(yearRange);
        setRevenueFilter(revenueRange);
        setNetIncomeFilter(netIncomeRange);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (filterType, newValue) => {
    if (filterType === "year") {
      setYearFilter(newValue);
    } else if (filterType === "revenue") {
      setRevenueFilter(newValue);
    } else if (filterType === "netIncome") {
      setNetIncomeFilter(newValue);
    }
  };

  useEffect(() => {
    if (data) {
      let filtered = data
        .filter((item) => {
          const year = new Date(item.date).getFullYear();
          return year >= yearFilter[0] && year <= yearFilter[1];
        })
        .filter(
          (item) =>
            item.revenue >= revenueFilter[0] && item.revenue <= revenueFilter[1]
        )
        .filter(
          (item) =>
            item.netIncome >= netIncomeFilter[0] &&
            item.netIncome <= netIncomeFilter[1]
        );

      if (sortBy !== "none") {
        filtered = filtered.sort((a, b) => {
          let compareValueA = a[sortBy];
          let compareValueB = b[sortBy];
          if (sortBy === "date") {
            compareValueA = new Date(a.date);
            compareValueB = new Date(b.date);
          }
          if (sortOrder === "ascending") {
            return compareValueA < compareValueB ? -1 : 1;
          } else if (sortOrder === "descending") {
            return compareValueA > compareValueB ? -1 : 1;
          } else {
            return 0;
          }
        });
      }

      setFilteredData(filtered);
    }
  }, [data, yearFilter, revenueFilter, netIncomeFilter, sortOrder, sortBy]);

  return (
    <div>
      <header className="title">
        Apple Inc. <span>(AAPL)</span>
      </header>

      <div className="filters-container">
        {/* Year Filter */}
        <div className="filter-row">
          <h3 className="filters">Year</h3>
          <input
            type="number"
            value={yearFilter[0] || ""}
            onChange={(e) =>
              handleFilterChange("year", [
                parseInt(e.target.value),
                yearFilter[1],
              ])
            }
            className="filter-input"
          />
          <input
            type="number"
            value={yearFilter[1] || ""}
            onChange={(e) =>
              handleFilterChange("year", [
                yearFilter[0],
                parseInt(e.target.value),
              ])
            }
            className="filter-input"
          />
        </div>

        {/* Revenue Filter */}
        <div className="filter-row">
          <h3 className="filters">Revenue</h3>
          <input
            type="number"
            value={revenueFilter[0] || ""}
            onChange={(e) =>
              handleFilterChange("revenue", [
                parseInt(e.target.value),
                revenueFilter[1],
              ])
            }
            className="filter-input"
          />
          <input
            type="number"
            value={revenueFilter[1] || ""}
            onChange={(e) =>
              handleFilterChange("revenue", [
                revenueFilter[0],
                parseInt(e.target.value),
              ])
            }
            className="filter-input"
          />
        </div>

        {/* Net Income Filter */}
        <div className="filter-row">
          <h3 className="filters">Net Income</h3>
          <input
            type="number"
            value={netIncomeFilter[0] || ""}
            onChange={(e) =>
              handleFilterChange("netIncome", [
                parseInt(e.target.value),
                netIncomeFilter[1],
              ])
            }
            className="filter-input"
          />
          <input
            type="number"
            value={netIncomeFilter[1] || ""}
            onChange={(e) =>
              handleFilterChange("netIncome", [
                netIncomeFilter[0],
                parseInt(e.target.value),
              ])
            }
            className="filter-input"
          />
        </div>
      </div>

      <div className="dropdown-container">
        <select
          className="dropdown"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">None</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <select
          className="dropdown"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">None</option>
          <option value="date">Date</option>
          <option value="revenue">Revenue</option>
          <option value="netIncome">Net Income</option>
        </select>
      </div>

      <div className="App">
        {error ? (
          <div>Error: {error.message}</div>
        ) : !filteredData || filteredData.length === 0 ? (
          <div>Loading or No Data Available...</div>
        ) : (
          <div className="table-container">
            <h2 className="subtitle">Income Statement Data</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                  <th>Net Income</th>
                  <th>Gross Profit</th>
                  <th>EPS</th>
                  <th>Operating Income</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                    <td>{formatCurrency(item.netIncome)}</td>
                    <td>{formatCurrency(item.grossProfit)}</td>
                    <td>{item.eps}</td>
                    <td>{formatCurrency(item.operatingIncome)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
