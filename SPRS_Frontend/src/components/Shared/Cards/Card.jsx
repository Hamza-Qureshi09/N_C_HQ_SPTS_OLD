import React from 'react'
import style from './Card.module.css'

const Card = ({heading,description,image}) => {
  return (
    <div className={style.card}>
        <img src={image} alt='not found' />
        <h2>{heading}</h2>
        <p>
        {description}
        </p>
        <div className={style.buttons}>
          <button>Watch</button>
        </div>
    </div>
  )
}

export default Card