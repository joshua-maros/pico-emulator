// src/components/CSVButton.jsx
// This component puts up a button for downloading a CVS file.
// The fetchCSVData parameter is a function that prepares the data,
// the rest of the code downloads that data.
import React from 'react';
import { CSVLink } from "react-csv";

function CSVButton(key, label, fname, data, fetchCSVData, clearCSVData)
{
  if (data && data.length > 0)
  {
    return (
      <div key={key}>
        <span key={4}>{label}</span>
        <span key={5} onClick={clearCSVData}>OK</span>
        <CSVLink
          target='_blank'
          filename={fname}
          data={data}
          key={6}
        >Go!</CSVLink>
      </div>
    )
  }
  else
  {
    return (
      <div key={key}>
        <span key={1}>{label}</span>
        <span key={2} onClick={fetchCSVData}>CSV</span>
      </div>
    )
  }
};

export default CSVButton;
