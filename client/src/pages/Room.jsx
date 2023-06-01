import "./room.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';
import { formatCurrentVND, truncate } from "../util/util";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const [room, setRoom] = useState([]);
  const [name, setName] = useState("");
  const [add, setAdd] = useState([]);
  const [loading, setLoading] = useState('start');
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/filter-by-name/${name}`);
      if (res.status === 200) {
        setRoom(res.data.data);
      }
    } catch (error) {}
  };

  const bookingRoom = (item) => {
    if (add.length < 0) {
      setAdd([item]);
    } else {
      const check = add.find((i) => i._id == item._id);
      if (check) {
        const a = add.filter((i) => i._id !== item._id);
        setAdd(a);
      } else {
        if (add.length === 2) {      
          toast.error('Không được chọn quá 2 phòng');
          return;
        }
        console.log('không trùng');
        setAdd([...add, item]);
      }
    }
  };

  const handleStart = () => {
    setLoading('hide');
    setTimeout(() => {
      setLoading('show');
    }, 3000);
  }

  console.log('====================================');
  console.log(add);
  console.log('====================================');

  return (
    <>
      {
        add.length < 1 ? (
          <div className="mt-8 ">
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
            className="outline-none block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nhập tên cần lọc"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
      </div>
        ) : (
          <div className="mt-8 flex justify-center items-center">
          <button
            type="submit"
                onClick={handleStart}
            className="text-white right-2.5 bottom-2.5 bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
          >
            Phân tích dữ liệu
          </button>
        </div>
        )
      }

      <div className="mt-8 grid col-span-2 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 cursor-pointer">
        {loading === 'start' && room?.map((item) => (
          <div
            className="relative"
            key={item._id}
            onClick={() => bookingRoom(item)}
          >
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              <img
                className="rounded-2xl object-cover aspect-square"
                src={"http://localhost:4000/" + item.photos?.[0]}
                alt=""
              />
            </div>
            <h2 className="font-bold">{item.title}</h2>
            <h3 className="text-sm text-gray-500">{item.address}</h3>
            {add?.find((i) => i._id === item._id) ? (
              <div
                className="phu absolute h-full w-full bg-red rounded-md"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "#19191999",
                }}
              >
                <div className="absolute h-5 w-5 top-3 right-5 rounded-full shadow">
                  <i
                    className="fa-solid fa-circle-check"
                    style={{
                      color: "green",
                      fontSize: "24px",
                      zIndex: 999,
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  ></i>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>

      {
        loading === 'show' && (
          <div className="mt-8 flex justify-center items-start">
        <div className="w-2/4 text-center">
          <div className="uppercase font-bold border-l p-3">Theo Tiêu Chí</div>
          <div className="uppercase font-bold border-l p-3">Địa chỉ</div>
          <div className="uppercase font-bold border-l p-3">
            Giá Khi Thuê Dài Hạn
          </div>
          <div className="uppercase font-bold border-l p-3">
            Giá Khi Thuê Ngắn Hạn
          </div>
          <div className="uppercase font-bold border-l p-3">Lượt tương tác</div>
          <div className="uppercase font-bold border-l border-b p-3">Hành động</div>
        </div>
        <div className="w-2/4 text-center">
              <div className="uppercase font-bold border-custom p-3">{truncate(add[0].title, 20)}</div>
              <div className="uppercase border-custom p-3">{ truncate(add[0]?.address, 20)}</div>
              <div className="uppercase border-custom p-3 font-bold">{ formatCurrentVND(add[0]?.packageLong?.price)}</div>
              <div className="uppercase border-custom p-3 font-bold">{ formatCurrentVND(add[0]?.packageShort?.price)}</div>
              <div className="uppercase border-custom p-3">{add[0].reviews.length || 0}</div>
              <div className="uppercase border-custom border-b p-3">
              <button
            type="submit"
            onClick={() => navigate(`/place/${add[0]._id}`)}
            className="text-white  right-2.5 bottom-2.5 bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-2 py-1"
          >
            Đi đến room
          </button>
          </div>
        </div>
        <div className="w-2/4 text-center">
          <div className="uppercase font-bold border-r p-3">{truncate(add[1].title, 20)}</div>
          <div className="uppercase border-r p-3">{ truncate(add[1]?.address, 20)}</div>
          <div className="uppercase border-r p-3 font-bold">{ formatCurrentVND(add[1]?.packageLong?.price)}</div>
          <div className="uppercase border-r p-3 font-bold">{ formatCurrentVND(add[1]?.packageShort?.price)}</div>
          <div className="uppercase border-r p-3">{add[1].reviews.length || 0}</div>
              <div className="uppercase border-r border-b p-3">
              <button
            type="submit"
            onClick={() => navigate(`/place/${add[1]._id}`)}
            className="text-white  right-2.5 bottom-2.5 bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-1 py-1"
          >
            Đi đến room
          </button>
          </div>
        </div>
      </div>
        ) 
      }
      {
        loading === 'hide' && ((
          <div className="flex items-center justify-center">
      <ReactLoading className="text-center" type={'spin'} color={'#f5385d'} height={'20%'} width={'20%'} />
        </div>
          ))
        }
      
    </>
  );
};

export default Room;
