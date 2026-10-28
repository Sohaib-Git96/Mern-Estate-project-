import {FaSearch} from "react-icons/fa";
import {Link,Navigate, useNavigate,useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

export default function Header() {
    const {currentUser}=useSelector(state=>state.user);
    const [searchTerm,setSearchTerm]=useState("");
    const navigate=useNavigate()
    const location = useLocation();
    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(location.search)
        urlParams.set("searchTerm",searchTerm)
        const searchQuery=urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search)
        const searchTermFromUrl=urlParams.get('searchTerm')
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])

  return (
      <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-w-auto p-3">
            <Link to="/"> 
               <h1 className="font-bold text-sm sm-text-xl flex flex-wrap">
                    <span className='text-slate-500'>Sahand</span>
                    <span className="text-slate-700">Estate</span>
                 </h1>
            </Link>      
            <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-3 flex items-center">
                <input type="text" placeholder="Serach..." className="focus:outline-none w-24 sm:w-64" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <button>
                    <FaSearch className="text-slate-600" />
                </button>
            </form>
            <ul className="flex gap-4">
                <Link to="/Home">
                 <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                </Link>
                <Link to="/About">
                 <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                </Link>
                <Link to={currentUser ? "/profile" : "/sign-in"}>
                {currentUser ? (
                    <img
                    src={currentUser.avator}
                    alt="profile"
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 rounded-full object-cover"/>
                ) : (
                <li className="text-slate-700 hover:underline">Sign in</li>
                )}
                </Link>
                
            </ul>
        </div>
       
      </header>
  )
}
