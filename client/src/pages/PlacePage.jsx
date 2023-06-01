import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import { formatCurrentVND, typeOption } from "../util/util";
import { toast } from "react-toastify";
import { formatDate } from "../util/util";
import { isBefore, isAfter, differenceInCalendarDays } from "date-fns";
import { FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon } from "react-share"
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [optionChecking, setOptionChecking] = useState(); //longTerm, shortTerm
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [idUser, setIdUser] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [comment, setComment] = useState("");
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIdUser(user._id);
    }
  }, [id]);

  if (!place) return "";

  let numberOfNights = 1;
  if (optionChecking === "shortTerm" && checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const bookingRoom = async () => {
    const fromDate = new Date(place?.packageShort.shortPackageDateStart);
    const endDate = new Date(place?.packageShort.shortPackageDateEnd);
    const checkInn = new Date(checkIn);
    const checkOutt = new Date(checkOut);

    if (!idUser) {
      navigate("/login", { replace: true });
    }

    if (optionChecking === "shortTerm") {
      if (isBefore(endDate, checkInn) || isBefore(endDate, checkOutt)) {
        toast.error("Vui lòng nhập đúng ngày trong kỳ hạn");
        return;
      }
    }

    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      place: place._id,
      user: idUser,
      userMain: place?.owner,
      booker: place?.personBooker._id,
      typeOption: optionChecking,
      price: numberOfNights * price,
      numberOfNights: numberOfNights,
    });

    if (response.status === 200) {
      setPlace("");
      setOptionChecking("");
      setPrice("");
      setType("");
      setIdUser("");
      setCheckIn("");
      setCheckOut("");
      navigate("/booking-success", { replace: true });
    }
  };

  const handleRating = async () => {
    try {
      const res = await axios.post(`/add-comment/${id}`, {
        idUser: user,
        comment,
      });

      if (res.status === 200) {
        toast.success("Bình luận thành công");
        axios.get(`/places/${id}`).then((response) => {
          setPlace(response.data);
        });
        setComment("")        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <div className="float-right">
        <FacebookShareButton url="https://tailwindcss.com/docs/text-transform" quote="Title share blog" hashtag="#share">
          <FacebookIcon size={40} round={true}/>
        </FacebookShareButton>
        <EmailShareButton url="https://tailwindcss.com/docs/text-transform" quote="Title share blog" hashtag="#share">
          <EmailIcon size={40} round={true}/>
     </EmailShareButton>
      </div>
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>      
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>

          <div className="border p-4 flex flex-col rounded-2xl gap-2 items-center cursor-pointer bg-white shadow mt-6  rounded-lg p-6">
            <input
              type="checkbox"
              checked={optionChecking === "longTerm" ? true : false}
              onChange={() => {
                setOptionChecking("longTerm");
                setPrice(place?.packageLong.price);
              }}
            />
            <span>Gói Dài Hạn</span>
            <div className="flex items-center">
              <span className="w-36">Ngày Bắt Đầu</span>
              <input
                type="text"
                disabled
                value={place?.packageLong.longPackageDate}
              />
            </div>
            <div className="flex items-center">
              <span className="w-36">Giá</span>
              <input
                type="text"
                className="font-bold"
                disabled
                value={formatCurrentVND(place?.packageLong.price)}
              />
            </div>
          </div>

          <div className="border p-4 mt-2 flex flex-col rounded-2xl gap-2 items-center cursor-pointer bg-white shadow mt-6  rounded-lg p-6">
            <input
              type="checkbox"
              checked={optionChecking === "shortTerm" ? true : false}
              onChange={() => {
                setOptionChecking("shortTerm");
                setPrice(place?.packageShort.price);
              }}
            />
            <span>Gói Ngắn Hạn</span>
            <div className="flex items-center">
              <span className="w-36">Ngày Bắt Đầu</span>
              <input
                type="text"
                disabled
                value={place?.packageShort.shortPackageDateStart}
              />
            </div>
            <div className="flex items-center">
              <span className="w-36">Ngày Kết Thúc</span>
              <input
                type="text"
                disabled
                value={place?.packageShort.shortPackageDateEnd}
              />
            </div>
            <div className="flex items-center">
              <span className="w-36">Giá</span>
              <input
                type="text"
                className="font-bold"
                disabled
                value={formatCurrentVND(place?.packageShort.price)}
              />
            </div>
          </div>
          <div className="bg-white shadow mt-6  rounded-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-4">
              Người Chọn Làm Booker
            </h3>
            <ul className="flex items-center justify-center space-x-2">
              <li className="flex flex-col items-center space-y-2">
                {/* Ring */}
                <Link
                  className="block bg-white p-1 rounded-full"
                  to={`/account/profile/${place?.personBooker._id}`}
                >
                  <img
                    className="w-16 rounded-full"
                    src={place?.personBooker.avatar}
                  />
                </Link>
                {/* Username */}
                <span className="text-xs text-gray-500">
                  {place?.personBooker.name}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div>
          {optionChecking && (
            <div className="bg-white shadow p-4 rounded-2xl">
              <div className="text-2xl text-center">
                Giá: {formatCurrentVND(price)} / {typeOption(optionChecking)}
              </div>
              {optionChecking === "shortTerm" && (
                <>
                  <p className="text-sm">
                    Ngày <b>CheckIn</b> và <b>Checkout</b> phải trong thời gian
                    của gói
                  </p>
                  <div className="border rounded-2xl mt-4">
                    <div className="flex">
                      <div className="py-3 px-4">
                        <label>Check in:</label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(ev) => setCheckIn(ev.target.value)}
                        />
                      </div>
                      <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(ev) => setCheckOut(ev.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-4xl uppercase m-3">
                    {numberOfNights} ngày
                  </div>
                </>
              )}
              <div className="flex">
                <div className="py-3 px-4 italic text-sm">
                  <p className="text-red-600">
                    - Lưu ý * giá khi đặt sẽ tùy thuộc vào các option mình đã
                    chọn. Quý Khách vui lòng chọn đúng options mà mình mong muốn
                  </p>
                  <p className="text-red-600">
                    - Booker là người được nhà đưa tin chọn nên mọi vấn đề về an
                    toàn và bảo mật đều đảm bảo
                  </p>
                </div>
              </div>

              <button className="primary mt-4" onClick={bookingRoom}>
                Đặt Phòng
                {numberOfNights > 0 && (
                  <span> {formatCurrentVND(numberOfNights * price)}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Thông Tin Khác</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Đánh giá</h2>
        </div>
        <div>
          {
            user && (
              <div className="col-span-6 sm:col-span-3 mt-3 flex justify-center">
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              autoComplete="given-name"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            {comment && (
              <button
                className="py-2 px-4 width-200 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleRating}
              >
                Đánh giá
              </button>
            )}
          </div>
            )
          }
          {
            place?.reviews.length > 0 &&
            place?.reviews?.map((item) => (
              <div className="py-4 px-2 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center" key={item._id}>
              <div className="flex flex-col justify-start items-start w-full space-y-8">
                <div className="w-full flex justify-start items-start flex-col bg-gray-50 dark:bg-gray-800 md:px-8 py-8">
                  <div id="menu2" className="hidden md:block">
                    <p className="mt-3 text-base leading-normal text-gray-600 dark:text-white w-full md:w-9/12 xl:w-5/6">
                      {item.comment}
                    </p>
  
                    <div className="mt-6 flex justify-start items-center flex-row space-x-2.5">
                      <div>
                        <img
                            src={item?.idUser?.avatar}
                            className={`h-10 w-10 object-cover rounded-full`}
                          alt="girl-avatar"
                        />
                      </div>
                      <div className="flex flex-col justify-start items-start space-y-2">
                        <p className="text-base font-medium leading-none text-gray-800 dark:text-white">
                          {item?.idUser?.name}
                        </p>
                        <p className="text-sm leading-none text-gray-600 dark:text-white">
                          {formatDate(item?.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))
              }
        </div>
      </div>
    </div>
  );
}
