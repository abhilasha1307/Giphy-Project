import react, { useEffect, useState } from 'react';
import axios from 'axios';
import { render } from '@testing-library/react';
import Loader from './loader';
import Paginate from './pagination';

const Giphy = () =>{
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() =>{
        const fetchGIFS = async() =>{
        setIsError(false)
        setIsLoading(true)
        try{
            const Gifs = await axios("https://api.giphy.com/v1/gifs/trending", {
            params: {
                api_key: "GlVGYHkr3WSBnllca54iNt0yFbjz7L65", 
                limit: 500
            }
        })
        console.log(Gifs);
        setData(Gifs.data.data)
        }catch(err){
            setIsError(true);
            setTimeout(() => setIsError(false), 4000);
        }

        setIsLoading(false);
    };
    fetchGIFS()
    }, [])

    const renderGifs = () => {
    if (isLoading) {
        return <Loader />;
    }
    return currentItems.map(el => {
        return (
        <div key={el.id} className="gif">
            <img src={el.images.fixed_height.url} />
        </div>
        );
    });
    };

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsError(false);
        setIsLoading(true);

        try {
        const Gifs = await axios("https://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "GlVGYHkr3WSBnllca54iNt0yFbjz7L65",
                q: search,
                limit: 500
            }
        });
        console.log(Gifs);
        setData(Gifs.data.data);
        } catch (err) {
        setIsError(true);
        setTimeout(() => setIsError(false), 4000);
        }

        setIsLoading(false);
    };
    
    const renderError = () => {
    if (isError) {
        return (
        <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
        >
            Unable to get Gifs, please try again in a bit
        </div>
    );
    }
};

    const pageSelected = pageNumber => {
        setCurrentPage(pageNumber);
    };

    return <div className='m-2'>
        {renderError()}
        <form className="box">
        <input id='searchBar'
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Keywords"
            className="form-control"
        />
        <button id='searchBtn'
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary mx-2"
        >
            Search
        </button>
        </form>
        <Paginate
        pageSelected={pageSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        />
        <div className='container gifs'>{renderGifs()}</div>
    </div>
}

export default Giphy