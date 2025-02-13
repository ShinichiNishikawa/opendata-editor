import React from 'react';

import Table from './Table';
import Download from './Download';
import Settings from './Settings';

import queryString from "query-string"
import Papa from 'papaparse';

import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import Map from './Map'
import Uploader from './Uploader'
import Menu from './Menu'

import './Home.scss';

interface Feature {
  [key: string]: string;
}

const Home = () => {
  const [ features, setFeatures ] = React.useState<Feature[]>([])
  const [ filename, setFilename ] = React.useState<string>('')

  React.useEffect(() => {
    if (window.location.search) {
      const query = queryString.parse(window.location.search)
      if (query.data) {
        const path = query.data as string;
        const filename = path.split('/').pop() || '';
        setFilename(filename);

        // @ts-ignore
        fetch(query.data)
          .then((response) => response.text())
          .then((data) => {
            const features = Papa.parse(data, {
              header: true,
              skipEmptyLines: true,
            }).data as Feature[];
  
            setFeatures([...features]);
          });
      }
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/table" element={<Table features={features} setFeatures={setFeatures} />} />
        <Route path="/download" element={<Download features={features} filename={filename} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Uploader className="uploader" setFeatures={setFeatures} setFilename={setFilename}></Uploader>
      <Menu className='menu'></Menu>
      <Map className="map" features={features}/>
    </HashRouter>
  );
}

export default Home;
