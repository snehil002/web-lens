import { useState } from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import NavAndHead from '../components/navAndHead';
import MoreControls from '../components/morecontrols';
import ChartArea from "../components/chartarea";
import { NEXT_PUBLIC_MY_SERVER_API } from "../config/env.js";


const fetcher = u => fetch(u).then(r => r.json())


export default function Home() {
  
  const [params, setParams] = useState({
    "visitedUrl": "/",
    "metricName": "daily",
    "timeStringI": getADateNDaysBack(5),
    "timeStringF": getADateNDaysBack(1),
    "visitorCountOrAvgTime": "visitorCount"
  });

  const {dataPoints, isLoading, error} = useMetricData(params);


  function setParameter( param ) {
    setParams((prev) => {
      return {
        ...prev,
        ...param
      };
    });
  }

  return (
    <>
      <Head>
        <title>Weblens</title>
      </Head>

      <NavAndHead setParameter={setParameter} selectedParams={params} />

      <main className="px-5">

        <MoreControls setParameter={setParameter} selectedParams={params} />

        <ChartArea selectedParams={params} error={error} isLoading={isLoading}
          dataPoints={dataPoints}
        />
      
      </main>      
    </>
  );
}


function getADateNDaysBack(n) {
  let d = new Date();
  d.setDate(d.getDate() - n);
  //ISO is just a format: 2023-01-15T00:00:00.000Z
  return d.toISOString().substring(0, 10);
}


function useMetricData (params) {
  // encodeURIComponent - encodes url params because
  // params contain special characters @, /, +, etc.
  const visitedUrl = encodeURIComponent( params["visitedUrl"] );

  const metricName = params["metricName"];

  // ISO Date String         - 2023-01-15T00:00:00.000Z
  // Encoded ISO Date String - 2023-01-15T00%3A00%3A00.000Z
  
  // Convert Local Date to UTC.
  // Set time to 12 AM and 11:59 PM
  // Because DB has UTC times
  const di = new Date(params["timeStringI"]);
  di.setHours(0, 0, 0, 0);
  
  const df = new Date(params["timeStringF"]);
  df.setHours(23, 59, 59, 999);
  
  const timeStringI = encodeURIComponent( di.toISOString() );
  
  const timeStringF = encodeURIComponent( df.toISOString() );

  // Client's Current Time Zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const url = NEXT_PUBLIC_MY_SERVER_API +
    `/get-metric/` + `?` + `visitedurl=${visitedUrl}` + `&metricname=${metricName}` +
    `&timestringi=${timeStringI}` + `&timestringf=${timeStringF}` +
    `&timezone=${timeZone}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    dataPoints: data,
    isLoading,
    error
  };

  // return {
  //   dataPoints: {
  //     "xaxis" : ['3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan'],
  //     "yaxis" : {
  //       "visitorCount": {
  //         "data": [12, 19, 3, 5, 2, 3],
  //         "ylabel": "Number of Visitors on different Days in the requested Time Interval"
  //       },
  //       "avgTime": {
  //         "data": [12, 19, 3, 5, 2, 3],
  //         "ylabel": "Average Time Spent by Visitors on different Days in the requested Time Interval"
  //       }
  //     }
  //   },
  //   isLoading: false,
  //   error: false
  // }
}