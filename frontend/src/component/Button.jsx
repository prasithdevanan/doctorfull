import React from 'react'

function Button({children, primary, icon, onclick}) {

  const classname = primary ? primary : "flex bg-(--color-primary) text-(--color-text-color) px-4 py-2 rounded-full hover:scale-105 transition ease-in-out duration-300 cursor-pointer";
  
  return (
    <button className = {`${classname}`} onClick={onclick}>{icon}{children}</button>
  )
}

export default Button;