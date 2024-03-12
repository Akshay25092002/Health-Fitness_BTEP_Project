import { useEffect, useState } from "react";
import { token } from "../config.js";

//this fuction receives URL as a parameter
const useFetchData = (url) => {
  //inside this hook function we define state variable to manage data, loading and errors
  //inside  useEffect hook we will create a func called fatch data, this func is resposible for handling data fatching process

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url, {
          //passing url and Authentication token
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (!res.ok) {
          //instead of showing toast msg i will throw msg
          throw new Error(result.message + "bad");
          //return toast.error(result.message)
        }
        //if res is succeful we update the data state with the fetch info and set loading to false

        setData(result.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    fetchData(); //call this func and as a dependency add the url
  }, [url]);

  // finally we will return the object that contains data, loading and error state this can be used in react componenets to effectively manage database
  return {
    data,
    loading,
    error,
  };
};

export default useFetchData;
