import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('packageLong'); // packageShort
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  useEffect(() => {
    if (price) {
      axios.get(`/filter-by-price/${price}`).then((response) => {
        setPlaces(response.data);
      });
    }
  }, [price]);

  // useEffect(() => {
  //   if (type) {
  //     axios.get(`/filter-by-type/${type}`).then((response) => {
  //       setPlaces(response.data);
  //     });
  //   }
  // }, [type]);

  const handleSearch = async() => {
    try {
      const res = await axios.get(`/filter-by-name/${name}`);
      if (res.status === 200) {
        setName('');
        setPlaces(res?.data?.data)
      }
    } catch (error) {
      
    }
  }

  const checking = (time) => {
    const today = new Date(time);
    const timeExpired = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (today < timeExpired) {
      console.log('conf han');
    } else {
      console.log('het han');
    }
  }

  return (
    <div className="grid grid-cols-3">
      <div className="border-t border-gray-200 px-4 py-6">
        <h3 className="-mx-2 -my-3 flow-root">
          {/* Expand/collapse section button */}
          
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập tên cần lọc"
              value={name}
              onChange={(e)=> setName(e.target.value)}
                  required
                />
                <button
              type="submit"
              onClick={handleSearch}
                  className="text-white absolute right-2.5 bottom-2.5 bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
          
          <input
            type="search"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
                  id="default-search"
                  className="block w-full p-4 mt-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nhập giá "
                  required
                />
          <button
            type="button"
            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
            aria-controls="filter-section-mobile-1"
            aria-expanded="false"
          >
            <span className="font-medium text-gray-900">Thể Loại<i></i></span>
          </button>
        </h3>
        {/* Filter section, show/hide based on section state. */}
        <div className="pt-6" id="filter-section-mobile-1">
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                id="filter-mobile-category-0"
                type="radio"
                checked={type === 'packageShort' ? true : false}
                onClick={() => setType('packageShort')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="filter-mobile-category-0"
                className="ml-3 min-w-0 flex-1 text-gray-500"
              >
                Ngắn hạn
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="filter-mobile-category-1"
                type="radio"
                checked={type === 'packageLong' ? true : false}
                onClick={() => setType('packageLong')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="filter-mobile-category-1"
                className="ml-3 min-w-0 flex-1 text-gray-500"
              >
                Dài hạn
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid col-span-2 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={"/place/" + place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:4000/" + place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{place.title}</h2>
              <h3 className="text-sm text-gray-500">{place.address}</h3>
              <div className="mt-1">
                <span className="font-bold">
                  {place?.packageLong?.price?.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                / tháng
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
