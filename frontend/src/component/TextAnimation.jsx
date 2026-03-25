import React, { useEffect, useState } from 'react';

function TextAnimation({ text, className, icon }) {
    const texts = text ? text : 'Hello World'
    const tokens = texts.split('');
    const [showicon, setShowIcon] = useState(false);

    useEffect(() => {
        const totalTime = text.length * 60;

        const timer = setTimeout(() => {
            setShowIcon(true);
        }, totalTime);

        return () => clearTimeout(timer);
    }, [text])

    return (
        <>
            <style>{`
        @keyframes ta {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.8);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

            <div className="flex">
                {tokens.map((token, i) => (
                    <h1 className={className} key={i}>
                        <span
                            style={{
                                animation: `ta 400ms ease ${i * 60}ms both`,
                            }}
                        >
                            {token === ' ' ? '\u00A0' : token}
                        </span>

                    </h1>
                ))}

                {


                    showicon && <span className='self-center ml-1.5'>{icon}</span>

                }
            </div>
        </>
    )
}

export default TextAnimation;