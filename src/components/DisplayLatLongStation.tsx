import React from 'react';

export interface LatLongStation {
    lat: number;
    long: number;
    stationName: string;
  }
const ViewLatLongStation: React.FC<LatLongStation> = (props) => {
  return (
    <div>
      <h1>Lat: {props.lat}</h1>
      <h1>Long: {props.long}</h1>
      <h1>Station: {props.stationName}</h1>
    </div>
  );
};
export default ViewLatLongStation;
