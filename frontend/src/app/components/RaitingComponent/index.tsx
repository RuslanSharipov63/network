"use client"
import { useState } from 'react';
import styles from './styles.module.css';

const inputValue = [5, 4, 3, 2, 1]

const RaitingComponent = () => {

    const [selectedOption, setSelectedOption] = useState(0);

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSelectedOption(Number(e.target.value))
    };

    return (
        <div className={styles.rating}>

            {inputValue.map((item, index) =>
                <div key={index}>
                    <input type="radio" checked={selectedOption === item ? true : false} id={`star${item}`} name="rating" value={item} onChange={handleOptionChange} /><label htmlFor={`star${item}`}>★</label>
                </div>
            )}


            {/*  <input type="radio" id="star5" name="rating" value="5" onChange={handleOptionChange} /><label htmlFor="star5">★</label>
            <input type="radio" id="star4" name="rating" value="4" onChange={handleOptionChange} /><label htmlFor="star4">★</label>
            <input type="radio" id="star3" name="rating" value="3" onChange={handleOptionChange} /><label htmlFor="star3">★</label>
            <input type="radio" id="star2" name="rating" value="2" onChange={handleOptionChange} /><label htmlFor="star2">★</label>
            <input type="radio" id="star1" name="rating" value="1" onChange={handleOptionChange} /><label htmlFor="star1">★</label> */}
        </div>


    );
}

export default RaitingComponent;