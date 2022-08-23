import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

import React, { useRef, useState, useEffect } from "react";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CarService } from "./CarService";

//let renderCount = 0;
const carService = new CarService();

const App = () => {
  const dtRef = useRef();
  const [virtualCars, setVirtualCars] = useState(Array.from({ length: 10000 }));
  const [lazyLoading, setLazyLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    filters: {
      'id': { value: '', matchMode: FilterMatchMode.CONTAINS } // Updated initial value
    }
  });

  const filtered = useRef(false); // Added this variable to check the filter operation

  const loadCarsLazy = (params) => {
    !lazyLoading && setLazyLoading(true);

    let { first, last, filters } = params;
    const filter = filters ? filters.id.value : "";  // Added null check

    const { value, count } = carService.get({ filter, first, last });

    setVirtualCars(() => {
      const _prev = virtualCars.length === count ? [...virtualCars] : Array.from({ length: count });
      const _virtualData = [..._prev.slice(0, first), ...value, ..._prev.slice(last)];
      return _virtualData;
    });
    setLazyLoading(false);
  };

  const onLazyScroll = (event) => {   // virtual scroller callback
    const next = { ...lazyParams, ...event };
    setLazyParams(next);
    loadCarsLazy(next);
  };

  const onFilter = (event) => {       // filter callback
    const next = { ...lazyParams, ...event };
    setLazyParams(next);

    filtered.current = true;
  }

  useEffect(() => {
    loadCarsLazy(lazyParams);

    if (dtRef.current && filtered.current) {
      dtRef.current.resetScroll();
    }

    filtered.current = false;
  }, [lazyParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-8">
      <div className="card">
        <h5>Lazy Loading from a Remote Datasource (100000 Rows)</h5>
        <DataTable ref={dtRef} value={virtualCars} lazy
          scrollable scrollHeight="400px"
          filterDisplay="row" filters={lazyParams.filters} onFilter={onFilter}
          virtualScrollerOptions={{ lazy: true, onLazyLoad: onLazyScroll, itemSize: 48 }}>
          <Column field="id" header="Id" style={{ minWidth: "200px" }}
            showFilterMenu={false} filter filterMatchMode="contains" />
          <Column field="vin" header="Vin" style={{ minWidth: "200px" }} />
          <Column field="year" header="Year" style={{ minWidth: "200px" }} />
          <Column field="brand" header="Brand" style={{ minWidth: "200px" }} />
          <Column field="color" header="Color" style={{ minWidth: "200px" }} />
        </DataTable>
      </div>
    </div>
  );
}

export default App;
