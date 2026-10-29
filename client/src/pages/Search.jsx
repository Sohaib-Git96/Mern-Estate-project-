import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/listingitem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading,setLoading]=useState(false)
  const [listings,setListings]=useState([])
  console.log(listings)

useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  setSidebardata({
    searchTerm: urlParams.get("searchTerm") || "",
    type: urlParams.get("type") || "all",
    parking: urlParams.get("parking") === "true",
    furnished: urlParams.get("furnished") === "true",
    offer: urlParams.get("offer") === "true",
    sort: urlParams.get("sort") || "createdAt",
    order: urlParams.get("order") || "desc",
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchListings();
}, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata({ ...sidebardata, type: id });
    }
    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    }
    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebardata({ ...sidebardata, [id]: checked });
    }
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

 


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search...."
              className="border w-full rounded-lg p-3"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebardata.type === "all"} />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebardata.type === "sale"} />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebardata.type === "rent"} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebardata.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebardata.parking} />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebardata.furnished} />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 ">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
         <div className="p-7 flex flex-wrap gap-4">
        {!loading && listings.length ===0 && ( 
          <p className="text-xl text-slate-700">No Listing Found! </p>
        )
        }
        {loading && (
          <p className="text-xl text-slate-700 text-center text-center w-full">Loading...</p>
        )}
        {!loading && listings && listings.map((listing)=>(
          <ListingItem key={listing._id} listing={listing}/>
        ))}
      </div>
      </div>
    </div>
  );
}